import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class CoinList extends Component {
  render() {
    const coinz = this.props.coinz ? this.props.coinz : false;
    const marketData = this.props.marketData ? this.props.marketData : false;
    return (
      <div className="CoinList">
        {coinz && marketData && Object.keys(coinz).map((coin, i) => {
          const coinPrice = (this.props.marketData[coin] && this.props.marketData[coin].ticker && this.props.marketData[coin].ticker.price) || 0;
          const price = this.props.marketData[coin] && this.props.marketData[coin].ticker
            // adjusted for exchange rate
            ? coinPrice * this.props.exchangeRate
            : false;

          return (
            <Link className="coinLink" key={i} to={"/coin/" + coin}>
              <div className="listCoin">
                <span className="left">
                  {coin.toUpperCase()}<br/>
                  <span className="lightGray">{coinz[coin].hodl} Coins</span>
                </span>
                <span className="middle">
                  <i className="lightGray fa fa-lg fa-info-circle" aria-hidden="true"></i>
                </span>
                <span className="right green">
                  ${price * coinz[coin].hodl}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    );
  }
}


export default CoinList;