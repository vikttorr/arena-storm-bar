import React, { Component } from 'react';
import { render } from 'react-dom';
import controller from './controller.js';
import TournamentWidget from './TournamentWidget';

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
    controller.uiState.subscribe(uiState => this.setState({ uiState }));
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
    const { uiState, activeTournament, ...rest } = this.state;

    if (!activeTournament) {
      //if we don't hace an active tournament there is nothing for us to render at all
      return null;
    }

    return (
      <div className={'container'}>
        <TournamentWidget uiState={uiState} activeTournament={activeTournament} {...rest} />
      </div>
    );
  }
}

render(<Widget />, document.getElementById('root'));
