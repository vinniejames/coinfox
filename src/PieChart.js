import React, { Component } from 'react';
import Highcharts from 'highcharts'
import './PieChart.css';
class PieChart extends Component {

  _chartOptions(data){
    return (
      {
        chart: {
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

  // When the DOM is ready, create the chart.
  componentDidMount () {
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(function (module) {
        module(Highcharts);
      });
    }

    console.log(this.props.chart_data, 'did mount');
    // Set container which the chart should render to.
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      //this.props.options
      this._chartOptions(this.props.chart_data)
    );
    // var height = this.chart.renderTo.clientHeight;
    // var width = this.chart.renderTo.clientWidth;
    // this.chart.setSize(width, height);
  }
  //Destroy chart before unmount.
  componentWillUnmount () {
    this.chart.destroy();
  }


  // componentWillReceiveProps() {
  //   // You don't have to do this check first, but it can help prevent an unneeded render
  //   if (this.props.isVisible === "visible") {
  //     console.log('new props');
  //     this.forceUpdate();
  //   }
  // }

  render () {
    if (this.props.isVisible === "hidden") {return  <div className="hidden" id={this.props.container}></div>}

    return (
      <div className={"PieChart gray-card"}>
        <div id={this.props.container}></div>
      </div>
  )
  }
}

export default PieChart;
