import React, { PureComponent, Component } from 'react';
import { Transition } from 'react-spring';
import './ArenaBarBackground.css';

import assetLightning1 from './assets/lightning_1.png';
import assetLightning2 from './assets/lightning_2.png';
import assetLightning3 from './assets/lightning_3.png';

export default class ArenaBarBackground extends PureComponent {
  render() {
    const { state } = this.props;

    const states = {
      storm: [
        assetLightning1,
        assetLightning2,
        assetLightning3
      ],
      default: ['test', 'test']
    };

    const images = states[state] ? states[state] : states['default'];

    return <BackgroundAnimation images={images} />;
  }
}

class BackgroundAnimation extends Component {
  state = {
    index: 0
  };


  render() {
    const { index } = this.state;
    const { images } = this.props;

    return (
      <div className="arena-bar-background animate">
        {images.map((image, i) => <img key={i} src={image} alt="" className="arena-bar-background__img" />)}
      </div>
    );
  }
}
