import React, { Component } from 'react';
import { translationStrings } from '../Utils/i18n';
import { PrefWrapper, PrefTitle, PrefSelector } from './shared/PrefStyles';

class CurrencyPref extends Component {
  handleSelectChange = (e) => {
    const newCurrencyPref = e.target.value;
    this.props.saveNewPref('currency', newCurrencyPref);
  };

  render() {
    const selectCurrency = this.props.supportedCurrencies.map((cur) => (
      <option key={cur[0]} value={cur[0].toUpperCase()}>
        {cur[0].toUpperCase()} {cur[1]}
      </option>
    ));
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <PrefTitle>{string.currencypref}</PrefTitle>
        <PrefSelector>
          <select
            id="currency"
            onChange={this.handleSelectChange}
            value={this.props.currency}
            name="select"
          >
            {selectCurrency}
          </select>
        </PrefSelector>
      </PrefWrapper>
    );
  }
}

export default CurrencyPref;
