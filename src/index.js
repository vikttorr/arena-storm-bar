import React, { Component } from 'react';
import { render } from 'react-dom';
import controller from './controller.js';
import TournamentWidget from './TournamentWidget';
import ArenaBar from './ArenaBar';

class Widget extends Component {
  state = {
    uiState: 'score', //what state in the ui rotation are we in
    activeTournament: null, //what's the currently active tournament (has image, tournament name etc)
    liveViewers: 0, //how many live viewers does the tournament have combined right now
    teamsAlive: 0, //how many teams are still alive
    totalTeams: 0, //how many total teams are there
    nextStormDate: 0, //timestamp of the next storm (in UTC time)
    team: null, //what team is the user of the browsersource on
    teamLeaderBoardRank: 0, //what is the current rank of the team
    teamScore: 0 //what is the current score of the team
  };

  componentDidMount() {
    controller.uiState.subscribe(uiState => this.setState({ uiState: uiState.id }));
    controller.activeTournament.subscribe(activeTournament => this.setState({ activeTournament }));
    controller.liveViewers.subscribe(liveViewers => this.setState({ liveViewers }));
    controller.teamsAlive.subscribe(teamsAlive => this.setState({ teamsAlive }));
    controller.totalTeams.subscribe(totalTeams => this.setState({ totalTeams }));
    controller.nextStormDate.subscribe(nextStormDate => this.setState({ nextStormDate }));
    controller.team.subscribe(team => this.setState({ team }));
    controller.teamLeaderBoardRank.subscribe(teamLeaderBoardRank =>
      this.setState({ teamLeaderBoardRank })
    );
    controller.teamScore.subscribe(teamScore => this.setState({ teamScore }));
  }

  render() {
    //console.log('*** state update', { ...this.state });
    const { uiState, activeTournament, team, ...rest } = this.state;

    // if (!activeTournament || !team) {
    //   //if we don't hace an active tournament there is nothing for us to render at all
    //   return null;
    // }


    const dummyTeam = {
        id: 'test_1',
        stream_id: 'e3db336d10214657bab8983155715199',
        tournament_id: '7738854e-c008-4156-a461-6f8a04f140a3',
        usernames: ['professorbroman', 'drdisrespectlive'],
        player_stream_ids: ['e3db336d10214657bab8983155715199'],
        name: "",
        code: '416874',
        created_dttm: '2018-07-28T09:34:21.070Z',
        updated_dttm: '2018-07-28T09:34:21.070Z',
        deleted_dttm: null,
        state: 'storm',
        score: 25
      }

    return <ArenaBar
      team={dummyTeam}
    />

    // return (
    //   <div className="container">
    //     <TournamentWidget
    //       state={uiState}
    //       activeTournament={activeTournament}
    //       team={team}
    //       {...rest}
    //       // {...testProps}
    //     />
    //   </div>
    // );
  }
}

render(<Widget />, document.getElementById('root'));
