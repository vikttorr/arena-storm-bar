import React, { PureComponent } from 'react';

import CountDown from 'react-countdown-now';

import './TournamentWidget.css';

import TournamentWidgetScore from './TournamentWidgetScore';
// import TournamentWidgetStorm from './TournamentStorm';

export default class TournamentWidget extends PureComponent {
  renderBar() {
    const {
      team,
      nextStormDate,
      activeTournament,
      // teamsAlive,
      liveViewers
    } = this.props;

    return (
      <div className="tournament-widget">
        <div className="tournament-widget__bar" style={{ background: '#a642ff' }} />
        <div className="tournament-widget__left">
          <TournamentWidgetScore team={team.usernames} score={team.score} />
        </div>
        <div className="tournament-widget__center">
            <img
              className="tournament-widget__logo"
              src={activeTournament.image_url}
              alt={activeTournament.name}
            />
        </div>
        <div className="tournament-widget__right">
          <div className='tournament-widget__right--section storm-section'>
               <span className='tournament-widget__right--section__label'>Storm in</span>
              {nextStormDate ? (
                <CountDown
                  date={nextStormDate}
                  renderer={({ minutes, seconds, completed }) => {
                    return completed ? <span className='storm-count'>Now!</span> : <span className='storm-count'>{`${minutes}:${seconds}`}</span>;
                  }}
                />
              ) : (
                'Soon'
              )}
          </div>
          <div className='tournament-widget__right--section'>
              <span className='tournament-widget__right--section__label'>Viewers</span>
              <span className='tournament-widget__right--section__count'>{numberWithCommas(liveViewers)}</span>
          </div>
        </div>
      </div>
    );
  }


  renderState = state => {
    return this.renderBar();
  };

  render() {
    const { state } = this.props;
    return this.renderState(state);
  }
}


const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
