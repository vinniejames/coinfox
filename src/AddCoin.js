import React, { Component } from 'react';

class AddCoin extends Component {
  constructor() {
    super();
    this.addCoin = this.addCoin.bind(this);
  }
  addCoin () {
    const ticker = 'LTC'.toLocaleLowerCase();
    console.log('adding' + ticker);
    const payload = {ticker: ticker, avg_cost: 20, hodl: 10};
    this.props.addCoinz(payload);
  }
  render() {
    return (
      <div>
        <p>Add Coinz</p>
        <button onClick={this.addCoin}>Add Coin</button>
      </div>
    );
  }
}

export default AddCoin;