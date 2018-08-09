import React, { Component } from 'react';
import { Spring } from 'react-spring';
import './ArenaBarStorm.css';

export default class ArenaBarStorm extends Component {
  render() {
    const { large, totalTeams, teamsInStorm, teamsEliminated, teamRank } = this.props;

    const teamPercent = 100 - (teamRank / totalTeams) * 100;
    const stormPercent = ((teamsInStorm + teamsEliminated) / totalTeams) * 100;
    const elimPercent = (teamsEliminated / totalTeams) * 100;

    const elimStyle = {
      // transform:'translate3d(-50%,0,0)'
      width: `${elimPercent}%`
    };
    const stormStyle = {
      // transform:'translate3d(-70%,0,0)'
      width: `${stormPercent}%`
    };

    return (
      <Spring from={{ hieght: '6px' }} to={{ height: !large ? '6px' : '60px' }}>
        {style => (
          <div className="arena-bar-storm" style={style}>
            <div className="arena-bar-storm__team" style={{ left: `${teamPercent}%` }} />
            <div className="arena-bar-storm__progress">
              <div className="arena-bar-storm__progress--elim" style={elimStyle} />
              <div className="arena-bar-storm__progress--storm" style={stormStyle} />
            </div>
          </div>
        )}
      </Spring>
    );
  }
}
