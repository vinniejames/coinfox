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

  _chartOptions(data){
    return (
      {
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
                 color: 'rgb(33, 206, 153)',
                  fillColor: {
                      linearGradient: {
                          x1: 0,
                          y1: 0,
                          x2: 0,
                          y2: 1
                      },
                      stops: [
                          [0, 'rgb(33, 206, 153)'],
                          [1, Highcharts.Color('rgb(33, 206, 153)').setOpacity(0).get('rgba')]
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
              name: this.state.ticker,
              data: data
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
        // const no_chart_available = !(res.Response === "Success")
        //   ? []
        //   : false; // no chart is available
        //
        //   console.log(no_chart_available, res.Response, 'no chart available');

        console.log(res.Response);

        if (res.Response === "Success") {
          console.log('if ran')
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
        } else {
          console.log('chart failed')
          this.setState({time_series: []});
        }


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
  // if (!this.state.chart.Response === "Success") {
  //   this.chart.destroy();
  // }
  if (prevState.time_series !== this.state.time_series) {
    if(this.state.time_series.length){
      this.chart = new Highcharts["Chart"](
        this.props.chart_container,
        this._chartOptions(this.state.time_series)
      );
    } else {
      // destroys chart, but you see a flash of
      // previous chart
      // @TODO this better, so you dont see a flash
      this.chart.destroy()
    }
  }
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
