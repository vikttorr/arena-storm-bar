import React, { Component } from 'react';
import { Spring } from 'react-spring';
import './ArenaBarStorm.css';
import cx from 'classnames';
import Color from 'color'


export default class ArenaBarStorm extends Component {
  render() {
    const { isDark, large, totalTeams, teamsInStorm, teamsEliminated, teamRank, teamState, primaryColor } = this.props;

    const teamPercent = 100 - ((teamRank - 0.5) / totalTeams) * 100;
    const stormPercent = (teamsInStorm / totalTeams) * 100;
    const elimPercent = (teamsEliminated / totalTeams) * 100;
    const safePercent = 100 - elimPercent - stormPercent;

    const firstStormRank = totalTeams - teamsEliminated;
    let lastStormRank = firstStormRank - teamsInStorm;
    if (lastStormRank < 2) {
      lastStormRank = 2;
    }

    // colors
    const elimColor = Color(primaryColor).darken(0.1).hex()
    const stripe1 = Color(primaryColor).darken(0.2).hex()
    const stripe2 = Color(primaryColor).darken(0.4).hex()
    const gradient = `repeating-linear-gradient(45deg, ${stripe1}, ${stripe1} 5px, ${stripe2} 5px, ${stripe2} 10px)`
    console.log('grad', gradient);
    const elimStyle = {
      background: elimColor,
      width: `${elimPercent}%`
    };
    const stormStyle = {
      background:gradient,
      left: `${elimPercent}%`,
      width: `${stormPercent}%`
    };

    const safeStyle = {
      background: 'transparent',
      left: `${elimPercent + stormPercent}%`,
      width: `${safePercent}%`
    };
    
    const barStyle= {
      background: isDark ? `rgba(0,0,0,.5)` : `rgba(255,255,255,0.5)`
    }

    const trackStyle = {
      background: isDark ? `rgba(0,0,0,.5)` : `rgba(255,255,255,0.5)`
    }

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
              style={{ left: `${teamPercent}%`, borderTopColor:isDark ? '#FFF' : '#000' }}
            />
            <div className="arena-bar-storm__progress" style={trackStyle}>
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
