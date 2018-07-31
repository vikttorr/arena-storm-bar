import React, { Component } from 'react';
import { Spring, config } from 'react-spring';
import cx from 'classnames';

import assetRiftShardInner from './assets/rift-shard-inner.png';
import assetRiftShardOuter from './assets/rift-shard-outer.png';
import assetRiftSpark from './assets/energy_red.webm';

export default class FortniteRift extends Component {
  state = {
    mounted: false,
    idle: false
  };

  componentDidMount() {
    this.setState({ mounted: true });
    setTimeout(() => this.setState({ idle: true }), 500);
  }

  render() {
    const classes = cx(
      'fortnite-rift',
      { 'animate-in': this.state.mounted && !this.state.idle },
      { idle: this.state.idle }
    );
    const fromStyle = { trasnform: `scale(0)`, opacity: 0 };
    const toStyle = { opacity: 1, transform: `scale(1)` };

    return (
      <Spring config={config.default} from={fromStyle} to={toStyle}>
        {style => (
          <div className={classes}>
            {/* <img src={}  className='fortnite-rift__item'/> */}
            <img
              alt=""
              src={assetRiftShardInner}
              className="fortnite-rift__shared fortnite-rift__inner"
            />
            <img
              alt=""
              src={assetRiftShardOuter}
              className="fortnite-rift__shared fortnite-rift__outer"
            />
            <div className="fortnite-rift__vortex" />
            <video src={assetRiftSpark} autoPlay loop className="fortnite-rift__spark" />
          </div>
        )}
      </Spring>
    );
  }
}
