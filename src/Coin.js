import React, { Component } from 'react';
import './Coin.css';

class Coin extends Component {

  constructor() {
    super();
    this._deleteCoin = this._deleteCoin.bind(this);
  }

  _currencySymbol(ticker){
    const symbol = {
      usd: "$",
      btc: "฿",
      cad: "$",
      eur: "€",
      jpy: "¥",
      cny: "¥",
      rur: "₽",
      uah: "₴"
    }
    return symbol[ticker.toLowerCase()];
  }

  _portfolioValue(){
    var value = 0;

    for (var coin in this.props.parentState.coinz) {
      const hodl = this._getSafe(() => this.props.parentState.coinz[coin].hodl);
      const curr_price = this._getSafe(() => this.props.parentState.coinz[coin].curr_price);
      if (hodl){
        value = value + (hodl * curr_price);
      }
    }
    return value;
  }

  _totalCostBasis () {
    const ticker = this.props.coin;
    const curr_price = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].curr_price);
    const hodl = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].hodl);
    return curr_price * hodl;
  }

  _percentOfPortfolio(){
    return ( this._totalCostBasis() / this._portfolioValue() ) * 100;
  }

  _deleteCoin(){
    const ticker = this.props.coin.toLowerCase()
    var strconfirm = confirm("Do you want to remove "+ ticker.toUpperCase() +" from your portfolio?");
    if (strconfirm == true) {
      const localStore = JSON.parse(localStorage.coinz);
      delete localStore[ticker];
      localStorage.setItem('coinz', JSON.stringify(localStore));
      // refresh page
      location.reload()
    }
  }

  _numberWithCommas(d) {
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // could not read.property[of]undefined
  // https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors
  _getSafe(fn) {
    try {
        return fn();
    } catch (e) {
        return 0;
    }
  }

  render () {
    const ticker = this.props.coin;
    let curr_price = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].curr_price)
    if (curr_price == undefined) {
      curr_price = 0;
    }
    const visibility = "coinInfo " + this.props.visible;
    const cost_basis = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].cost_basis);
    const hodl = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].hodl);
    //((Number(coin[1].curr_price) - Number(coin[1].cost_basis) ) * Number(coin[1].hodl) ).toFixed(2);
    const gainz = (curr_price - cost_basis) * hodl;
    const color = gainz >= 0 ? "green" : "red";
    const percent = ( (curr_price * hodl) / (cost_basis * hodl) ) *10;

    return (
      <div className={visibility}>
        <h2>
          {ticker}
        </h2>
        <h1>
          {this._currencySymbol(this.props.parentState.preferences.currency)}{this._numberWithCommas(curr_price.toFixed(2))}
        </h1>
        <h2>
          <span className={color}>{this._currencySymbol(this.props.parentState.preferences.currency)}{gainz.toFixed(2)}</span>
           <span>{/*&nbsp; ({percent}%)*/} Return</span>
        </h2>

        <div className="coin">
          <p className="text-left float-left">
            {hodl}<br/>
            <span>{ticker} Holding</span>
          </p>
          <p className="text-right float-right">
            {this._currencySymbol(this.props.parentState.preferences.currency)}{this._numberWithCommas( (this._totalCostBasis()).toFixed(2) )}<br/>
            <span>Total {this._currencySymbol(this.props.parentState.preferences.currency)} Holding</span>
          </p>
        </div>

        <div className="coin">
          <p className="text-left float-left">
            {this._percentOfPortfolio().toFixed(2)}%<br/>
            <span>of Portfolio</span>
          </p>
          <p className="text-right float-right">
            {this._currencySymbol(this.props.parentState.preferences.currency)}{this._numberWithCommas(cost_basis.toFixed(2))}<br/>
            <span>Cost Basis {this._currencySymbol(this.props.parentState.preferences.currency)}/{ticker}</span>
          </p>
        </div>
        <i onClick={this._deleteCoin} className="fa fa-lg fa-trash-o" aria-hidden="true"></i>

      </div>
  )
  }
}

export default Coin;
