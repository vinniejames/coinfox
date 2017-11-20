import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom'
import { Switch, Route } from 'react-router'
import {
  isUserSignedIn,
  putFile,
  getFile
} from 'blockstack';

import Home from './Home';
import Coin from './Coin';
import Pie from './Pie';
import Menu from './Menu';

import './App.css';
import Blockstack from "./Blockstack";

// @TODO yo generator
// https://github.com/blockstack/blockstack-app-generator

class App extends Component {
  constructor() {
    super();
    this._addCoinz = this._addCoinz.bind(this);
    this._saveNewPref = this._saveNewPref.bind(this);
    this._fetchExchangeRates = this._fetchExchangeRates.bind(this);

    const supportedCurrencies = [
      ['AUD', '$'],
      ['BGN', 'лв'],
      ['BRL', 'R$'],
      // ['BTC', '฿'],
      ['CAD', '$'],
      ['CHF', 'Fr.'],
      ['CNY', '¥'],
      ['CZK', 'Kč'],
      ['DKK', 'kr'],
      ['EUR', '€'],
      ['GBP', '£'],
      ['HKD', '$'],
      ['HRK', 'kn'],
      ['HUF', 'Ft'],
      ['IDR', 'Rp'],
      ['ILS', '₪'],
      ['INR', '₹'],
      ['JPY', '¥'],
      ['KRW', '₩'],
      ['MXN', '$'],
      ['MYR', 'RM'],
      ['NOK', 'kr'],
      ['NZD', '$'],
      ['PHP', '₱'],
      ['PLN', 'zł'],
      ['RON', 'lei'],
      // ['RUR', '₽'],
      ['SEK', 'kr'],
      ['SGD', '$'],
      ['THB', '฿'],
      ['TRY', '₺'],
      // ['UAH', '₴'],
      ['USD', '$'],
      ['ZAR', 'R'],
    ];

    this.state = {
      coinz: {},
      pref: {},
      marketData: false, // no data yet
      exchangeRates: {USD: 1}, // defaults to 1 for US Dollar
      blockstack: isUserSignedIn(), //returns true if user is logged in
      gaiaStorage: 'coinfox.json',
      supportedCurrencies: supportedCurrencies,
    }
  }

  _addExistingCoin (storage, key, payload) {
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
    };

