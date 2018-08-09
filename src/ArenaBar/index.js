import React, { Component } from 'react';
import CountDown from 'react-countdown-now';

import './ArenaBar.css';

import ArenaBarLogo from './ArenaBarLogo';
import ArenaBarMessage from './ArenaBarMessage';
import ArenaBarTeam from './ArenaBarTeam';
import ArenaBarStats from './ArenaBarStats';
import ArenaBarStorm from './ArenaBarStorm';
// import ArenaBarBackground from './ArenaBarBackground';

export default class ArenaBar extends Component {
  getStreamerProfileImage = name => {
    return `https://feeds.bebo.com/image/twitch?twitch_username=${name}`;
  };

  render() {
    const {
      team,
      activeTournament,
      uiState,
      totalTeams,
      teamsInStorm,
      teamsEliminated,
      nextStormDate,
      liveViewers
    } = this.props;

    const avatarImages = team.img_url
      ? [...team.img_url]
      : team.usernames.map(username => this.getStreamerProfileImage(username));

    return (
      <div className="arena-bar-container">
        <div className="arena-bar">
          <ArenaBarLogo image={activeTournament.image_url} />
          <ArenaBarTeam
            score={team.score}
            rank={team.rank}
            name={team.name}
            usernames={team.usernames}
            avatars={avatarImages}
          />
          <CountDown
            restartOnDateChangeAfterComplete
            date={nextStormDate}
            renderer={({ minutes, seconds, completed }) => {
             const stats = [];
             if(nextStormDate !== 'ended'){
               stats.push({label: 'Next Storm', value: completed? 'Now' : `${minutes}:${seconds}`});
             }
             stats.push({ label: 'Live Viewers', value: liveViewers })
              return <ArenaBarStats stats={stats} />;
            }}
          />

          <ArenaBarMessage state={team.state} visible={team.state !== 'alive'} />
        </div>
        <ArenaBarStorm
          large={uiState === 'storm'}
          totalTeams={totalTeams}
          teamsInStorm={teamsInStorm}
          teamsEliminated={teamsEliminated}
          teamRank={team.rank}
        />
        {/* <ArenaBarBackground state={team.state} /> */}
      </div>
    );
  }
}
