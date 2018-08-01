import React, { PureComponent } from 'react';

import CountDown from 'react-countdown-now';

import './TournamentWidget.css';

import TournamentWidgetScore from './TournamentWidgetScore';
import TournamentWidgetStorm from './TournamentStorm';

export default class TournamentWidget extends PureComponent {
  renderBar() {
    const {
      team,
      nextStormDate,
      activeTournament,
      teamLeaderBoardRank,
      totalTeams,
      teamsAlive
    } = this.props;

    return (
      <div className="tournament-widget">
        <div className="tournament-widget__bar" style={{ background: '#a642ff' }} />
        <div className="tournament-widget__left">
          <TournamentWidgetScore team={team.usernames} score={team.score} />
        </div>
        <div className="tournament-widget__center">
          {nextStormDate !== 'ended' && (
            <div className="tournament-widget__center__left">STORM IN</div>
          )}
          <div className="tournament-widget__center__center">
            <img
              className="tournament-widget__logo"
              src={activeTournament.image_url}
              alt={activeTournament.name}
            />
          </div>
          {nextStormDate !== 'ended' && (
            <div className="tournament-widget__center__right">
              {nextStormDate ? (
                <CountDown
                  date={nextStormDate}
                  renderer={({ minutes, seconds, completed }) => {
                    return completed ? <span>Now!</span> : <span>{`${minutes}:${seconds}`}</span>;
                  }}
                />
              ) : (
                'Soon'
              )}
            </div>
          )}
        </div>
        <div className="tournament-widget__right">
          <TournamentWidgetStorm
            teamRank={teamLeaderBoardRank}
            totalTeams={totalTeams}
            teamsAlive={teamsAlive}
          />
        </div>
      </div>
    );
  }

  renderState = state => {
    if (state === 'transition') {
      return this.renderBar();
    } else {
      return this.renderBar();
    }
  };

  render() {
    const { state } = this.props;

    return this.renderState(state);
  }
}
