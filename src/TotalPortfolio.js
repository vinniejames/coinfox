import React, { Component } from 'react';
import { $numberWithCommas, $currencySymbol} from './Helpers';
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
    const curSymbol = $currencySymbol(this.props.currency);

    if (totalValue > 0) {
      return (
        <div className="TotalPortfolio">
          <h1>{curSymbol}{$numberWithCommas(totalValue.toFixed(2))}</h1>
          <p>{curSymbol}{$numberWithCommas(totalReturn.toFixed(2))}
            ({$numberWithCommas(returnPercentage.toFixed())}%)</p>
        </div>
      );
    } else {
      // @TODO add loading animation
      return null;
    }
  }
}

export default TotalPortfolio;