import React, { Component } from 'react';
import './SupportedCoins.css';

class SupportedCoins extends Component {
  state = {
    supportedCoins: "false"
  }
  componentDidMount () {
    const endpoint = "https://www.cryptonator.com/api/currencies";
    fetch(endpoint)
      .then(function (res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then(function (res) {
        console.log(res);
      })
  }

  render() {
    return <div className="coin-list"><h1>{this.state.supportedCoins}COIN LIST</h1></div>;
  }
}

export default SupportedCoins