    return storage.coinz;
  }

  _saveCoinToStorage(key, payload) {
    const storage = this._readLocalStorage();
    if (storage.coinz[key]) {
      const newCoinz = this._addExistingCoin(storage, key, payload);

      localStorage.setItem("coinz", JSON.stringify(newCoinz));
      this.setState({coinz: newCoinz})

    } else {
      // must be a new coin
      storage.coinz[key] = payload;
      const newCoinz = storage.coinz;

      localStorage.setItem("coinz", JSON.stringify(newCoinz));
      // must re-fetch market data if new coin
      this._marketData(newCoinz);
      this.setState({coinz: newCoinz})
    }
  }

  _saveCoinToGaia(key, payload) {
    // @TODO make this a function that returns a promise
    const decrypt = true;
    getFile(this.state.gaiaStorage, decrypt)
      .then((gaia) => {
        const jsonGaia = JSON.parse(gaia);
        const gaiaCoinz = jsonGaia.coinz && jsonGaia.coinz || {};
        const gaiaPref = jsonGaia.pref && jsonGaia.pref || {currency:"USD"};
        const userData = {
          coinz: gaiaCoinz,
          pref: gaiaPref
        };
        return userData;
      })
      .then((storage) => {
        console.log(storage.coinz, storage.pref, 'for gaia to save');
        const encrypt = true;

        if (storage.coinz[key]) {
          //user already has this coin
          const newCoinz = this._addExistingCoin(storage, key, payload);
          const data = {
            coinz: newCoinz,
            pref: storage.pref
          };

          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(() => {
              this._marketData(newCoinz);
            })
            .then(() => {
              this.setState({
                coinz: newCoinz,
                pref: storage.pref
              })
            })
            .catch((ex) => {
              console.log(ex, 'Gaia put exception');
            })
        } else {
          // must be a new coin
          storage.coinz[key] = payload;
          const newCoinz = storage.coinz;
          const data = {
            coinz: newCoinz,
            pref: storage.pref
          };

          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(() => {
              this._marketData(newCoinz);
            })
            .then(() =>{
              this.setState({
                coinz: newCoinz,
                pref: storage.pref
              })
            })
            .catch((ex) => {
              console.log(ex, 'Gaia put exception');
            })
        }

      })
  }

  _addCoinz(coin){
    const ticker = coin.ticker;
    const costBasis = coin.avg_cost;
    const payload = {
      cost_basis: costBasis,
      hodl: coin.hodl
    };
    if (isUserSignedIn()) {
      this._saveCoinToGaia(ticker, payload);
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
  _readLocalStorage(){
    const userCoinData = localStorage.coinz ? JSON.parse(localStorage.coinz) : {};
    const userPref = localStorage.pref ? JSON.parse(localStorage.pref) : {currency:"USD"};

    return {coinz: userCoinData, pref: userPref}
  }

  _fetchExchangeRates () {
    const currencies = this.state.supportedCurrencies.map((cur) => {
      return cur[0];
    });
    const endpoint = 'https://api.fixer.io/latest?base=USD&symbols=' + currencies.toString();

    return fetch(endpoint)
      .then(function(res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res)=> {
          // set default to US 1
          res.rates.USD = 1;
          this.setState({exchangeRates: res.rates});
        }
      )
  }

  componentDidMount() {

    if (isUserSignedIn()) {
      // @TODO make this a function that returns a promise
      const decrypt = true;
      getFile(this.state.gaiaStorage, decrypt)
        .then((gaia) => {
          const jsonGaia = JSON.parse(gaia);
          const gaiaCoinz = jsonGaia.coinz && jsonGaia.coinz || {};
          const gaiaPref = jsonGaia.pref && jsonGaia.pref || {currency:"USD"};
          const userData = {
            coinz: gaiaCoinz,
            pref: gaiaPref
          };
          return userData;
        })
        // @TODO return promise here, then setState
        .then((userData) => {
          this.setState(userData);
        })
        .then(() => {
          this._marketData(this.state.coinz);
        })
        .then(() => {
          this._fetchExchangeRates();
        })

    } else {
      const storage = this._readLocalStorage();
      this._marketData(storage.coinz);
      this.setState({
        coinz: storage.coinz,
        pref: storage.pref
      });
      this._fetchExchangeRates();
    }

  }

  _saveNewPref(newPref) {
    if (isUserSignedIn()){
      const encrypt = true;
      const data = {
        coinz: this.state.coinz,
        pref: {currency: newPref}
      };
      // set state first, to avoid waiting for storage to update
      this.setState({
        pref: data.pref
      });
      putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
        .catch((ex) => {
          console.log(ex, 'Gaia put exception');
        })
    } else {
      localStorage.setItem("pref", JSON.stringify({currency: newPref}));
      this.setState({pref: {currency: newPref}});
    }
  }

  render() {
    const exchangeRate = this.state.exchangeRates[this.state.pref.currency]
      ? this.state.exchangeRates[this.state.pref.currency]
      : 1; // default 1 for USD

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/"
              render={
                (props) => <Home {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                />
              }
            />

            <Route exact path="/blockstack"
              render={
                (props) => <Blockstack {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                />
              }
            />

            <Route path="/coin/*"
              render={
                (props) => <Coin {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  blockstack={this.state.blockstack}
                  exchangeRate={exchangeRate}
                />
               }
            />

            <Route path="/pie" component={Pie} />
            <Route path="/menu"
              render={
                (props) => <Menu {...props}
                  addCoinz={this._addCoinz}
                  blockstack={this.state.blockstack}
                  pref={this.state.pref}
                  saveNewPref={this._saveNewPref}
                  supportedCurrencies={this.state.supportedCurrencies}
                />
              }
            />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
