import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { isUserSignedIn } from 'blockstack';

import Pie from './Pie';
import TotalPortfolio from '../Components/TotalPortfolio';
import CoinList from '../Components/CoinList';
import CurrencyPref from '../Components/CurrencyPref';
import AddCoin from '../Components/AddCoin';
import {translationStrings} from '../Utils/i18n';

const string = translationStrings();

class Home extends Component {

  constructor () {
    super()
    this.state = {
      listView: true
    }
    this._toggleView = this._toggleView.bind(this);
  }

  componentDidMount () {
    // if (window.location.search.indexOf("blockstring")) {
    //   console.log('adjusting redirect in HOMEx');
    //   var redirectPath = localStorage.getItem("blockstring");
    //   // window.history.replaceState(null, null, redirectPath);
    //   this.props.history.push(redirectPath);
    //   localStorage.removeItem('blockstring');
    // }
  }

  _toggleView () {
    this.setState({listView: !this.state.listView});
  }
  render() {
    const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
    if (coinz) {
      return (
        <div className="Home">
          <div className="header">
            <Link className="menu" key='Menu' to='/menu'>
              <i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
            </Link>
            <TotalPortfolio
              totalPortfolio={this.props.totalPortfolio}
              currency={this.props.currency}
              exchangeRate={this.props.exchangeRate}
              marketData={this.props.marketData}
              coinz={this.props.coinz}
              key={"TotalPortfolio"}/>
          </div>
          <div className="toggleView">
            <i onClick={this._toggleView} className={this.state.listView ? "fa fa-lg fa-pie-chart" : "fa fa-lg fa-th-list"} aria-hidden="true"></i>
          </div>
          {!this.state.listView && <Pie
              coinz={this.props.coinz}
              marketData={this.props.marketData}
              exchangeRate={this.props.exchangeRate}
              totalPortfolio={this.props.totalPortfolio}
          />}
          {this.state.listView && <CoinList
            currency={this.props.currency}
            exchangeRate={this.props.exchangeRate}
            marketData={this.props.marketData}
            coinz={this.props.coinz}
            key={"CoinList"}/>}
        </div>
      );
    } else { // if (!isUserSignedIn()) {
      console.log("!isUserSignedIn()");
      // NEW User Welcome screen
      return (
        <div className="Home">
          <div className="header">
            <Link className="menu" key='Menu' to='/menu'>
              <i className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
            </Link>
            <h1 className="center">{string.welcome}</h1>
            <p className="center">{string.tag}</p>
          </div>
          <div className="addFirstCoin">
            <CurrencyPref
              supportedCurrencies={this.props.supportedCurrencies}
              saveNewPref={this.props.saveNewPref}
              currency={this.props.currency} />
            <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>
          </div>

        </div>
      );
    } //else {
      //return null // @TODO add loading screen
    //}
  }
}

export default Home;
