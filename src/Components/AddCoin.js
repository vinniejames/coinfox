import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {translationStrings} from '../Utils/i18n';
import fetch from "fetch-retry";
import styled from 'styled-components';
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

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
const TickerSelector = styled(VirtualizedSelect)`
  color: black;
  text-align: left;
  & .Select-control {
    border-radius: 0px;
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
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #aaa;
    opacity: 1; /* Firefox */
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
    -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
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
      selected_ticker: "",
      avg_cost_basis: "",
      hodl: "",
      supported: []
    }
  }
  addCoin = (e) => {
    e.preventDefault();
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
      ticker: "",
      avg_cost_basis: "",
      hodl: ""
    })
  }

  onChange = (item, e) => {
    var text = e.target.value;
    this.setState({[item]: text});
  }

  componentWillMount () {
    // TODO fetch currencies from CoinGecko
    // fetch('https://www.cryptonator.com/api/currencies')
    //   .then(function(res) {
    //     if (!res.ok) {
    //       throw Error(res.statusText);
    //     }
    //     return res;
    //   })
    //   .then((res) => res.json())
    //   .then((res)=> {
    //       // https://stackoverflow.com/a/40969739/1580610
    //       if (this.refs.addRef) {
    //         this.setState({options: res.rows});
    //       }
    //     }
    //   )
  }
  handleTickerChange = (selected_ticker) => {
    this.setState({ selected_ticker });
  }
  render() {
    
    const { selected_ticker, options } = this.state;
    const string = translationStrings(this.props.language);

    // const avgCostBasis = "Average Cost Basis ("+ $currencySymbol(this.state.preferences.currency) +"/per coin)"
    const avgCostBasis = string.avgcost;
    return (
      <AddCoinWrapper ref="addRef" >
        <Title>{string.addcoin}</Title>
        <Form className="" onSubmit={this.addCoin}>

          <TickerSelector 
            name="form-select-ticker"
            placeholder={string.ticker}
            value={selected_ticker}
            labelKey="code"
            onChange={this.handleTickerChange}
            options={options}
          />
          <br/>
          <Input type="number"
            autoComplete='off' spellCheck='false' autoCorrect='off'
            onChange={(e) => this.onChange("avg_cost_basis", e)}
            value={this.state.avg_cost_basis}
            placeholder={avgCostBasis}/>
          <br/>
          <Input type="number"
            autoComplete='off' spellCheck='false' autoCorrect='off'
            onChange={(e) => this.onChange("hodl", e)}
            value={this.state.hodl}
            placeholder={string.numberheld}/>
          <br/>
          <SubmitButton type="submit">{string.go}</SubmitButton>
        </Form>
      </AddCoinWrapper>
    );
  }
}

export default AddCoin;
