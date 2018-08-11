import React, { Component } from 'react';
import cx from 'classnames';
import './ArenaBarTeam.css';

export default class ArenaBarTeam extends Component {
  stats = {};

  componentDidUpdate = prevProps => {
    if (this.props.rank && prevProps.rank !== this.props.rank) {
      this.animateRank();
    }
    if (this.props.score && prevProps.score !== this.props.score) {
      this.animateScore();
    }
  };

  animateRank = () => {};

  animateScore = () => {};

  renderName = (name, i) => {
    const { usernames } = this.props;
    return usernames.map((name, i) => (
      <div key={name} className="arena-bar-team__name--item">
        {name}
      </div>
    ));
  };

  render() {
    const { score, avatars, usernames, rank } = this.props;
    const avatarClasses = cx('arena-bar-team__avatar', `avatars-${usernames.length}`);
    return (
      <div className="arena-bar-team">
        <span
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
        <div className="arena-bar-team__score">{score}</div>
      </div>
    );
  }
}

const getGetOrdinal = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
