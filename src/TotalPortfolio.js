import React, { Component } from 'react';

class TotalPortfolio extends Component {

  returnPercentage (currentValue, costBasis) {
    return (currentValue - costBasis) / costBasis * 100;
  }

  render() {
    const coinz = this.props.coinz ? this.props.coinz : false;
    const marketData = this.props.marketData ? this.props.marketData : false;

    let totalValue = 0;
    let totalBasis = 0;

    for (const coin in coinz) {
      const costBasis = coinz[coin].cost_basis;
      const hodl = coinz[coin].hodl;
      const basisForCoin = costBasis * hodl;

      // if we have the price data
      if (marketData[coin]){
        const coinPrice = Number(marketData[coin].ticker.price);
        const valueForCoin = coinPrice * hodl;

        totalValue = totalValue + valueForCoin;
      }
      totalBasis = totalBasis + basisForCoin;
    }

    const totalReturn = totalValue - totalBasis;
    const returnPercentage = this.returnPercentage(totalValue, totalBasis);

    return (
      <div>
        <h1>TotalPortfolio</h1>
        <p>{totalValue}</p>
        <p>{totalReturn} Return: ({returnPercentage}%)</p>
      </div>
    );
  }
}

export default TotalPortfolio;