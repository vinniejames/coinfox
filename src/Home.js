import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import TotalPortfolio from './TotalPortfolio';
import CoinList from './CoinList';
import CurrencyPref from './CurrencyPref';
import AddCoin from './AddCoin';

import {
  isUserSignedIn,
} from 'blockstack';

class Home extends Component {
  render() {
    const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
    if (coinz) {
      return (
        <div className="Home">
          <div className="header">
            <Link className="menu" key='Menu' to='/menu'>
              <i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
            </Link>
            <TotalPortfolio
              currency={this.props.currency}
              exchangeRate={this.props.exchangeRate}
              marketData={this.props.marketData}
              coinz={this.props.coinz}
              key={"TotalPortfolio"}/>
          </div>
          <CoinList
            currency={this.props.currency}
            exchangeRate={this.props.exchangeRate}
            marketData={this.props.marketData}
            coinz={this.props.coinz}
            key={"CoinList"}/>
        </div>
      );
    } else if (!isUserSignedIn()) {
      // NEW User Welcome screen
      return (
        <div className="Home">
          <div className="header">
            <Link className="menu" key='Menu' to='/menu'>
              <i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
            </Link>
            <h1 className="center">Welcome to Coinfox</h1>
            <p className="center">Your secure, personal blockchain portfolio manager</p>
          </div>
          <div className="addFirstCoin">
            <CurrencyPref
              supportedCurrencies={this.props.supportedCurrencies}
              saveNewPref={this.props.saveNewPref}
              currency={this.props.currency} />
            <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>
          </div>

        </div>
      );
    } else {
      return null // @TODO add loading screen
    }
  }
}

export default Home;