import React, { Component } from 'react';
import cx from 'classnames';
// import tinyColor from 'tinycolor';

import './ArenaBarTeam.css';

export default class ArenaBarTeam extends Component {
  stats = {};

  componentDidUpdate = prevProps => {
    if (this.props.rank && prevProps.rank !== this.props.rank) {
      // this.animateRank();
    }
    if (this.props.score && prevProps.score !== this.props.score) {
      const diff = this.props.score - prevProps.score;
      this.animateScore(diff);
    }
  };

  animateRank = () => {
    
  };

  animateScore = diff => {
    console.log("score diff", diff);
      console.log('ref ->', this.refs.score);
    const scoreEl = document.createElement('div');
    scoreEl.className = 'arena-bar-team__score--diff'
    scoreEl.innerHTML = `${diff}`;
    this.refs.score.appendChild(scoreEl);
    setTimeout(() => {
      scoreEl.remove()
    }, 1100)
  };


  renderName = (name, i) => {
    const { usernames } = this.props;
    return usernames.map((name, i) => (
      <div key={name} className="arena-bar-team__name--item">
        {name}
      </div>
    ));
  };

  render() {
    const { score, avatars, usernames, rank, primaryColor } = this.props;

    // const _primaryColor = tinyColor(primaryColor);
    // const rankTextColor = tinyColor.mostReadable(primaryColor, ['#000', '#FFF'])

    const scoreStyle = { color: primaryColor }
    const rankStyle = { 
      backgroundColor: primaryColor,
      color:'#000'
    };

    const avatarClasses = cx('arena-bar-team__avatar', `avatars-${usernames.length}`);
    return (
      <div className="arena-bar-team">
        <span
          style={rankStyle}
          className={cx('arena-bar-team__rank', {
            first: rank === 1,
            second: rank === 2,
            third: rank === 3
          })}
        >
          <span className="arena-bar-team__rank__number">{rank}</span>
          <span className="arena-bar-team__rank__ordinal">{`${getGetOrdinal(rank)}`}</span>
        </span>
        <div className={avatarClasses}>
          {avatars &&
            avatars.map(avatar => (
              <img src={avatar} alt="" key={avatar} className="arena-bar-team__avatar--img" />
            ))}
        </div>
        <div className="arena-bar-team__name">
          <span className="arena-bar-team__name--inner">{usernames && this.renderName()}</span>
        </div>
        <div ref={'score'} style={scoreStyle} className="arena-bar-team__score">{score}</div>
      </div>
    );
  }
}

const getGetOrdinal = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
