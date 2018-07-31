import { BehaviorSubject, interval } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

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

const UI_STATES = [
  { id: 'transition', seconds: 10 },
  { id: 'bar', seconds: 120 }
  //{ id: 'storm', seconds: 60 },
  //{ id: 'stats', seconds: 60 }
  //{ id: 'transition', seconds: 1 },
  //{ id: 'promo', seconds: 6, promo_id: 'postmates' },

  //{ id: 'stats', seconds: 8 },
  //{ id: 'score', seconds: 6 },
  //{ id: 'transition', seconds: 1 },

  //{ id: 'promo', seconds: 6, promo_id: 'meta-threads' },
  //{ id: 'transition', seconds: 1 },
  //{ id: 'stats', seconds: 7 },
  //{ id: 'score', seconds: 8 },
  //{ id: 'storm', seconds: 9 }
  //{ id: 'transition', seconds: 1 },
];

const TOURNAMENT_CHECK_LOOP = 30 * 1000; //we check if there is a valid tournament every minute, this will turn everything else on / off
const LEADERBOARD_LOOP = 10 * 1000;

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
    this.totalTeams = new BehaviorSubject(0);
    this.nextStormDate = new BehaviorSubject(Date.now());
    this.team = new BehaviorSubject(null);
    this.teamLeaderBoardRank = new BehaviorSubject();
    this.teamScore = new BehaviorSubject(0);
    this.uiState = new BehaviorSubject({ id: 'transition', seconds: 0 });

    //internal
    this.tick = interval(1000);

    this.startDerivativeSubscriptions();
  };

  computeAvailableUIStates = () => {
    return UI_STATES.filter(state => {
      if (state.id === 'score' && !this.team.getValue()) {
        return false;
      }
      if (state.id === 'stats' && !this.totalTeams.getValue()) {
        return false;
      }
      if (
        state.id === 'storm' &&
        (!this.nextStormDate.getValue() ||
          !this.team.getValue() ||
          !this.teamLeaderBoardRank.getValue())
      ) {
        return false;
      }

      return true;
    }).filter((state, i, array) => {
      const previousState = array[i - 1] || array[array.length - 1];
      if (
        previousState &&
        state.id === previousState.id &&
        previousState.promo_id === state.promo_id &&
        state.id !== 'transition'
      ) {
        return false;
      }
      return true;
    });
  };

  startDerivativeSubscriptions = () => {
    const filteredLeaderboard = this.leaderBoard.pipe(filter(teams => Array.isArray(teams)));
    filteredLeaderboard
      .pipe(
        map(teams => teams.find(t => t.usernames.indexOf(this.user_name) > -1 || null)),
        filter(team => team),
        distinctUntilChanged()
      )
      .subscribe(this.team);

    this.team
      .pipe(filter(team => team), map(team => team.score), distinctUntilChanged())
      .subscribe(this.teamScore);

    filteredLeaderboard
      .pipe(
        map(teams => {
          try {
            return teams.findIndex(t => t.id === this.team.getValue().id) + 1;
          } catch (e) {
            return 0;
          }
        }),
        distinctUntilChanged()
      )
      .subscribe(this.teamLeaderBoardRank);

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
  };

  setupUITriggers = () => {
    let ui_states = this.computeAvailableUIStates();
    let nextUiStateOnTick = 5;
    let currentUiState = 0;
    this.tick.subscribe(nextTick => {
      ui_states = this.computeAvailableUIStates();
      console.log('tick', { tick: nextTick, nextUiStateOnTick, currentUiState });
      if (nextTick === nextUiStateOnTick) {
        //go to next state
        //next state is the next one in the array OR the first one in the array (when we hit the end)
        let nextStateId = currentUiState + 1;
        if (!ui_states[nextStateId]) {
          nextStateId = 0;
        }

        const nextState = ui_states[nextStateId];
        currentUiState = nextStateId;
        nextUiStateOnTick += env === 'dev' ? nextState.seconds / 2 : nextState.seconds;
        if (this.nextStormDate.getValue() === 'ended') {
          this.uiState.next({ id: 'storm', seconds: 5000 });
        } else {
          this.uiState.next(nextState);
        }
      }
    });
  };

  handleSDKMessage = message => {
    if (message && message.url && message.url === '/user/login') {
      if (message.access_token) {
        this.access_token = message.access_token;
        this.user_name = message.username;
        this.checkForTournament();
        this.setupUITriggers();
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
      return Promise.reject('no_tournament_id');
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
      return Promise.reject('no_tournament_id');
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
