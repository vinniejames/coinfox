import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom'
import { Switch, Route } from 'react-router'

import Home from './Home';
import Coin from './Coin';
import Pie from './Pie';
import Menu from './Menu';

import './App.css';
import Blockstack from "./Blockstack";

class App extends Component {
  constructor() {
    super();
    this._addCoinz = this._addCoinz.bind(this);
  }
  state = {
    coinz: {},
    pref: {},
    marketData: false, // no data yet
    blockstack: false,
    exchangeRate: 1 // defaults to 1 for US Dollar
  }

  _readLocalStorage(){
    const userCoinData = localStorage.coinz ? JSON.parse(localStorage.coinz) : {};
    const userPref = localStorage.pref ? JSON.parse(localStorage.pref) : {};

    return {coinz: userCoinData, pref: userPref}
  }

  _saveCoinToStorage(key, payload) {
    const storage = this._readLocalStorage();
    if (storage.coinz[key]) {
      // if user had coin, add more
      const existingPriceAvg = storage.coinz[key].cost_basis;
      const existingHodl = storage.coinz[key].hodl;

      const addPriceAvg = payload.cost_basis;
      const addHodl = payload.hodl;

      const newHodl = addHodl + existingHodl;
      const newTotalValue = (addPriceAvg * addHodl) + (existingPriceAvg * existingHodl);

      const newPriceAvg = newTotalValue / newHodl;

      storage.coinz[key] = {
        cost_basis: newPriceAvg,
        hodl: newHodl
      }
      const newCoinz = storage.coinz;
      // @TODO save to blockstack instead;
      localStorage.setItem("coinz", JSON.stringify(newCoinz));
      this.setState({coinz: newCoinz})

    } else {
      // must be a new coin
      storage.coinz[key] = payload;
      const newCoinz = storage.coinz;
      console.log(newCoinz);

      // @TODO save to blockstack instead;
      localStorage.setItem("coinz", JSON.stringify(newCoinz));
      // must re-fetch market data if new coin
      this._marketData(newCoinz);
      this.setState({coinz: newCoinz})
    }
  }

  _addCoinz(coin){
    const ticker = coin.ticker;
    const costBasis = coin.avg_cost * coin.hodl;
    const payload = {
      cost_basis: costBasis,
      hodl: coin.hodl
    };
    if (this.state.blockstack) {
      setTimeout(() => {
        this._saveCoinToStorage(ticker, payload);
      }, 3000)

    } else {
      this._saveCoinToStorage(ticker, payload);
    }
  }

  _fetchThen(endpoint) {
    const promise = new Promise(function(resolve, reject) {
      let handleFetchErr = function(res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      };

      fetch(endpoint)
        .then(handleFetchErr)
        .then((res) => {
          return res.json()
        })
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          console.log(e);
          reject();
        });
    });

    return promise;
  }

  _marketData(userCoinz){
    let marketData = {};
    for (const coin in userCoinz) {
      // @TODO modify price based on userPref
      const currency = "USD";
      const endpoint = 'https://api.cryptonator.com/api/ticker/'+ coin.toLowerCase() + '-' + currency;

      this._fetchThen(endpoint)
        .then((res) => {
          marketData[coin] = res;
          this.setState({marketData: marketData});
        })
    }
    // @TODO find out why setting state after for loop broke things
    // this.setState({marketData: marketData});
  }

  componentDidMount() {
    if (window.location.pathname === "/blockstack") {
      setTimeout(() => {
        const storage = this._readLocalStorage();
        console.log('getting new data from localStorage');
        this._marketData(storage.coinz);
        this.setState({
          blockstack: true,
          coinz: storage.coinz,
          pref: storage.pref});
      }, 2000)

    } else {
      const storage = this._readLocalStorage();
      console.log('getting new data from localStorage');
      this._marketData(storage.coinz);
      this.setState({
        coinz: storage.coinz,
        pref: storage.pref
      });
    }

  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/"
                 render={(props) => <Home {...props}
                 coinz={this.state.coinz}
                 marketData={this.state.marketData} />} />
            <Route exact path="/blockstack"
                 render={(props) => <Blockstack {...props}
                 coinz={this.state.coinz}
                 marketData={this.state.marketData} />} />

            <Route path="/coin/*"
                 render={(props) => <Coin {...props}
                 coinz={this.state.coinz}
                 marketData={this.state.marketData} />} />

              <Route path="/pie" component={Pie} />
              <Route path="/menu"
                     render={(props) => <Menu {...props}
                     addCoinz={this._addCoinz} />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}


export default App;
