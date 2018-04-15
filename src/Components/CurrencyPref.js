import React, { Component } from 'react';
import {$currencySymbol} from '../Utils/Helpers';
import {translationStrings} from '../Utils/i18n';
import styled from 'styled-components';

const PrefWrapper = styled.div`
  display: flex;
  margin: 10px auto;
  padding: 0px 10px;
  max-width: 1100px;
`;
const Title = styled.h3`
color: white;
`;

const Selector = styled.div`
  display: flex;
  margin: auto 0px;
  margin-left: auto;
`;

class CurrencyPref extends Component {

  handleSelectChange = (e) => {
    const domElement = e.target.id;
    const newCurrencyPref = e.target.value;
    const currentCurrencyPref = this.props.currency;

    this.props.saveNewPref("currency", newCurrencyPref);
  }

  render() {
    const curSymbol = $currencySymbol(this.props.currency);
    const selectCurrency = this.props.supportedCurrencies.map((cur) => {
      return <option key={cur[0]} value={cur[0].toUpperCase()}>{cur[0].toUpperCase()} {cur[1]}</option>
    });
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <Title>{string.currencypref}</Title>
        <Selector>
          <select id="currency" onChange={this.handleSelectChange} value={this.props.currency} name="select">
            {selectCurrency}
          </select>
        </Selector>
      </PrefWrapper>
    );
  }
}

export default CurrencyPref;
