import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Chart from "./Chart";

class Coin extends Component {
  render() {
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

    return (
      <div className="Coin">
        <Link className="menu" key='Menu' to='/menu'><i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i></Link>
        <Link className="coinClose" to={home}><i className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i></Link>

        <div className="coinCard">
          <h2>{coin.toUpperCase()}</h2>
          <h1>$ {price}</h1>

          <div className="theChart">
            <Chart exchangeRate={this.props.exchangeRate} ticker={coin} />
          </div>

          <div className="listCoin">
          <span className="left">
            {hodl}<br/>
            <span className="lightGray">{coin.toUpperCase() + " Holding"}</span>
          </span>
          <span className="right">
            $ {cost_basis * hodl}<br/>
            <span className="lightGray">{"Total $ Holding"}</span>
          </span>
          </div>

        </div>
      </div>
    );
  }
}

export default Coin;