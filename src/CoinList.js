import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { $numberWithCommas, $currencySymbol } from './Helpers';
import {translationStrings} from './i18n';
const string = translationStrings();

class CoinList extends Component {
  render() {
    const coinz = this.props.coinz ? this.props.coinz : false;
    const marketData = this.props.marketData ? this.props.marketData : false;
    const curSymbol = $currencySymbol(this.props.currency);
    return (
      <div className="CoinList">
        {coinz && marketData && Object.keys(coinz).map((coin, i) => {
          const coinPrice = (this.props.marketData[coin] && this.props.marketData[coin].ticker && this.props.marketData[coin].ticker.price) || 0;
          const price = this.props.marketData[coin] && this.props.marketData[coin].ticker
            // adjusted for exchange rate
            ? Number(coinPrice * this.props.exchangeRate)
            : 0;

          const coinRound = Math.round(coinz[coin].hodl*100)/100;

          console.log(coinPrice, coinz[coin].cost_basis);

          const textColor = !coinPrice || coinPrice >= coinz[coin].cost_basis
            ? 'right green'
            : 'right red';

          return (
            <Link className="coinLink" key={i} to={"/coin/" + coin}>
              <div className="listCoin">
                <span className="left">
                  {coin.toUpperCase()}<br/>
                  <span className="lightGray">{coinRound}{string.coins}</span>
                </span>
                <span className="middle">
                  <i className="lightGray fa fa-lg fa-info-circle" aria-hidden="true"></i>
                </span>
                <span className={textColor}>
                  {curSymbol}{$numberWithCommas( (price * coinz[coin].hodl).toFixed(2) )}<br/>
                  <span className="lightGray">{curSymbol}{$numberWithCommas(price.toFixed(2))}</span>
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
