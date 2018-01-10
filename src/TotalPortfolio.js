import React, { Component } from 'react';
import { $numberWithCommas, $currencySymbol} from './Helpers';
class TotalPortfolio extends Component {

  returnPercentage (currentValue, costBasis) {
    return (currentValue - costBasis) / costBasis * 100;
  }

  render() {
    const totalValue = this.props.totalPortfolio.totalValue;
    const totalBasis = this.props.totalPortfolio.totalBasis;
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
