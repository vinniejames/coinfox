import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Chart from "./Chart";
import { $numberWithCommas, $currencySymbol } from './Helpers';

class Coin extends Component {
  render() {
    const curSymbol = $currencySymbol(this.props.currency);
    const home = this.props.blockstack ? '/blockstack' : '/';
    const coin = this.props.match.params["0"] || 'X';
    const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
    const coinInfo = coinz && coin ? coinz[coin] : false;

    const marketData = this.props.marketData ? this.props.marketData : false;
    const price = marketData[coin] && marketData[coin].ticker
      ? Number(marketData[coin].ticker.price)
      : 0; //false

    const hodl = coinInfo && Number(coinInfo.hodl);
    const cost_basis = coinInfo && Number(coinInfo.cost_basis);

    const volume24 = marketData[coin].ticker.volume * price;
    // console.log(marketData[coin].ticker.volume, 'voluem?');

    return (
      <div className="Coin">
        <Link className="menu" key='Menu' to='/menu'><i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i></Link>
        <Link className="coinClose" to={home}><i className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i></Link>

        <div className="coinCard">
          <h2>{coin.toUpperCase()}</h2>
          <h1>{curSymbol}{$numberWithCommas(price.toFixed(2))}</h1>

          <div className="theChart">
            <Chart exchangeRate={this.props.exchangeRate} ticker={coin} />
          </div>

          <div className="listCoin">
            <span className="left">
              {hodl}<br/>
              <span className="lightGray">{coin.toUpperCase() + " Holding"}</span>
            </span>
            <span className="right">
              {curSymbol}{$numberWithCommas( (hodl * price).toFixed(2) )}<br/>
              <span className="lightGray">{"Total "+curSymbol+" Holding"}</span>
            </span>
          </div>

          <div className="listCoin">
            <span className="left">
              {curSymbol}{$numberWithCommas(volume24.toFixed())}<br/>
              <span className="lightGray">24hr Volume</span>
            </span>
            <span className="right">
              {curSymbol}{(cost_basis * hodl).toFixed(2)} <span className="lightGray">({cost_basis.toFixed(2)})</span><br/>
              <span className="lightGray">Cost Basis (avg)</span>
            </span>
          </div>

          <div className="trash listCoin">
            <span className="left">
            </span>
            <span className="right">
              <span onClick={()=>this.props.deleteCoin(coin, this.props.history)} className="lightGray"><i className="fa fa-trash" aria-hidden="true"></i></span>
            </span>
          </div>


        </div>
      </div>
    );
  }
}

export default Coin;