import React, { Component } from 'react';
import Highcharts from 'highcharts'
import './Chart.css';

class Chart extends Component {

  constructor () {
    super();
    this.state = {
      ticker: null,
      chart: {
        Response: "no",
        Data: []
      },
      time_series: []
    }
  }

  _chartOptions(series){
    return (
      {
          chart: {
             zoomType: 'x'
          },
          title: {
              text: ''
          },
          subtitle: {
              text: ""
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: ''
              }
          },
          legend: {
              enabled: false
          },
          plotOptions: {
              area: {
                  fillColor: {
                      linearGradient: {
                          x1: 0,
                          y1: 0,
                          x2: 0,
                          y2: 1
                      },
                      stops: [
                          [0, Highcharts.getOptions().colors[0]],
                          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                      ]
                  },
                  marker: {
                      radius: 2
                  },
                  lineWidth: 1,
                  states: {
                      hover: {
                          lineWidth: 1
                      }
                  },
                  threshold: null
              }
          },

          series: [{
              type: 'area',
              name: this.state.ticker,
              data: series
          }]
      }
    )
  }

    //Destroy chart before unmount.
    componentWillUnmount () {
        this.chart.destroy();
    }

  _fetchChartData (ticker, currency) {
    const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker.toUpperCase() +'&limit=365&tryConversion=false&tsym=' + currency.toUpperCase();

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


componentDidUpdate(prevProps, prevState) {
  // only update chart if the data has changed
  if (prevState.time_series !== this.state.time_series) {
    console.log(this.state.time_series);
    console.log('yip');
    if(this.state.time_series.length){
      this.chart = new Highcharts["Chart"](
        this.props.chart_container,
        this._chartOptions(this.state.time_series)
      );
    }
  }
}

  render () {
    console.log(this.state, 'rendering state');

    return (
      <div>
        <div id="chart_container"></div>
      </div>
    )
  }
}

export default Chart;
