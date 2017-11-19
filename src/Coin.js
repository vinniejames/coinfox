import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Coin extends Component {
  render() {
    const home = this.props.blockstack ? '/blockstack' : '/';
    const coin = this.props.match.params["0"];
    const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
    const coinInfo = coinz && coin ? coinz[coin] : false;

    const marketData = this.props.marketData ? this.props.marketData : false;
    const price = marketData[coin] && marketData[coin].ticker
      ? marketData[coin].ticker.price
      : false;

    return (
      <div>
        <p><Link to={home}>X</Link></p>
        <h1>COIN: {coin}</h1>
        <p>Price: {price}</p>
        <p>Holding: {coinInfo && coinInfo.hodl}</p>
        <p>Avg CB: {coinInfo && coinInfo.cost_basis}</p>
      </div>
    );
  }
}

export default Coin;