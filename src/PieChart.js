import React, { Component } from 'react';
import Highcharts from 'highcharts'
import './PieChart.css';
class PieChart extends Component {

  _chartOptions(data){

    return (
      {
        chart: {
          renderTo: this.props.container,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: {
          text: data[0].name
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'white'
              }
            }
          }
        },
        series: data
      }

    )
  }

  // When the PROPS change, create the chart.
  componentWillReceiveProps (nextProps) {
    if (nextProps.isVisible === "visible" || this.props.isVisible === "visible") {
      // Extend Highcharts with modules
      if (this.props.modules) {
        this.props.modules.forEach(function (module) {
          module(Highcharts);
        });
      }

      // Set container which the chart should render to.
      this.chart = new Highcharts[this.props.type || "Chart"](
        this.props.container,
        //this.props.options
        this._chartOptions(this.props.chart_data)
      );
    }
  }

  //Destroy chart before unmount.
  componentWillUnmount () {
    this.chart.destroy();
  }

  render () {
    if (this.props.isVisible === "hidden") {return <div className={"PieChart gray-card"}><div id={this.props.container}></div></div>}
    return (
      <div className={"PieChart gray-card"}>
        <div id={this.props.container}></div>
      </div>
  )
  }
}

export default PieChart;
