import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Highcharts from 'highcharts'


class Pie extends Component {
  _chartOptions(){
    let data = []
    for (const coin in this.props.coinz) {
      const holding = this.props.coinz[coin].hodl;
      const price = Number(this.props.marketData[coin].ticker.price) * this.props.exchangeRate;
      data.push({
        name: coin.toUpperCase(),
        y: (holding * price) / this.props.totalPortfolio.totalValue
      })
    }

    return (
      {
        credits: false,
        chart: {
          renderTo: "piechart",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: {
          text: ""
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br/>{point.percentage:.1f} %',
              style: {
                color: 'white'
              }
            }
          }
        },
        series: [{
            colorByPoint: true,
            data: data
        }]
      }

    )
  }

  componentDidMount () {
      // Set container which the chart should render to.
      this.chart = new Highcharts[this.props.type || "Chart"](
        "piechart",
        //this.props.options
        this._chartOptions()
      );
  }

  //Destroy chart before unmount.
  componentWillUnmount () {
    this.chart && this.chart.destroy();
  }

  render() {
    const home = this.props.blockstack ? '/blockstack' : '/';

    return (
      <div className="Pie">
        <div id="piechart"></div>
      </div>
    );
  }
}

export default Pie;
