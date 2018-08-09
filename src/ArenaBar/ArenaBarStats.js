import React, { PureComponent } from 'react';
//import { Transition, animated } from 'react-spring';
import './ArenaBarStats.css';

export default class ArenaBarStats extends PureComponent {
  render() {
    const { stats = [] } = this.props;
    return (
      <div className="arena-bar-stats">
        <ul className="arena-bar-stats__list">
          {stats.map(stat => (
            <ArenaBarStatsItem key={stat.label} {...stat} />
          ))}
        </ul>
      </div>
    );
  }
}

class ArenaBarStatsItem extends PureComponent {
  render() {
    const { label, value } = this.props;
    return (
      <li className="arena-bar-stats__item">
        <span className="arena-bar-stats__item--label">{label}</span>
        <span className="arena-bar-stats__item--value">{safeNumberWithCommas(value)}</span>
      </li>
    );
  }
}

const safeNumberWithCommas = x => {
  if(!Number.isInteger(x) || x < 1000){
    return x;
  }
  let parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
