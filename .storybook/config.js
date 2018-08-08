import { configure } from '@storybook/react';

import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { withBackgrounds } from '@storybook/addon-backgrounds';


function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

addDecorator(
  withBackgrounds([
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ])
);

addDecorator(withKnobs)