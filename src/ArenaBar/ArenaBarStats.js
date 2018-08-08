import React, { PureComponent } from 'react';
import { Transition, animated } from 'react-spring';
import './ArenaBarStats.css';

export default class ArenaBarStats extends PureComponent {


  render() {
    const { stats = [] } = this.props;
    return (
      <div className='arena-bar-stats'>
        <ul className='arena-bar-stats__list'> 
          {stats.map(stat => <ArenaBarStatsItem {...stat}/>)}
        </ul> 
      </div>
    )
  }
}

class ArenaBarStatsItem extends PureComponent {
  render(){
    const { label, value} = this.props;
    return <li className='arena-bar-stats__item'>
      <span className='arena-bar-stats__item--label'>{label}</span>
      <span className='arena-bar-stats__item--value'>{value}</span>
    </li>
  }
} 

const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
