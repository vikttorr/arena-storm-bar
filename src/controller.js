import { BehaviorSubject, timer, empty } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap, delayWhen } from 'rxjs/operators';

import SDK from 'bebo-sdk';

const window_location = window.location.origin;
let env = 'prod';
if (window_location.indexOf('renegade') > -1) {
  env = 'dev';
} else if (window_location.indexOf('greengoblin') > -1) {
  env = 'dev';
} else if (window_location.indexOf('bebo-dev') > -1) {
  env = 'dev';
} else if (window_location.indexOf('bebo-ptr') > -1) {
  env = 'ptr';
} else if (window_location.indexOf('localhost') > -1) {
  env = 'dev';
}

let feeds_url = '';

if (env === 'dev') {
  feeds_url = 'https://feeds.bebo-dev.com';
} else if (env === 'prod') {
  feeds_url = 'https://feeds.bebo.com';
} else if (env === 'renegade') {
  feeds_url = 'https://renegade.bebo-dev.com:8651';
} else if (env === 'ptr') {
  feeds_url = 'https://feeds.bebo-ptr.com';
} else if (env === 'greengoblin') {
  feeds_url = 'http://greengoblin.bebo-dev.com:8650';
}

const TOURNAMENT_CHECK_LOOP = 30 * 1000; //we check if there is a valid tournament every minute, this will turn everything else on / off
const LEADERBOARD_LOOP = 3 * 1000;

console.log('env == ', env);
class Controller {
  constructor() {
    this.widget = null;
    this.stream_id = null;

    this.setupSubjects();
    this.start();

    this.loop_running = false;
  }

  setupSubjects = () => {
    //raw data
    this.leaderBoard = new BehaviorSubject([]);

    //used by widget

    this.activeTournament = new BehaviorSubject(null);
    this.liveViewers = new BehaviorSubject(0);
    this.teamsAlive = new BehaviorSubject(0);
    this.teamsInStorm = new BehaviorSubject(0);
    this.teamsEliminated = new BehaviorSubject(0);
    this.totalTeams = new BehaviorSubject(0);
    this.nextStormDate = new BehaviorSubject(Date.now());
    this.team = new BehaviorSubject(null);
    this.uiState = new BehaviorSubject('normal');

    //internal

    this.startDerivativeSubscriptions();
  };

  startDerivativeSubscriptions = () => {
    const filteredLeaderboard = this.leaderBoard.pipe(filter(teams => Array.isArray(teams)));
    filteredLeaderboard
      .pipe(
        map(teams => {
          const teamIndex = teams.findIndex(t => t.usernames.indexOf(this.user_name) > -1 || null);
          if (teamIndex === -1) {
            return null;
          }
          return {
            ...teams[teamIndex],
            rank: teamIndex + 1
          };
        }),
        filter(team => team),
        distinctUntilChanged()
      )
      .subscribe(this.team);

    filteredLeaderboard
      .pipe(
        map(teams => teams.length),
        distinctUntilChanged()
      )
      .subscribe(this.totalTeams);

    filteredLeaderboard
      .pipe(
        map(teams => teams.filter(t => t.state === 'alive').length),
        distinctUntilChanged()
      )
      .subscribe(this.teamsAlive);
    filteredLeaderboard
      .pipe(
        map(teams => teams.filter(t => t.state === 'storm').length),
        distinctUntilChanged()
      )
      .subscribe(this.teamsInStorm);
    filteredLeaderboard
      .pipe(
        map(teams => teams.filter(t => t.state === 'eliminated').length),
        distinctUntilChanged()
      )
      .subscribe(this.teamsEliminated);

    //for UI purposes
    timer(0, 1000)
      .pipe(
        switchMap(() =>
          this.nextStormDate.pipe(
            filter(d => d),
            map(date => {
              if (date !== 'ended') {
                const now = Date.now() + 5000;
                const then = Date.parse(date);
                return now >= then;
              }
              return false;
            }),
            map(bool => (bool ? 'storm' : 'normal'))
          )
        ),
        distinctUntilChanged(),
        delayWhen(val => (val === 'normal' ? timer(5000) : empty()))
      )
      .subscribe(state => this.uiState.next(state));
  };

