import React, { Component } from 'react';
import './Coin.css';
import { $cashRoi, $percentRoi, $currencySymbol, $numberWithCommas } from './Helpers';
class Coin extends Component {

  constructor() {
    super();
    this._deleteCoin = this._deleteCoin.bind(this);
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

  // could not read.property[of]undefined
  // https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors
  _getSafe(fn) {
    try {
        if (fn() !== undefined) {
          return fn();
        } else {
          return 0;
        }
    } catch (e) {
        return 0;
    }
  }

  render () {
    const ticker = this.props.coin;
    let curr_price = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].curr_price)
    let volume24hr = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].volume24hr * curr_price);

    const visibility = "coinInfo " + this.props.visible;
    const cost_basis = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].cost_basis);
    const hodl = this._getSafe(() => this.props.parentState.coinz[ticker.toLowerCase()].hodl);
    const gainz = $cashRoi(curr_price, cost_basis, hodl);
    const color = gainz >= 0 ? "green" : "red";

    const holding_value = hodl * curr_price;
    const total_cost_basis = hodl * cost_basis;
    const percentReturn = $percentRoi(holding_value, total_cost_basis);

    return (
      <div className={visibility}>
        <h2>
          {ticker}
        </h2>
        <h1>
          {$currencySymbol(this.props.parentState.preferences.currency)}{$numberWithCommas(curr_price.toFixed(2))}
        </h1>
        <h2>
          <span className={color}>{$currencySymbol(this.props.parentState.preferences.currency)}{$numberWithCommas(gainz.toFixed(2))}</span>
           <span>&nbsp; ({$numberWithCommas(percentReturn.toFixed(2))}%) ROI</span>
        </h2>

        <div className="coin">
          <p className="text-left float-left">
            {hodl}<br/>
            <span>{ticker} Holding</span>
          </p>
          <p className="text-right float-right">
            {$currencySymbol(this.props.parentState.preferences.currency)}{$numberWithCommas( (this._totalCostBasis()).toFixed(2) )}<br/>
            <span>Total {$currencySymbol(this.props.parentState.preferences.currency)} Holding</span>
          </p>
        </div>

        <div className="coin">
          <p className="text-left float-left">
            {this._percentOfPortfolio().toFixed(2)}%<br/>
            <span>of Portfolio</span>
          </p>
          <p className="text-right float-right">
            {$currencySymbol(this.props.parentState.preferences.currency)}{$numberWithCommas(cost_basis.toFixed(2))}<br/>
            <span>Cost Basis {$currencySymbol(this.props.parentState.preferences.currency)}/{ticker}</span>
          </p>
        </div>

        {/*<div className="coin">
          <p className="text-left float-left">
            {$currencySymbol(this.props.parentState.preferences.currency)}{volume24hr.toFixed(2)}<br/>
            <span>24hr Volume</span>
          </p>
          <p className="text-right float-right">
            {$currencySymbol(this.props.parentState.preferences.currency)}{$numberWithCommas(cost_basis.toFixed(2))}<br/>
            <span>Cost Basis {$currencySymbol(this.props.parentState.preferences.currency)}/{ticker}</span>
          </p>
        </div>*/}

        <i onClick={this._deleteCoin} className="fa fa-lg fa-trash-o" aria-hidden="true"></i>

      </div>
  )
  }
}

export default Coin;
