import React, { PureComponent } from 'react';
import './ArenaBarBackground.css';

export default class ArenaBarBackground extends PureComponent {

  render() {
    const { state } = this.props;
    const states = {
      storm: 'https://a.imgdropt.com/image/ec0f931e-9a5f-4bc7-925f-2bc2685b3702',
      default: ''
    }
    
    const image = states[state] ? states[state] : states['default']

    return (
      <div className='arena-bar-background'>
        {image && <img src={image} className='arena-bar-background__img'/> }
      </div>
    )
  }
}


