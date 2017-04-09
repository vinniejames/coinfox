import React, { Component } from 'react';
import Highcharts from 'highcharts'
import './Chart.css';

class Chart extends Component {

  constructor () {
    super();
    this.state = {
      chart_container: "chart_container",
      ticker: null,
      chart: {
        Response: "no",
        Data: []
      },
      time_series: [],
      chart_options: {}
    }
  }

  componentDidMount () {
        // Set container which the chart should render to.
        console.log(this.state.chart_container, "put highchart here");
          this.chart = new Highcharts["Chart"](
            this.state.chart_container,
            this.state.chart_options
          );
    }
    //Destroy chart before unmount.
    componentWillUnmount () {
        this.chart.destroy();
    }

  _fetchChartData (ticker, currency) {
    const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker.toUpperCase() +'&limit=365&tryConversion=false&tsym=' + currency.toUpperCase();
console.log(endpoint);
    fetch(endpoint)
      .then((res) => res.json())
      .then((res)=>{
        // convert data to time series for highcharts_data
        const highcharts_data = res.Data.map(function (day) {
          // highcharts wants timestamp in miliseconds
          // https://jsfiddle.net/zyqav14L/
          var fixDate = day.time * 1000;
          return [fixDate, day.close]
        })

        const nextState = {
          ticker: ticker,
          chart: res,
          time_series: highcharts_data
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
        <h1>{this.state.time_series.length && this.state.time_series[0][0]}</h1>
        <div id="chart_container"></div>
      </div>
    )
  }
}

export default Chart;
