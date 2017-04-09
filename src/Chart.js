import React, { Component } from 'react';
import './Chart.css';

class Chart extends Component {

  constructor () {
    super();
    this.state = {
      ticker: null,
      chart: {
        Response: "no",
        Data: []
      }
    }
  }

  _fetchChartData (ticker, currency) {
    const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker.toUpperCase() +'&limit=365&tryConversion=false&tsym=' + currency.toUpperCase();
console.log(endpoint);
    fetch(endpoint)
      .then((res) => res.json())
      .then((res)=>{
        const nextState = {
          ticker: ticker,
          chart: res
        }
        this.setState(nextState);
      })
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.ticker !== this.state.ticker) {
      if (nextProps.ticker){
        this._fetchChartData(nextProps.ticker, this.props.currency_pref);
      }
    }
  }

  render () {
    console.log(this.state, 'rendering state');
    return (
      <div>
        {this.props.ticker} {this.state.chart.Response}
      </div>
    )
  }
}

export default Chart;
