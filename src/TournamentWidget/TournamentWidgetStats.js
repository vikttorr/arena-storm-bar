import React, { Component } from 'react';
import CountDown from 'react-countdown-now';
import './TournamentWidgetStats.css';

export default class TournamentWidgetStats extends Component {
  render() {
    const { teamsAlive, totalTeams, liveViewers, nextStormDate } = this.props;
    const stats = [
      {
        id: 'next_storm',
        label: 'Next Storm',
        value: nextStormDate ? (
          <CountDown
            restartOnDateChangeAfterComplete
            date={nextStormDate}
            renderer={({ minutes, seconds, completed }) => {
              return completed ? <span>Now!</span> : <span>{`${minutes}:${seconds}`}</span>;
            }}
          />
        ) : (
          'Soon'
        )
      },
      { id: 'teams_left', label: 'Teams Left', value: `${teamsAlive} / ${totalTeams} ` },
      { id: 'live_viewers', label: 'Live Viewers', value: numberWithCommas(liveViewers) }
    ].filter(stat => {
      if (stat.id === 'next_storm' && !nextStormDate) {
        return false;
      }
      if (stat.id === 'teams_left' && !totalTeams) {
        return false;
      }

      return true;
    });

    return (
      <ul className="tournament-widget-stats">
        {stats.map(stat => (
          <TournamentWidgetStatItem key={stat.id} {...stat} />
        ))}
      </ul>
    );
  }
}

class TournamentWidgetStatItem extends Component {
  render() {
    const { label, value } = this.props;
    return (
      <li className="tournament-widget-stats__item">
        <label className="tournament-widget-stats__item--label">{label}</label>
        <span className="tournament-widget-stats__item--value">{value}</span>
      </li>
    );
  }
}

const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
