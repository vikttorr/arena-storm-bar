import React, { Component } from 'react';
import { Spring, animated } from 'react-spring';
import './ArenaBarMessage.css';

export default class ArenaBarMessage extends Component {
  state = {
    visible: false,
    state: ''
  };

  componentDidMount = () => {
    if (this.props.state === 'storm' || this.props.state === 'eliminated') {
      return this.setState({ visible: true, state: this.props.state });
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.state && prevProps.state !== this.props.state) {
      if (this.props.state === 'storm' || this.props.state === 'eliminated') {
        if (this.state.visible) {
          return this.setState({ visible: false }, () =>
            setTimeout(() => this.setState({ visible: true, state: this.props.state }), 800)
          );
        }
        return this.setState({ visible: true, state: this.props.state });
      }
      return this.setState({ visible: false });
    }
  };

  renderMessage = () => {
    const stormIcon = 'https://a.imgdropt.com/image/7e728172-8167-427e-ac05-a4988b58226c';
    const skullIcon = 'https://a.imgdropt.com/image/bd57ba95-7e1a-43fd-9b7a-5e10c1654dff';
    const { state } = this.state;

    switch (state) {
      case 'eliminated':
        return (
          <div className="arena-bar-message__content eliminated">
            <div className="arena-bar-message__content--state">
              <img src={skullIcon} className="arena-bar-message__content--state__icon skull" />
              <span className="arena-bar-message__content--state__text">Eliminated</span>
            </div>
            <div className="arena-bar-message__content--rotatinng-msg">Eliminat</div>
          </div>
        );
      case 'storm':
        return (
          <div className="arena-bar-message__content storm">
            <div className="arena-bar-message__content--state">
              <img src={stormIcon} className="arena-bar-message__content--state__icon" />
              <div className="arena-bar-message__content--state__text"> In the Storm!</div>
            </div>
            <div className="arena-bar-message__content--rotating-msg">
              Safe zone / 20 pointspointspoints
            </div>
          </div>
        );
      case 'winner':
        return (
          <div className="arena-bar-message__content storm">
            <div className="arena-bar-message__content--state">
              <img src={stormIcon} className="arena-bar-message__content--state__icon" />
              <div className="arena-bar-message__content--state__text"> In the Storm!</div>
            </div>
            <div className="arena-bar-message__content--rotating-msg">
              Safe zone / 20 pointspointspoints
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const { visible, state } = this.state;
    const toStyle = {
      transform: visible ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, 60px, 0px)',
      boxShadow: visible ? `0px 0px 27px rgba(0, 0, 0, 0.54)` : `0px 0px 0px rgba(0, 0, 0, 0.54)`
    };

    return (
      <Spring from={{ transform: `translate3d(0px, 0px, 0px)` }} to={toStyle}>
        {style => (
          <animated.div style={style} className={`arena-bar-message ${state}`}>
            {this.renderMessage()}
          </animated.div>
        )}
      </Spring>
    );
  }
}