  handleSDKMessage = message => {
    if (message && message.url && message.url === '/user/login') {
      if (message.access_token) {
        this.access_token = message.access_token;
        this.user_name = message.username;
        this.checkForTournament();
      }
    }
  };

  start = () => {
    SDK.onMessage = this.handleSDKMessage;
    return SDK.getWidget().then(() => {
      SDK.requestData('/user/login');
    });
  };

  checkForTournament = () => {
    this.getTournament()
      .then(() => {
        this.startPollLoop();
        setTimeout(this.checkForTournament, TOURNAMENT_CHECK_LOOP);
      })
      .catch(err => {
        console.error('checkForTournament Failed', err);
        this.stopPollLoop();
        setTimeout(this.checkForTournament, TOURNAMENT_CHECK_LOOP);
      });
  };

  startPollLoop = () => {
    if (this.loop_running) {
      return;
    }
    this.loop_running = true;
    //leaderboard
    this.getLeaderBoard()
      .then(this.getTotalViewers)
      .then(this.getNextCutoff);
    this.leaderBoardInterval = setInterval(this.getLeaderBoard, LEADERBOARD_LOOP);
    //total viewers
    this.totalViewersInterval = setInterval(this.getTotalViewers, LEADERBOARD_LOOP);
    //storm
    this.nextStormInterval = setInterval(this.getNextCutoff, LEADERBOARD_LOOP);
  };

  stopPollLoop = () => {
    if (!this.loop_running) {
      return;
    }
    this.loop_running = false;
    if (this.leaderBoardInterval) {
      clearInterval(this.leaderBoardInterval);
    }
    if (this.totalViewersInterval) {
      clearInterval(this.totalViewersInterval);
    }
    if (this.nextStormInterval) {
      clearInterval(this.nextStormInterval);
    }
  };

  getNextCutoff = () => {
    const tournament_id = (this.activeTournament.getValue() || {}).id;
    if (!tournament_id) {
      //this.shouldRender.next(false);
      this.leaderBoard.next([]);
      return console.error('no tournament id');
    }
    return this.httpGet(
      `${feeds_url}/eligibility/tournament/next_cutoff?tournament_id=${tournament_id}`
    )
      .then(res => {
        const storm_date = res.result[0];
        this.nextStormDate.next(
          storm_date.state === 'ended' ? 'ended' : storm_date.activation_dttm
        );
      })
      .catch(err => {
        console.error('failed to get the leaderboard', err);
      });
  };

  getLeaderBoard = () => {
    const tournament_id = (this.activeTournament.getValue() || {}).id;
    if (!tournament_id) {
      //this.shouldRender.next(false);
      this.leaderBoard.next([]);
      return console.error('no tournament id');
    }
    return this.httpGet(`${feeds_url}/leaderboard?tournament_id=${tournament_id}`)
      .then(res => {
        const leaderboard = res.result;
        this.leaderBoard.next(leaderboard);
      })
      .catch(err => {
        console.error('failed to get the leaderboard', err);
      });
  };

  getTotalViewers = () => {
    const currentLeaderBoard = this.leaderBoard.getValue();

    if (!currentLeaderBoard || !Array.isArray(currentLeaderBoard) || !currentLeaderBoard.length) {
      return;
    }
    const usernames = currentLeaderBoard.reduce((accu, cur) => accu.concat(cur.usernames), []);

    return this.httpGet(`${feeds_url}/viewer/twitch?twitch_usernames=${usernames.join(',')}`)
      .then(res => {
        const viewers = res.result[0].live_viewers;
        this.liveViewers.next(viewers);
      })
      .catch(err => {
        console.error('failed to getTotalViewers', err);
      });
  };

  getTournament = () => {
    return this.httpGet(`${feeds_url}/eligibility/tournament`)
      .then(res => {
        const tournament = res.result[0];
        this.activeTournament.next(tournament);
      })
      .catch(err => {
        console.error('failed to get the tournament_data', err);
        return Promise.reject(err);
      });
  };

  httpGet = url => {
    //const options = { json: true };
    const headers = {
      'Content-Type': 'application/json',
      'X-Access-Token': this.access_token,
      'X-Riano-User-Agent': navigator.userAgent
    };
    const options = {
      method: 'GET',
      headers,
      mode: 'cors'
    };
    return fetch(url, options).then(r => r.json());
  };
}

const singleton = new Controller();
export default singleton;
