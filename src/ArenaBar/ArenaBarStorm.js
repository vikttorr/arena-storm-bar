import React, { Component } from 'react'
import { Spring } from 'react-spring';
import './ArenaBarStorm.css';


export default class ArenaBarStorm extends Component {    
  render() {
    const { large } = this.props;    

    const elimStyle = {
      // transform:'translate3d(-50%,0,0)'
      width:'40%'
    };
    const stormStyle = {
      // transform:'translate3d(-70%,0,0)'
      width:'60%'
    };

    return (
      <Spring  from={{hieght: '6px'}} to={{height: !large ? '6px' : '60px'}}>
      {style => <div className='arena-bar-storm' style={style}  >
        <div className='arena-bar-storm__team'/>
        <div className='arena-bar-storm__progress'>
          <div className='arena-bar-storm__progress--elim' style={elimStyle}/>
          <div className='arena-bar-storm__progress--storm' style={stormStyle}/>
        </div>
      </div>}
      </Spring>
    )
  }
}




