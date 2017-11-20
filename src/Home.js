import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import TotalPortfolio from './TotalPortfolio';
import CoinList from './CoinList';

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
              exchangeRate={this.props.exchangeRate}
              marketData={this.props.marketData}
              coinz={this.props.coinz}
              key={"TotalPortfolio"}/>
          </div>
          <CoinList
            exchangeRate={this.props.exchangeRate}
            marketData={this.props.marketData}
            coinz={this.props.coinz}
            key={"CoinList"}/>
        </div>
      );
    } else {
      return (
        [<Link className="menu" key='Menu' to='/menu'>
          <i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
        </Link>,
        <p key="Welcome">maybe add some coins</p>]
      )
    }
  }
}

export default Home;