import React, { Component } from 'react';
import { Spring } from 'react-spring';
import './ArenaBarStorm.css';
import cx from 'classnames';

export default class ArenaBarStorm extends Component {
  render() {
    const { large, totalTeams, teamsInStorm, teamsEliminated, teamRank, teamState } = this.props;

    const teamPercent = 100 - ((teamRank - 0.5) / totalTeams) * 100;
    const stormPercent = (teamsInStorm / totalTeams) * 100;
    const elimPercent = (teamsEliminated / totalTeams) * 100;
    const safePercent = 100 - elimPercent - stormPercent;

    const firstStormRank = totalTeams - teamsEliminated;
    let lastStormRank = firstStormRank - teamsInStorm;
    if (lastStormRank < 2) {
      lastStormRank = 2;
    }

    const elimStyle = {
      // transform:'translate3d(-50%,0,0)'
      width: `${elimPercent}%`
    };
    const stormStyle = {
      // transform:'translate3d(-70%,0,0)'
      left: `${elimPercent}%`,
      width: `${stormPercent}%`
    };

    const safeStyle = {
      // transform:'translate3d(-70%,0,0)'
      left: `${elimPercent + stormPercent}%`,
      width: `${safePercent}%`
    };

    return (
      <Spring from={{ hieght: '4px' }} to={{ height: !large ? '4px' : '20px' }}>
        {style => (
          <div className="arena-bar-storm" style={style}>
            <div
              className={cx('arena-bar-storm__team', {
                bounce: large,
                storm: teamState === 'storm',
                alive: teamState === 'alive',
                winner: teamState === 'winner',
                eliminated: teamState === 'eliminated'
              })}
              style={{ left: `${teamPercent}%` }}
            />
            <div className="arena-bar-storm__progress">
              <div className="arena-bar-storm__progress--elim" style={elimStyle}>
                {elimPercent < 7 ? null : elimPercent < 17 ? (
                  <span>elim</span>
                ) : (
                  <span>eliminated</span>
                )}
              </div>
              <div className="arena-bar-storm__progress--storm" style={stormStyle}>
                {teamsEliminated === 0 ? null : (
                  <span className="arena-bar-storm__progress--storm--first">
                    {getGetOrdinal(firstStormRank)}
                  </span>
                )}
                {stormPercent >= 11 ? <span>storm</span> : null}
                <span className="arena-bar-storm__progress--storm--last">
                  {getGetOrdinal(lastStormRank)}
                </span>
              </div>
              <div className="arena-bar-storm__progress--safe" style={safeStyle}>
                {safePercent >= 8 ? <span>safe</span> : null}
              </div>
            </div>
          </div>
        )}
      </Spring>
    );
  }
}

const getGetOrdinal = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
