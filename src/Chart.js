// https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym=BTC&limit=365&tryConversion=false&tsym=USD
import React, { Component } from 'react';
import './Chart.css';

class Chart extends Component {

  constructor () {
    super();
    this.state = {
      chart: null
    }
  }


  componentDidMount() {
    // const ticker = this.props.ticker;
    // const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker.toUpperCase() +'&limit=365&tryConversion=false&tsym=USD';
    // this._fetchChartData(endpoint);
  }

  _fetchChartData (endpoint) {
    fetch(endpoint)
      .then((res) => res.json())
      .then((res)=>{
        console.log(res);
      })
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log("Chart shouldComponentUpdate")
    if (this.props !== nextProps) {
      console.log(this.props, 'this.props')
      console.log(nextProps, 'nextProps');
      const ticker = nextProps.ticker;
      if (ticker){
        const endpoint = 'https://min-api.cryptocompare.com/data/histoday?aggregate=1&e=CCCAGG&extraParams=CryptoCompare&fsym='+ ticker.toUpperCase() +'&limit=365&tryConversion=false&tsym=USD';
        this._fetchChartData(endpoint);
      }
      return true;
    } else {
      return false;
    }
  }

  render () {
    return (
      <div>
        {this.props.ticker}
      </div>
    )
  }
}

export default Chart;
