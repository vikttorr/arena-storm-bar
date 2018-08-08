import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';

import ArenaBar from '../ArenaBar';
import ArenaBarTeam from '../ArenaBar/ArenaBarTeam';



const TEST_TEAM = {
    id: 'test_1',
    stream_id: 'e3db336d10214657bab8983155715199',
    tournament_id: '7738854e-c008-4156-a461-6f8a04f140a3',
    usernames: ['professorbroman', 'drdisrespectlive'],
    player_stream_ids: ['e3db336d10214657bab8983155715199'],
    name: "",
    code: '416874',
    created_dttm: '2018-07-28T09:34:21.070Z',
    updated_dttm: '2018-07-28T09:34:21.070Z',
    deleted_dttm: null,
    state: 'eliminated',
    score: 0
  }

const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

    const stats = [
      { label: 'Live Viewers', value:numberWithCommas(1000000) },
      { label: 'Next storm', value: `01:20:30`}
    ]


storiesOf('ArenaBar', module)
  .addDecorator(withKnobs)
  .add('Default', () =>  {
    const options = {
      alive: 'alive',
      storm: 'storm',
      eliminated: 'eliminated',
      winner: 'winner',
      none: 'none',
    };
    const value = select('state', options, 'alive', 'GROUP-ID1');
    

    return <ArenaBar stats={stats} team={{...TEST_TEAM, state:value}}/>
  })
  .add('Alive', () =>  ( <ArenaBar stats={stats} team={{...TEST_TEAM, state:'alive'}}/>))
  .add('Eliminated', () =>  ( <ArenaBar stats={stats} team={{...TEST_TEAM, state:'eliminated'}}/> )) 
  .add('Storm', () =>  ( <ArenaBar stats={stats} team={{...TEST_TEAM, state:'storm'}}/> ))  
  .add('Winner', () =>  ( <ArenaBar stats={stats} team={{...TEST_TEAM, state:'winner'}}/> ))

storiesOf('ArenaBarTeam', module).add('team', () => <div style={{width: 400, height: 80}}>
    <ArenaBarTeam {...TEST_TEAM} /> 
  </div>
);






