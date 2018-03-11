import React, { Component } from 'react';
import Highcharts from 'highcharts'
// import './Chart.css';

class Chart extends Component {

  constructor (props) {
    super(props);
    this.state = {
      ticker: null,
      chart: {
        Response: "no",
        Data: []
      },
      time_series: []
    }
  }

  _chartOptions(data){

    const chartColor = this.props.chartColor;

    return (
      {
        credits: false,
        chart: {
          height: '200px',
          zoomType: 'x',
          backgroundColor: '#303032'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ""
        },
        xAxis: {
          lineColor: "#777",
          tickColor: '#777',
          gridLineColor: '#777',
          type: 'datetime',
          labels:{
            style: {
              color: '#777'
            }
          }
        },
        yAxis: {
          min: 0,
          gridLineColor: '#777',
          title: {
            text: ''
          },
          labels:{
            style: {
              color: '#777'
            }
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            color: chartColor,
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, chartColor],
                [1, Highcharts.Color(chartColor).setOpacity(0).get('rgba')]
              ]
            },
            marker: {
              radius: 2
            },
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 3
              }
            },
            threshold: null
          }
        },
        series: [{
          type: 'area',
          name: this.props.ticker + '/' + "$", // @TODO get correct symbol
          data: data
        }]
      }
    )
  }

  //Destroy chart before unmount.
  componentWillUnmount () {
    this.chart && this.chart.destroy();
  }

  _fetchChartData (coin, exchangeRate) {
    const ticker = coin.toUpperCase();
    // all incoming data set to USD
    const currency = "USD"; //currency.toUpperCase();
    const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker +'&limit=365&tryConversion=false&tsym=' + currency;

    fetch(endpoint)
      .then((res) => res.json())
      .then((res)=>{

        if (res.Response === "Success") {
          const highcharts_data = res.Data.map(function (day) {
            // highcharts wants timestamp in miliseconds
            // https://jsfiddle.net/zyqav14L/
            var fixDate = day.time * 1000;
            // adjust closing price with exchange rate
            var closingPrice = day.close * exchangeRate;
            return [fixDate, closingPrice];
          })
          const nextState = {
            ticker: ticker,
            chart: res,
            time_series: highcharts_data
          }
          // set chart options to render
          this.chart = new Highcharts["Chart"](
            "chart_container",
            this._chartOptions(highcharts_data)
          );
          this.setState(nextState);
        } else {
          // chart failed to load
          // set array empty then chart.destroy()
          this.setState({time_series: []});
          this.chart && this.chart.destroy();
        }
      })
  }

  componentDidMount() {
    this._fetchChartData(this.props.ticker, this.props.exchangeRate);
  }

  render () {
    return (
      <div>
        <div id="chart_container"></div>
      </div>
    )
  }
}

export default Chart;
