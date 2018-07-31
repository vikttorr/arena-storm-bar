import React, { Component } from 'react';

import './TournamentWidgetStorm.css';

import StormIcon from './assets/icon-storm.svg';
import WinIcon from './assets/icon-trophy.svg';

export default class TournamentStorm extends Component {
  getStreamerProfileImage = name => {
    return `https://feeds.bebo.com/image/twitch?twitch_username=${name}`;
  };

  render() {
    const { teamRank, totalTeams, teamsAlive } = this.props;
    const storm_percent = ((totalTeams - teamsAlive) / totalTeams) * 100;
    const team_percent = 100 - (100 / (totalTeams - 1)) * (teamRank - 1);

    return (
      <div className="tournament-widget-storm">
        <div className="tournament-widget-storm--storm">
          <div className="tournament-widget-storm--storm--icon">
            <img src={StormIcon} alt="storm" />
          </div>
          <div className="tournament-widget-storm--storm--bar-container">
            <div className="tournament-widget-storm--storm--bar">
              <div
                className="tournament-widget-storm--storm--bar--electricity"
                style={{ maxWidth: `${storm_percent}%` }}
              />
              <div
                className="tournament-widget-storm--storm--bar--inner"
                style={{ width: `${storm_percent}%` }}
              >
                <div className="tournament-widget-storm--storm--bar--end-bar" />
              </div>
              <div
                className="tournament-widget-storm--storm--team"
                style={{ left: `${team_percent}%` }}
              >
                <div className="tournament-widget-storm--storm--team--rank">
                  <span>{teamRank}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="tournament-widget-storm--storm--icon">
            <img src={WinIcon} alt="winner" />
          </div>
        </div>
      </div>
    );
  }
}
