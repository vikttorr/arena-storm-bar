import React, { Component } from 'react'

import './ArenaBar.css';

import ArenaBarLogo from './ArenaBarLogo';
import ArenaBarMessage from './ArenaBarMessage';
import ArenaBarTeam from './ArenaBarTeam';
import ArenaBarStats from './ArenaBarStats';
import ArenaBarStorm from './ArenaBarStorm';
import ArenaBarBackground from './ArenaBarBackground';

export default class ArenaBar extends Component {

  state = {
    largeStorm: false
  }


  toggleStorm = () => {
    this.setState({largeStorm:!this.state.largeStorm})
  }

  getStreamerProfileImage = name => {
    return `https://feeds.bebo.com/image/twitch?twitch_username=${name}`;
  };


  render() {
    const { team, storm, stats } = this.props; 
    const avatarImages = team.img_url ? [...team.img_url] :  team.usernames.map(username => this.getStreamerProfileImage(username))
    
  return (
    <div className='arena-bar-container' onClick={this.toggleStorm}>
      <div className='arena-bar'>
        <ArenaBarLogo
          image={'https://a.imgdropt-dev.com/image/059520ff-6e71-48a6-8ff3-47ab08225b12'}
        />          
        <ArenaBarTeam 
          score={team.score}
          rank={33}
          name={team.name}
          usernames={team.usernames}
          avatars={avatarImages}
        />
        <ArenaBarStats
          stats={stats}
        />
      <ArenaBarMessage
        state={team.state}
      />           
      </div>
      <ArenaBarStorm
        large={this.state.largeStorm}
      />
      <ArenaBarBackground
        state={team.state}
      />   
    </div>              
    )
  }
}
