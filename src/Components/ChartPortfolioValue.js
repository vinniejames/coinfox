import React, { Component } from 'react';
import Highcharts from 'highcharts'

class ChartPortfolioValue extends Component {

  componentDidMount(){
    let data = [[1515487909,200000], [1515559909,300000]];
    //localStorage.setItem("porfolio_value");

    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      "ChartPortfolioValue",
      //this.props.options
      this._chartOptions()
    );
  }

  //Destroy chart before unmount.
  componentWillUnmount () {
    this.chart && this.chart.destroy();
  }

  _chartOptions(){
    let data = [[1515487909000,200000], [1515552709000,300000]];

    return (
      {
        credits: false,
        chart: {
          height: '140px',
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
          name: 'NNname',//this.props.ticker + '/' + "$", // @TODO get correct symbol
          data: data
        }]
      }
    )
  }

  render() {
      return (
        <div id="ChartPortfolioValue"></div>
      );
    }
}

export default ChartPortfolioValue;
