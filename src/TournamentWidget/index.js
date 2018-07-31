import React, { PureComponent } from 'react';

import { Spring, Transition, animated, config } from 'react-spring';
import { Easing } from 'react-spring/dist/addons';
import tinycolor from 'tinycolor2';

import './TournamentWidget.css';

import TournamentWidgetStats from './TournamentWidgetStats';
import TournamentWidgetScore from './TournamentWidgetScore';
import TournamentWidgetPromo from './TournamentWidgetPromo';

import TournamentWidgetStorm from './TournamentStorm';

//import FortniteRift from './FortniteRift';

const WIDGET_STYLES = {
  stats: {
    opacity: 1,
    width: '540px',
    background: `rgba(255,255,255,1)`
  },
  promo: {
    opacity: 1,
    width: '530px',
    background: `rgba(255,255,255,1)`
  },

  storm: {
    opacity: 1,
    width: '490px',
    background: `rgba(255,255,255,1)`
  },
  small: {
    opacity: 1,
    width: '300px',
    background: `rgba(255,255,255,1)`
  },
  score: {
    opacity: 1,
    width: '430px',
    background: `rgba(255,255,255,1)`
  },
  transition: {
    opacity: 1,
    width: '0px',
    background: `rgba(255,255,255,1)`
  }
};

const LOGO_STYLE = {
  stats: {
    opacity: 1,
    transform: 'scale(0.9) translate3d(0px,0px,0)'
  },
  promo: {
    opacity: 0,
    transform: 'scale(0.9) translate3d(0px,0px,0)'
  },

  storm: {
    opacity: 0,
    transform: 'scale(0.9) translate3d(0px,0px,0)'
  },
  small: {
    opacity: 1,
    transform: 'scale(0.9) translate3d(0px,0px,0)'
  },
  score: {
    opacity: 1,
    transform: 'scale(0.9) translate3d(0px,0px,0)'
  },
  transition: {
    opacity: 1,
    transform: 'scale(1) translate3d(10px,0px,0)'
  }
};

const BAR_COLOR = {
  stats: '#a642ff',
  promo: '#00ce9d',
  small: '#a642ff',
  storm: '#a642ff',
  score: '#a642ff',
  transition: '#a642ff'
};

export default class TournamentWidget extends PureComponent {
  render() {
    const fromStyle = { width: '0px' };
    const {
      uiState,
      data,
      activeTournament,
      team,
      teamScore,
      teamsAlive,
      totalTeams,
      liveViewers,
      nextStormDate,
      teamLeaderBoardRank
    } = this.props;
    const state = uiState.id;
    const toStyle = WIDGET_STYLES[state];
    const barColor =
      state === 'promo' && data && data.bar_color ? data.bar_color : BAR_COLOR[state];

    const defaultStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: '0',
      top: '0',
      boxSizing: 'border-box',
      paddingLeft: '140px',
      display: 'flex',
      flexDirection: 'row',
      background: '#FFF'
    };

    const barStyle = {
      background: barColor,
      boxShadow: `0px 0px 20px 0px ${tinycolor(barColor)
        .setAlpha(0.5)
        .toRgbString()}`
    };

    const _states = [
      style => (
        <animated.div key="state_1" style={{ ...defaultStyle, ...style }}>
          <TournamentWidgetScore score={teamScore} team={team.usernames} />
        </animated.div>
      ),
      style => (
        <animated.div key="state_2" style={{ ...defaultStyle, ...style }}>
          <TournamentWidgetStats
            nextStormDate={nextStormDate}
            teamsAlive={teamsAlive}
            totalTeams={totalTeams}
            liveViewers={liveViewers}
          />
        </animated.div>
      ),
      style => (
        <animated.div key="state_3" style={{ ...defaultStyle, ...style }}>
          <TournamentWidgetPromo promo_id={uiState.promo_id} />
        </animated.div>
      ),

      style => (
        <animated.div key="state_4" style={{ ...defaultStyle, ...style }}>
          <TournamentWidgetStorm
            team={team.usernames}
            teamsAlive={teamsAlive}
            totalTeams={totalTeams}
            teamRank={teamLeaderBoardRank}
            nextStormDate={nextStormDate}
          />
        </animated.div>
      )
    ];

    return (
      <Spring config={{ duration: 400, easing: Easing.elastic }} from={fromStyle} to={toStyle}>
        {style => (
          <div className="tournament-widget" style={style}>
            <TournamentWidgetLogo state={state} image_url={activeTournament.image_url} />
            <div className="tournament-widget__bar" style={barStyle} />
            <Transition
              keys={stateToIdMap[state]}
              native
              immediate
              config={{ duration: 100, easing: Easing.ease }}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
            >
              {_states[stateToIdMap[state]]}
            </Transition>
          </div>
        )}
      </Spring>
    );
  }
}

const stateToIdMap = {
  score: 0,
  stats: 1,
  promo: 2,
  storm: 3
};

class TournamentWidgetLogo extends PureComponent {
  render() {
    const { state, image_url } = this.props;
    const assetLogo = 'https://a.imgdropt.com/image/20e6edbb-73fe-44a6-bfe3-7c8424a55b88';
    const fromStyle = {};
    const toStyle = LOGO_STYLE[state];

    return (
      <Spring config={config.default} from={fromStyle} to={toStyle}>
        {style => {
          return (
            <div style={style} className="tournament-widget-logo">
              <img alt="" className="tournament-widget-logo__img" src={image_url || assetLogo} />
            </div>
          );
        }}
      </Spring>
    );
  }
}
