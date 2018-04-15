import React, { Component } from 'react';
import { $numberWithCommas, $currencySymbol} from '../Utils/Helpers';
//import ChartPortfolioValue from './ChartPortfolioValue';
import styled from 'styled-components';

const TotalPortfolioWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  h1 {
    font-weight: 300;
    font-size: 2.5rem;
    color: white;
    margin: 5px;
  }
  p {
    margin-top: 5px;
  }
`
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
        <TotalPortfolioWrapper>
          <h1>{curSymbol}{$numberWithCommas(totalValue.toFixed(2))}</h1>
          <p>{curSymbol}{$numberWithCommas(totalReturn.toFixed(2))}&nbsp;
            ({$numberWithCommas(returnPercentage.toFixed())}%)</p>

          {/*<ChartPortfolioValue />*/}
        </TotalPortfolioWrapper>
      );
    } else {
      // @TODO add loading animation
      return null;
    }
  }
}

export default TotalPortfolio;
