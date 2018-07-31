import React, { Component } from 'react';

import './TournamentWidgetPromo.css';

//import FortniteRift from './FortniteRift';

const POSTMATES_LOGO = 'http://therewardboss.com/wp-content/uploads/2018/01/postmates-logo.png';
const META_THREADS_LOGO =
  'http://cdn.shopify.com/s/files/1/1732/8005/collections/Meta_Threads_Logo_1200x1200.png?v=1488011199';

export default class TournamentWidgetPromo extends Component {
  render() {
    const { promo_id } = this.props;
    switch (promo_id) {
      case 'postmates':
        return (
          <div className="tournament-widget-promo postmates">
            <div className="tournament-widget-promo__badge">
              Special Delivery <div className="tournament-widget-promo__badge-glow" />
            </div>

            <div className="tournament-widget-promo__logo">
              <img alt="" className="tournament-widget-promo__logo--img" src={POSTMATES_LOGO} />
            </div>
            <div className="tournament-widget-promo__cta">
              <span className="tournament-widget-promo__cta--header">Free Delivery Unlocked!</span>
              <span className="tournament-widget-promo__cta--text" style={{ marginTop: 10 }}>
                <span style={{ color: '#727272' }}>Use Promo Code:</span>{' '}
                <span style={{ color: '#00ce9d', fontSize: 25 }}>SUNDAYSTORM</span>
              </span>
            </div>
          </div>
        );

      case 'meta-threads':
        return (
          <div className="tournament-widget-promo meta-threads">
            <div className="tournament-widget-promo__logo">
              <img alt="" className="tournament-widget-promo__logo--img" src={META_THREADS_LOGO} />
            </div>
            <div className="tournament-widget-promo__cta">
              <span className="tournament-widget-promo__cta--header">
                Tournament Merch Giveaway
              </span>
              <span className="tournament-widget-promo__cta--text">
                Enter here: <b>www.bebo.com/nerdout</b>
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}
