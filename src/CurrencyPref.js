import React, { Component } from 'react';

class CurrencyPref extends Component {
  constructor(props) {
    super(props);
    this._handleSelectChange = this._handleSelectChange.bind(this);
  }

  _supportedCurrencies () {
    return [
      ['USD', '$'],
      ['EUR', 'e'],
      ['JPY', 'j'],
      ['GBP', 'g'],
      ['CHF', 'c'],
      ['CAD', 'c'],
      ['AUD', 'a'],
      ['NZD', 'n'],
      ['ZAR', 'z'],
      ['CNY', 'c'],
    ]
  }


  _handleSelectChange(e){
    const domElement = e.target.id;
    const newPref = e.target.value;
    const currentPref = this.props.currency;

    console.log(newPref, currentPref, domElement);
    this.props.saveNewPref(newPref);
  }

  render() {
    const selectCurrency = this._supportedCurrencies().map((cur) => {
      return <option key={cur[0]} value={cur[0].toUpperCase()}>{cur[0].toUpperCase()} {cur[1]}</option>
    });
    const symbol = "$"//this._supportedCurrencies()[this.props.currency][1];
    return (
      <div>
      <label htmlFor="currency">{symbol || "USD"}</label>
        <select id="currency" onChange={this._handleSelectChange} value={this.props.currency} name="select">
          {selectCurrency}
        </select>
      </div>
    );
  }
}

export default CurrencyPref;