import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {translationStrings} from './i18n';
import fetch from "fetch-retry";
import styled from 'styled-components';
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

const string = translationStrings();

function getOptions(input) {
  return fetch(`https://www.cryptonator.com/api/currencies`)
    .then((response) => {
      return response.json();
    }).then((json) => {
      console.log(json)
      return { options: json.rows };
    });
}
const Title = styled.h3`
  color: white;
`;
const AddCoinWrapper = styled.div`
  margin: 10px auto;
  max-width: 1100px;
`;
const Form = styled.form`
  margin: auto;
`;
const TickerSelector = styled(VirtualizedSelect)`

`;
const Input = styled.input`
  width: 100%;
`;
class AddCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      selectedTicker: null,
      avg_cost_basis: "",
      hodl: "",
      supported: []
    }
  }
  addCoin = (e) => {
    e.preventDefault();
    const ticker = this.state.ticker.toLocaleLowerCase();
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

    fetch('https://www.cryptonator.com/api/currencies')
      .then(function(res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res)=> {
          // https://stackoverflow.com/a/40969739/1580610
          if (this.refs.addRef) {
            this.setState({supported: res.rows});
          }
        }
      )
  }
  handleTickerChange = (selectedTicker) => {
    this.setState({ selectedTicker });
    console.log(`Selected: ${selectedTicker.name}`);
  }
  render() {
    
    const { selectedTicker } = this.state;

    // const avgCostBasis = "Average Cost Basis ("+ $currencySymbol(this.state.preferences.currency) +"/per coin)"
    const avgCostBasis = string.avgcost;
    return (
      <AddCoinWrapper ref="addRef" >
        <Title>{string.addcoin}</Title>
        <Form className="" onSubmit={this._addCoin}>

          <Link className="supportedcoins" key='supportedcoins' to={'/supportedcoins'}>
            {string.supportedcoins}
          </Link>

          <TickerSelector 
            async
            name="form-select-ticker"
            placeholder={string.ticker}
            value={selectedTicker}
            labelKey="name"
            onChange={this.handleTickerChange}
            loadOptions={getOptions}
          />
          <br/>
          <Input type="text"
                 autoComplete='off' spellCheck='false' autoCorrect='off'
                 onChange={(e) => this.onChange("avg_cost_basis", e)}
                 value={this.state.avg_cost_basis}
                 placeholder={avgCostBasis}/>
          <br/>
          <Input type="text"
                 autoComplete='off' spellCheck='false' autoCorrect='off'
                 onChange={(e) => this.onChange("hodl", e)}
                 value={this.state.hodl}
                 placeholder={string.numberheld}/>
          <br/>
          <Input className="btn" type="submit" value={string.go}/>
        </Form>
      </AddCoinWrapper>
    );
  }
}

export default AddCoin;
