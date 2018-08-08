import React, { Component } from 'react';
import cx from 'classnames';
import './ArenaBarTeam.css';

export default class ArenaBarTeam extends Component {

  stats = {

  }

  componentDidUpdate = prevProps => {
    if(this.props.rank && prevProps.rank !== this.props.rank) {
      this.animateRank();
    }
    if(this.props.score && prevProps.score !== this.props.score) {
      this.animateScore();
    }
  }

  animateRank = () => {

  }

  animateScore = () => {

  }

  renderName = (name, i) => {
    const { usernames } = this.props;
    return usernames.map((name, i) => {
      console.log(" arena bar - render:", {name, i: i+1, l:usernames.length})
      if(usernames.langth >= i+1){
        return <span className='arena-bar-team__name--item'>{name}</span>
      }
      return [<span className='arena-bar-team__name--item'>{name}</span>, <span className='arena-bar-team__name--seperator'>/</span>]
    })
  }

  render() {
    const { score, avatars, name, usernames, rank} = this.props;
    const avatarClasses = cx('arena-bar-team__avatar', `avatars-${usernames.length}`)
    return (
      <div className='arena-bar-team'>
        <span className='arena-bar-team__rank'>{`${getGetOrdinal(rank)}`}</span>
        <div className={avatarClasses}>
          {avatars && avatars.map(avatar => <img src={avatar} className='arena-bar-team__avatar--img'/>)}
        </div>
        <div className='arena-bar-team__name'>
          <span className='arena-bar-team__name--inner'>
            {usernames && this.renderName()}
          </span>
        </div>
        <div className='arena-bar-team__score'>
          {score}
        </div>
      </div>
    )
  }
}



const getGetOrdinal = n => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}