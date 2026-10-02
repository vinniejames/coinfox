import React, { Component } from 'react';
import { translationStrings } from '../Utils/i18n';
import fetchRetry from '../Utils/fetchRetry';
import styled from 'styled-components';
import Select from 'react-select';

const Title = styled.h3`
  color: white;
`;
const AddCoinWrapper = styled.div`
  margin: 10px auto;
  padding: 10px 10px;
  max-width: 1100px;
`;
const Form = styled.form`
  margin: auto;
`;
const TickerSelector = styled(Select)`
  color: black;
  text-align: left;
  & .coinfox__control {
    border-radius: 0px;
    min-height: 36px;
  }
`;
const Input = styled.input`
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  margin: 5px 0px;
  padding: 0px 10px;
  height: 36px;
  box-sizing: border-box;
  ::placeholder {
    color: #aaa;
    opacity: 1;
  }
`;
const SubmitButton = styled.button`
  width: 100%;
  font-family: Roboto, sans-serif;
  font-weight: 100;
  background-color: rgb(33, 206, 153);
  color: white;
  border: none;
  font-size: 20px;
  line-height: 20px;
  margin: 5px 0px;
  height: 36px;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  ::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0px 0px 6px 2px #21ce99;
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  :hover::after {
    opacity: 1;
  }
`;

class AddCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_ticker: null,
      avg_cost_basis: '',
      hodl: '',
      options: [],
    };
  }

  addCoin = (e) => {
    e.preventDefault();
    if (!this.state.selected_ticker) return;
    const ticker = this.state.selected_ticker.code.toLocaleLowerCase();
    const avg_cost = Number(this.state.avg_cost_basis);
    const hodl = Number(this.state.hodl);

    const payload = {
      ticker: ticker,
      avg_cost: avg_cost,
      hodl: hodl,
    };

    this.props.addCoinz(payload);
    this.setState({
      selected_ticker: null,
      avg_cost_basis: '',
      hodl: '',
    });
  };

  onChange = (item, e) => {
    this.setState({ [item]: e.target.value });
  };

  componentDidMount() {
    this._mounted = true;
    fetchRetry('https://api.coingecko.com/api/v3/coins/list')
      .then((res) => res.json())
      .then((coins) => {
        if (this._mounted) {
          this.setState({
            options: coins.map((c) => ({
              code: c.symbol,
              name: c.name,
              label: `${c.symbol.toUpperCase()} — ${c.name}`,
              value: c.symbol,
              statuses: ['primary'],
            })),
          });
        }
      })
      .catch((e) => console.log(e));
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleTickerChange = (selected_ticker) => {
    this.setState({ selected_ticker });
  };

  render() {
    const { selected_ticker, options } = this.state;
    const string = translationStrings(this.props.language);
    const avgCostBasis = string.avgcost;

    return (
      <AddCoinWrapper>
        <Title>{string.addcoin}</Title>
        <Form onSubmit={this.addCoin}>
          <TickerSelector
            classNamePrefix="coinfox"
            name="form-select-ticker"
            placeholder={string.ticker}
            value={selected_ticker}
            onChange={this.handleTickerChange}
            options={options}
            getOptionLabel={(o) => o.label || o.code}
            getOptionValue={(o) => o.code}
            isClearable
          />
          <br />
          <Input
            type="number"
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            onChange={(e) => this.onChange('avg_cost_basis', e)}
            value={this.state.avg_cost_basis}
            placeholder={avgCostBasis}
          />
          <br />
          <Input
            type="number"
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            onChange={(e) => this.onChange('hodl', e)}
            value={this.state.hodl}
            placeholder={string.numberheld}
          />
          <br />
          <SubmitButton type="submit">{string.go}</SubmitButton>
        </Form>
      </AddCoinWrapper>
    );
  }
}

export default AddCoin;
