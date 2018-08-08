import React, { Component } from 'react'
import './ArenaBarLogo.css';

export default class ArenaBarLogo extends Component {
  render() {
    const { image } = this.props;
    return (
      <div className='arena-bar-logo'>
        <img src={image} className='arena-bar-logo__img'/>
      </div>  
    )
  }
}
