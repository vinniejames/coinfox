import React, { Component } from 'react';

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
    const selectCurrency = this.props.supportedCurrencies.map((cur) => {
      return <option key={cur[0]} value={cur[0].toUpperCase()}>{cur[0].toUpperCase()} {cur[1]}</option>
    });
    const symbol = "$"//this._supportedCurrencies()[this.props.currency][1];
    return (
      <div className={"addFirstCoin"}>
        <h3>Select your currency preference</h3>
        <label htmlFor="currency">{symbol || "USD"}</label>
        <select id="currency" onChange={this._handleSelectChange} value={this.props.currency} name="select">
          {selectCurrency}
        </select>
      </div>
    );
  }
}

export default CurrencyPref;