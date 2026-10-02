import React, { Component } from 'react';
import { $numberWithCommas, $currencySymbol, returnMultiple} from '../Utils/Helpers';
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
    min-height: 1.2em;
  }
`
class TotalPortfolio extends Component {

  render() {
    const portfolio = this.props.totalPortfolio || { totalValue: 0, totalBasis: 0 };
    const totalValue = Number(portfolio.totalValue) || 0;
    const totalBasis = Number(portfolio.totalBasis) || 0;
    const totalReturn = totalValue - totalBasis;
    const returnX = returnMultiple(totalValue, totalBasis);
    const curSymbol = $currencySymbol(this.props.currency);

    return (
      <TotalPortfolioWrapper>
        <h1>{curSymbol}{$numberWithCommas(totalValue.toFixed(2))}</h1>
        <p>
          {totalValue > 0 ? (
            <>
              {curSymbol}{$numberWithCommas(totalReturn.toFixed(2))}&nbsp;
              ({$numberWithCommas(returnX.toFixed(2))}x)
            </>
          ) : (
            '\u00a0'
          )}
        </p>

        {/*<ChartPortfolioValue />*/}
      </TotalPortfolioWrapper>
    );
  }
}

export default TotalPortfolio;
