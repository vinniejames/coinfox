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

    this.state = {
      coinz: {},
      pref: {},
      marketData: false, // no data yet
      exchangeRate: 1, // defaults to 1 for US Dollar
      blockstack: isUserSignedIn(), //returns true if user is logged in
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
    const STORAGE_FILE = 'coinfox.json';
    getFile(STORAGE_FILE, decrypt)
      .then((gaia) => {
        const jsonGaia = JSON.parse(gaia);
        const gaiaCoinz = jsonGaia.coinz && jsonGaia.coinz || {};
        const gaiaPref = jsonGaia.pref && jsonGaia.pref || {};
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
            pref: this.state.pref
          };

          putFile(STORAGE_FILE, JSON.stringify(data), encrypt)
            .then(() => {
              this._marketData(newCoinz);
            })
            .then(() => {
              this.setState({coinz: newCoinz})
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
            pref: this.state.pref
          };

          putFile(STORAGE_FILE, JSON.stringify(data), encrypt)
            .then(() => {
              this._marketData(newCoinz);
            })
            .then(() =>{
              this.setState({coinz: newCoinz})
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
    const userPref = localStorage.pref ? JSON.parse(localStorage.pref) : {};

    return {coinz: userCoinData, pref: userPref}
  }

  componentDidMount() {

    if (isUserSignedIn()) {
      // @TODO make this a function that returns a promise
      const decrypt = true;
      const STORAGE_FILE = 'coinfox.json';
      getFile(STORAGE_FILE, decrypt)
        .then((gaia) => {
          const jsonGaia = JSON.parse(gaia);
          const gaiaCoinz = jsonGaia.coinz && jsonGaia.coinz || {};
          const gaiaPref = jsonGaia.pref && jsonGaia.pref || {};
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

    } else {
      const storage = this._readLocalStorage();
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
              render={
                (props) => <Home {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                />
              }
            />

            <Route exact path="/blockstack"
              render={
                (props) => <Blockstack {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                />
              }
            />

            <Route path="/coin/*"
              render={
                (props) => <Coin {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  blockstack={this.state.blockstack}
                />
               }
            />

            <Route path="/pie" component={Pie} />
            <Route path="/menu"
              render={
                (props) => <Menu {...props}
                  addCoinz={this._addCoinz}
                  blockstack={this.state.blockstack}
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
