import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import TotalPortfolio from './TotalPortfolio';
import CoinList from './CoinList';

class Home extends Component {
  render() {
    const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
    if (coinz) {
      return (
        [<Link key='Menu' to='/menu'>MENU</Link>,
          <TotalPortfolio marketData={this.props.marketData} coinz={this.props.coinz} key={"TotalPortfolio"}/>,
          <CoinList marketData={this.props.marketData} coinz={this.props.coinz} key={"CoinList"}/>
        ]
      );
    } else {
      return <p>maybe add some coins</p>
    }
  }
}

export default Home;