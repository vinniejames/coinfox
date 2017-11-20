import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class CoinList extends Component {
  render() {
    const coinz = this.props.coinz ? this.props.coinz : false;
    const marketData = this.props.marketData ? this.props.marketData : false;
    return (
      <div className="">
        COINLIST
        {coinz && marketData && Object.keys(coinz).map((coin, i) => {
          const coinPrice = (this.props.marketData[coin] && this.props.marketData[coin].ticker && this.props.marketData[coin].ticker.price) || 0;
          const price = this.props.marketData[coin] && this.props.marketData[coin].ticker
            // adjusted for exchange rate
            ? coinPrice * this.props.exchangeRate
            : false;
          return <p key={i}><Link to={"/coin/" + coin}>{coin}: {coinz[coin].hodl}</Link> ${price}</p>
        })}
      </div>
    );
  }
}


export default CoinList;