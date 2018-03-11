import React, { Component } from 'react';
import {$currencySymbol} from '../Utils/Helpers';
import {translationStrings} from '../Utils/i18n';
import styled from 'styled-components';
const string = translationStrings();

class CurrencyPref extends Component {

  handleSelectChange = (e) => {
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
        <h3  style={{float: "left"}}>{string.currencypref}</h3>
        <div className="selectCurrency">
        <label htmlFor="currency">{curSymbol}</label>
        <select id="currency" onChange={this.handleSelectChange} value={this.props.currency} name="select">
          {selectCurrency}
        </select>
        </div>
      </div>
    );
  }
}

export default CurrencyPref;
