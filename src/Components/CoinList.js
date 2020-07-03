import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { $numberWithCommas, $currencySymbol } from '../Utils/Helpers';
import { translationStrings } from '../Utils/i18n';
const string = translationStrings();

class CoinList extends Component {
  render() {
    const coinz = this.props.coinz ? this.props.coinz : false;
    const marketData = this.props.marketData ? this.props.marketData : false;
    const curSymbol = $currencySymbol(this.props.currency);
    const coinzWithPrice = coinz && marketData && Object.keys(coinz).map((coin, i) => {
      const coinPrice = (this.props.marketData[coin] && this.props.marketData[coin].ticker && this.props.marketData[coin].ticker.price) || 0;
      const price = this.props.marketData[coin] && this.props.marketData[coin].ticker
        // adjusted for exchange rate
        ? Number(coinPrice * this.props.exchangeRate)
        : 0;

      const coinRound = Math.round(coinz[coin].hodl * 100) / 100;

      return {
        coin,
        price,
        coinRound,
        hodlValue: price * coinz[coin].hodl
      }

    }).sort((a, b) => b.hodlValue - a.hodlValue)

    return (
      <div className="CoinList">
        {coinzWithPrice && coinzWithPrice.map((coin, i) => {
          const textColor = !coin.coinPrice || coin.coinPrice >= coinz[coin].cost_basis
            ? 'right green'
            : 'right red';

          return (
            <Link className="coinLink" key={i} to={"/coin/" + coin.coin}>
              <div className="listCoin">
                <span className="left">
                  {coin.coin.toUpperCase()}<br />
                  <span className="lightGray">{coin.coinRound}{string.coins}</span>
                </span>
                <span className="middle">
                  <i className="lightGray fa fa-lg fa-info-circle" aria-hidden="true"></i>
                </span>
                <span className={textColor}>
                  {curSymbol}{$numberWithCommas(coin.hodlValue.toFixed(2))}<br />
                  <span className="lightGray">{curSymbol}{$numberWithCommas(coin.price.toFixed(2))}</span>
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
