import React, {PureComponent} from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import backgrounds from "@storybook/addon-backgrounds";
import { withKnobs, array, color, boolean, number, select } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';

import ArenaBar from '../ArenaBar';
import ArenaBarTeam from '../ArenaBar/ArenaBarTeam';

const storyBackgrounds = [
  { name: 'grey',value: 'grey', default:true},
  { name: 'black',value: 'black'},
] 

const TEST_TEAM = {
  id: 'test_1',
  stream_id: 'e3db336d10214657bab8983155715199',
  tournament_id: '7738854e-c008-4156-a461-6f8a04f140a3',
  usernames: ['professorbroman', 'drdisrespectlive'],
  player_stream_ids: ['e3db336d10214657bab8983155715199'],
  name: '',
  code: '416874',
  created_dttm: '2018-07-28T09:34:21.070Z',
  updated_dttm: '2018-07-28T09:34:21.070Z',
  rank:4,
  deleted_dttm: null,
  state: 'eliminated',
  score: 0
};

const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const stats = [
  { label: 'Live Viewers', value: numberWithCommas(1000000) },
  { label: 'Next storm', value: `01:20:30` }
];

const activeTournament = {
  image_url: ''
}



storiesOf('ArenaBar', module)
  .addDecorator(centered)
  .addDecorator(backgrounds(storyBackgrounds))
  .addDecorator(withKnobs)
  .add('Default', () => {
    const options = {
      alive: 'alive',
      storm: 'storm',
      eliminated: 'eliminated',
      winner: 'winner'
    };

    const uiState = select('uiState', { none: 'none', storm: 'storm' }, 'none');
    const teamState = select('teamState', options, 'alive');
    const usernames = array('usernames', [...TEST_TEAM.usernames]);
    const primaryColor = color('primaryColor', '#9DCF12')
    const backgroundColor = select('backgroundColor', { '#FFF': '#FFF', '#000': '#000' }, '#FFF');
    const rank = number('rank', 5);

    return <StoryElement width={1186}>
    <ArenaBar 
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      activeTournament={activeTournament}
      stats={stats}
      team={{ ...TEST_TEAM, state: teamState, usernames, rank }}
    />;
    </StoryElement>
  })
  .add('Alive', () => <ArenaBar  activeTournament={activeTournament} stats={stats} team={{ ...TEST_TEAM, state: 'alive' }} />)
  .add('Eliminated', () => <ArenaBar  activeTournament={activeTournament} stats={stats} team={{ ...TEST_TEAM, state: 'eliminated' }} />)
  .add('Storm', () => <ArenaBar  activeTournament={activeTournament} stats={stats} team={{ ...TEST_TEAM, state: 'storm' }} />)
  .add('Winner', () => <ArenaBar  activeTournament={activeTournament} stats={stats} team={{ ...TEST_TEAM, state: 'winner' }} />);

storiesOf('ArenaBarTeam', module).add('team', () => (
  <div style={{ width: 400, height: 80 }}>
    <ArenaBarTeam {...TEST_TEAM} />
  </div>
));

class StoryElement extends PureComponent {
  render(){
    return <div style={{height:this.props.height, width:this.props.width}}>{this.props.children}</div>
  }
}