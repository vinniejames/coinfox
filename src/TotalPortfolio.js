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
        // set price to 0 if it doesnt exist
        const price = (marketData[coin] && marketData[coin].ticker && marketData[coin].ticker.price)
          ? Number(marketData[coin].ticker.price)
          : 0;
          // coinPrice adjusted for exchange rate
        let coinPrice = price * this.props.exchangeRate;
        const valueForCoin = coinPrice * hodl;

        totalValue = totalValue + valueForCoin;
      }
      totalBasis = totalBasis + basisForCoin;
    }

    const totalReturn = totalValue - totalBasis;
    const returnPercentage = this.returnPercentage(totalValue, totalBasis);

    return (
      <div className="TotalPortfolio">
        <h1>$ {totalValue}</h1>
        <p>$ {totalReturn} ({returnPercentage}%)</p>
      </div>
    );
  }
}

export default TotalPortfolio;