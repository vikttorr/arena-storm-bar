import React, { Component } from 'react';
import './TournamentWidgetScore.css';

export default class TournamentWidgetScore extends Component {
  timeouts = [];
  state = {
    floatingNumbers: []
  };

  componentDidUpdate(prevProps) {
    if (prevProps.score !== this.props.score) {
      const scoreDiff = this.props.score - prevProps.score;
      this.addFloatingNumber(scoreDiff ? `+${scoreDiff}` : scoreDiff);
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  }

  addFloatingNumber = number => {
    var el = document.createElement('span');
    el.className = 'tournament-widget-score__count--floating-number';
    var node = document.createTextNode(number);
    el.appendChild(node);
    this.countEl.appendChild(el);
    this.countEl.classList.add('score-increased');
    el.classList.add('animate');
    const timeout = setTimeout(() => {
      el.remove();
      this.countEl.classList.remove('score-increased');
    }, 800);
    this.timeouts.push(timeout);
  };

  getStreamerProfileImage = name => {
    return `https://feeds.bebo.com/image/twitch?twitch_username=${name}`;
  };

  render() {
    const { team, score } = this.props;
    return (
      <div className="tournament-widget-score">
        <div className="tournament-widget-score__team">
          <div className="tournament-widget-score__team-image-container">
            {team.map((name, i) => (
              <img
                alt=""
                key={name}
                className={`tournament-widget-score__team-member--avatar avatar-${team.length}`}
                src={this.getStreamerProfileImage(name)}
              />
            ))}
          </div>
          <div className="tournament-widget-score__team-name-container">
            {team.map((name, i) => [
              <span
                key={name}
                className="tournament-widget-score__team-member--name"
                style={{ maxWidth: `${100 / team.length}%` }}
              >
                {name}
              </span>,
              team.length - 1 > i ? ' / ' : ''
            ])}
          </div>
        </div>
        <span ref={c => (this.countEl = c)} className="tournament-widget-score__count">
          <span className="tournament-widget-score__count--value">{score}</span>
        </span>
      </div>
    );
  }
}

TournamentWidgetScore.defaultProps = {
  team: [],
  score: 0
};
