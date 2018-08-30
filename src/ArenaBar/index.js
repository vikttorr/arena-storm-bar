import React, { Component } from 'react';
import Color from 'color'; 
import CountDown from 'react-countdown-now';


import './ArenaBar.css';

import ArenaBarLogo from './ArenaBarLogo';
import ArenaBarMessage from './ArenaBarMessage';
import ArenaBarTeam from './ArenaBarTeam';
import ArenaBarStats from './ArenaBarStats';
import ArenaBarStorm from './ArenaBarStorm';
import ArenaBarBackground from './ArenaBarBackground';

const parseTime = (hours, minutes, seconds) => {
  hours = parseInt(hours, 10);
  if (hours) {
    minutes = `${hours * 60 + parseInt(minutes, 10)}`;
    minutes = minutes.length < 2 ? `0${minutes}` : minutes;
    return `${minutes}:${seconds}`
  }
}

export default class ArenaBar extends Component {
  
  getStreamerProfileImage = name => {
    return `https://feeds.bebo.com/image/twitch?twitch_username=${name}`;
  };


  renderStats = isDark => {
    const { nextStormDate, liveViewers } = this.props;
    const streamStarted = false;
    const startingTime = Date.now() + 100000
      return  <CountDown
        restartOnDateChangeAfterComplete
        date={nextStormDate}
        renderer={({ hours, minutes, seconds, completed }) => {
        const stats = [];
        if (nextStormDate !== 'ended') {
          stats.push({
            label: 'Next Storm',
            // value:`30:00`
            value: completed ? 'Now' : parseTime(hours, minutes, seconds)
          });
        }
        stats.push({ label: 'Viewers', value: liveViewers });
        return <ArenaBarStats isDark={isDark} stats={stats} />;
      }}
    />
  }

  render() {
    const {
      primaryColor = '#B636F3',
      backgroundColor = '#FFF',
      team,
      activeTournament,
      uiState,
      totalTeams,
      teamsInStorm,
      teamsEliminated, 
    } = this.props;

    const avatarImages = team.img_url
      ? [...team.img_url]
      : team.usernames.map(username => this.getStreamerProfileImage(username));

    const isDark = Color(backgroundColor).isDark()
      
    const style = {
      backgroundColor: backgroundColor,
      color: isDark ? '#FFF' : '#000'
    }

    const containerStyle = {
       color: isDark ? '#FFF' : '#000'
    }

    return (
      <div className="arena-bar-container" style={containerStyle}>
        <div className="arena-bar" style={style}>
          <ArenaBarLogo primaryColor={primaryColor} image={activeTournament.image_url} />
          <ArenaBarTeam
            primaryColor={primaryColor}
            score={team.score}
            rank={team.rank}
            name={team.name}
            usernames={team.usernames}
            avatars={avatarImages}
            state={team.state}
            isDark={isDark}
          />
          {this.renderStats(isDark)}
        </div>
          <ArenaBarMessage 
            primaryColor={primaryColor}
            isDark={isDark} 
            state={team.state} 
            visible={team.state !== 'alive'} 
          />        
        <ArenaBarStorm
          primaryColor={primaryColor}
          teamState={team.state}
          large={uiState === 'storm' && team.state === 'alive'}
          totalTeams={totalTeams}
          teamsInStorm={teamsInStorm}
          teamsEliminated={teamsEliminated}
          teamRank={team.rank}
          isDark={isDark}
        />
        <ArenaBarBackground state={team.state} />
      </div>
    );
  }
}

