import React, { PureComponent, Component } from 'react';
import cx from 'classnames';

import './ArenaBarTeam.css';

export default class ArenaBarTeam extends Component {
  state = {
    animateScore:false,
  };

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
    this.setState({animateScore:true});
    const scoreEl = document.createElement('div');
    scoreEl.className = 'arena-bar-team__score--diff'
    scoreEl.innerHTML = `${Math.sign(diff) ? '+' : ''}${diff}`;
    this.refs.score.appendChild(scoreEl);
    setTimeout(() => {
      this.setState({animateScore:false});
    }, 600);
    setTimeout(() => {
      scoreEl.remove()
    }, 1100)
  };


  renderName = (name, i) => {
    const { usernames } = this.props;
    // check if me
    const me = 'drdisrespectlive';
    return usernames.map((name, i) => (
      <div key={name} className="arena-bar-team__name--item" style={{opacity: me === name ? 1 : 0.8}}>
        {name}
      </div>
    ));
  };

  render() {
    const { animateScore } = this.state;
    const { score, avatars, usernames, rank, state, primaryColor, isDark } = this.props;

    const scoreStyle = { color: primaryColor }
    const rankStyle = { 
      backgroundColor: primaryColor,
      color: isDark ? '#000' : '#FFF'
    };

    const avatarClasses = cx('arena-bar-team__avatar', `avatars-${usernames.length}`);
    const scoreClasses = cx('arena-bar-team__score', {'animate-score':animateScore})
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
          <AvatarOverlay isDark={isDark} state={state}/>
          {avatars &&
            avatars.map(avatar => (
              <img src={avatar} alt="" key={avatar} className="arena-bar-team__avatar--img" />
            ))}
        </div>
        <div className="arena-bar-team__name">
          <span className="arena-bar-team__name--inner">{usernames && this.renderName()}</span>
        </div>
        <div ref={'score'} style={scoreStyle} className={scoreClasses}>{score}</div>
      </div>
    );
  }
}



class AvatarOverlay extends PureComponent {
  render(){
    const {isDark, state} = this.props; 
    const skullIcon = isDark ? 'https://a.imgdropt.com/image/62979486-49ab-45d3-986f-73e724bef376' : 'https://a.imgdropt.com/image/facc8771-39c8-467b-8467-10612d4845fa'
    const stormIcon = isDark ? 'https://a.imgdropt.com/image/f54a0697-3d88-4e22-aea2-88664e774997' : 'https://a.imgdropt.com/image/eb669de8-68df-4167-ba8b-565ccb6cc609'

    const stateIconMap = {
      'storm': stormIcon,
      'eliminated': skullIcon
    }

    const style = {
      backgroundColor: state === 'alive' ? 'rgba(0,0,0,0)' : isDark ? `rgba(0,0,0,.7)` : `rgba(255,255,255,0.7)`,
    }
    return <div style={style} className='arena-bar__avatar-overlay'>
     {state !== 'alive' && <img className='arena-bar__avatar-overlay--icon' src={stateIconMap[state]} alt=''/> }
    </div>
  }
}


const getGetOrdinal = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
