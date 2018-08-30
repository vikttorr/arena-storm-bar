import React, { Component } from 'react';
import { Spring, animated } from 'react-spring';
import './ArenaBarMessage.css';

import trophy from './assets/trophy.svg';

export default class ArenaBarMessage extends Component {


  renderMessage = state => {
    const { primaryColor } = this.props;
    switch (state) {
      case "storm":
        return  <div className='arena-bar-message__content'>
          <b style={{color:primaryColor}}>WARNING</b>
          In the storm
        </div>
      case "eliminated":
        return  <div className='arena-bar-message__content'>
          Team has been
          <b style={{color:primaryColor}}>ELIMINATED</b>
        </div>
      case "winner":
        return  <div className='arena-bar-message__content'>
          Winner
        </div>        
      default:
        break;
    }
  }

  render() {
    const {isDark, visible, state } = this.props;

    const toStyle = {
      transform: visible ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, 60px, 0px)',
      boxShadow: visible ? `0px 0px 27px rgba(0, 0, 0, 0.54)` : `0px 0px 0px rgba(0, 0, 0, 0.54)`
    };
    
    const messageStyle = {
      background: isDark ? "#131313" : '#e6e6e6'
    }

    return (
      <Spring from={{ transform: `translate3d(0px, 0px, 0px)` }} to={toStyle}>
        {style => (
          <animated.div style={{...style, ...messageStyle}} className={`arena-bar-message`}>
            {this.renderMessage(state)}
          </animated.div>
        )}
      </Spring>
    );
  }
}


