import React, { Component } from 'react';
import {$currencySymbol} from './Helpers';

class CurrencyPref extends Component {
  constructor(props) {
    super(props);
    this._handleSelectChange = this._handleSelectChange.bind(this);
  }


  _handleSelectChange(e){
    const domElement = e.target.id;
    const newPref = e.target.value;
    const currentPref = this.props.currency;

    console.log(newPref, currentPref, domElement);
    this.props.saveNewPref(newPref);
  }

  render() {
    const curSymbol = $currencySymbol(this.props.currency);
    const selectCurrency = this.props.supportedCurrencies.map((cur) => {
      return <option key={cur[0]} value={cur[0].toUpperCase()}>{cur[0].toUpperCase()} {cur[1]}</option>
    });
    return (
      <div className={"addFirstCoin"}>
        <h3>Currency preference</h3>
        <label htmlFor="currency">{curSymbol}</label>
        <select id="currency" onChange={this._handleSelectChange} value={this.props.currency} name="select">
          {selectCurrency}
        </select>
      </div>
    );
  }
}

export default CurrencyPref;