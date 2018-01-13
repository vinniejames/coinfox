import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {translationStrings} from './i18n';
import fetch from "fetch-retry";
const string = translationStrings();

class AddCoin extends Component {
  constructor(props) {
    super(props);
    this._addCoin = this._addCoin.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      ticker: "",
      avg_cost_basis: "",
      hodl: "",
      supported: []
    }
  }
  _addCoin (e) {
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

  _onChange (e) {
    var text = e.target.value;
    var item = e.target.className;
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
  render() {

    const supportedTickers = this.state.supported.map((tick)=>{
        return tick.code;
    });

    const supportedIcon = supportedTickers.includes(this.state.ticker.toUpperCase())
      ? "green fa fa-check-circle"
      : "red fa fa-question-circle";

    // const avgCostBasis = "Average Cost Basis ("+ $currencySymbol(this.state.preferences.currency) +"/per coin)"
    const avgCostBasis = string.avgcost;
    return (
      <div ref="addRef" className={"addFirstCoin"}>
        <h3>{string.addcoin}</h3>
        <Link className="supportedcoins" key='supportedcoins' to={'/supportedcoins'}>
          {string.supportedcoins}
        </Link>
        <form className="" onSubmit={this._addCoin}>
          <div className={"isSupported"}>
            {this.state.ticker && <i className={supportedIcon} aria-hidden="true"></i>}
          </div>
          <input type="text"
                 autoComplete='off' spellCheck='false' autoCorrect='off'
                 className="ticker"
                 onChange={this._onChange}
                 value={this.state.ticker}
                 placeholder={string.ticker}/>
          <br/>
          <input type="text"
                 autoComplete='off' spellCheck='false' autoCorrect='off'
                 className="avg_cost_basis"
                 onChange={this._onChange}
                 value={this.state.avg_cost_basis}
                 placeholder={avgCostBasis}/>
          <br/>
          <input type="text"
                 autoComplete='off' spellCheck='false' autoCorrect='off'
                 className="hodl"
                 onChange={this._onChange}
                 value={this.state.hodl}
                 placeholder={string.numberheld}/>
          <br/>
          <input className="btn" type="submit" value={string.go}/>
        </form>
      </div>
    );
  }
}

export default AddCoin;
