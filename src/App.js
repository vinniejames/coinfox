import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import {
  isUserSignedIn,
  putFile,
  getFile
} from 'blockstack';

import fetch from 'fetch-retry';

import Home from './Pages/Home';
import Coin from './Pages/Coin';
import Pie from './Pages/Pie';
import Menu from './Pages/Menu';
import SupportedCoins from './Pages/SupportedCoins';

import './App.css';
import Blockstack from "./Blockstack";

import {translationStrings} from './i18n';
const string = translationStrings();



// @TODO yo generator
// https://github.com/blockstack/blockstack-app-generator

class App extends Component {
  constructor() {
    super();
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

  addExistingCoin (storage, key, payload) {
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

  saveCoinToStorage = (key, payload) => {
    const storage = this.readLocalStorage();
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
      this.marketData(newCoinz);
      this.setState({coinz: newCoinz})
    }
  }

  saveCoinToGaia = (key, payload) => {
    // @TODO make this a function that returns a promise

    // @TODO DO THIS READING FROM STATE INSTEAD!!!
    // NO REASON TO getFile IF IT WILL BE OVERWRITTEN


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
              this.marketData(newCoinz);
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
              this.marketData(newCoinz);
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

  addCoinz = (coin) => {
    const ticker = coin.ticker;
    const costBasis = coin.avg_cost;
    const hodl = coin.hodl;

    if (!ticker || !costBasis || !hodl) {
      alert(string.fillticker);
    } else {
      const payload = {
        cost_basis: costBasis,
        hodl: hodl
      };
      if (isUserSignedIn()) {
        this.saveCoinToGaia(ticker, payload);
      } else {
        this.saveCoinToStorage(ticker, payload);
      }
      // go back
      //history.goBack()
      alert(ticker.toUpperCase() + string.added)
    }
  }

  fetchThen = (endpoint) => {
    const promise = new Promise(function(resolve, reject) {
      let handleFetchErr = function(res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      };

      const retryFetch = {
        retries: 3,
        retryDelay: 1000
      };

      fetch(endpoint, retryFetch)
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

  // _percentOfPortfolio (coinz) {
  //   let totalPortfolio = 0;
  //   // coinz.forEach((coin) => {
  //   //   const currentValue = coin.hodl * price;
  //   //   totalPortfolio = totalPortfolio + currentValue;
  //   // })
  //   for (const coin in coinz) {
  //     const price = this.state.marketData[coin];
  //     console.log(coinz[coin].hodl, price)
  //     const currentValue = coinz[coin].hodl * price;
  //     totalPortfolio = totalPortfolio + currentValue;
  //   }
  //   console.log(totalPortfolio);
  //   return totalPortfolio;
  // }

  marketData = (userCoinz) => {
    let marketData = {};
    for (const coin in userCoinz) {
      // @TODO modify price based on userPref
      const currency = "usd";
      const endpoint = 'https://api.cryptonator.com/api/ticker/'+ coin.toLowerCase() + '-' + currency;

      this.fetchThen(endpoint)
        .then((res) => {
          marketData[coin] = res;
          this.setState({marketData: marketData});
        })
    }
    // this._percentOfPortfolio(userCoinz);
    // @TODO find out why setting state after for loop broke things
    // this.setState({marketData: marketData});

  }

  readLocalStorage(){
    const userCoinData = localStorage.coinz ? JSON.parse(localStorage.coinz) : {};
    const userPref = localStorage.pref ? JSON.parse(localStorage.pref) : {currency:"USD"};

    return {coinz: userCoinData, pref: userPref}
  }

  fetchExchangeRates = () => {
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

  totalPortfolio = (exchangeRate) => {

    const coinz = this.state.coinz ? this.state.coinz : false;
    const marketData = this.state.marketData ? this.state.marketData : false;

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
        let coinPrice = price * exchangeRate;
        const valueForCoin = coinPrice * hodl;

        totalValue = totalValue + valueForCoin;
      }
      totalBasis = totalBasis + basisForCoin;
    }

    return {
      totalValue: totalValue,
      totalBasis: totalBasis
    }
  }

  componentDidMount() {
    // check for portfolio import string
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("import")) {
      const importPortfolio = JSON.parse(atob(searchParams.get("import")));
      const alreadyImported = searchParams.get("import") == localStorage.getItem("lastImport");

      if (alreadyImported) {
        console.log('already imported this portfolio');
        window.location.search = "x";
      } else {
        // import the new portfolio
        if (importPortfolio.pref) {
          localStorage.setItem("pref", importPortfolio.pref);
        }
        if (importPortfolio.coinz) {
          localStorage.setItem("coinz", importPortfolio.coinz);
        }
        localStorage.setItem("lastImport", searchParams.get("import"));
        window.location.search = ""
      }
    }


    // @TODO find out why isUserSignedIn re:true, even if blockstack isnt running
    if (isUserSignedIn() && window.location.pathname == "/blockstack") {
      // @TODO make this a function that returns a promise
      const decrypt = true;
      getFile(this.state.gaiaStorage, decrypt)
        .then((gaia) => {

          console.log('gimme gaia', gaia);

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
          this.marketData(this.state.coinz);
        })
        .then(() => {
          this.fetchExchangeRates();
        })
        .catch((ex) => {
          console.log(ex, 'Gaia get exception');


          // @TODO dont assume all exceptions are missing gaia file

          const encrypt = true;
          const data = {
            coinz: this.state.coinz,
            pref: {currency:"USD"}
          };
          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(()=>{
              window.location.reload();
            })
            .catch((ex) => {
              console.log(ex, 'Gaia put exception');
            })
        })

    } else {
      const storage = this.readLocalStorage();
      this.marketData(storage.coinz);
      this.setState({
        coinz: storage.coinz,
        pref: storage.pref
      });
      this.fetchExchangeRates();
    }

  }

  saveNewPref = (newPref) => {
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


  deleteCoin = (coin, history) => {
    var strconfirm = window.confirm(string.remove+ coin.toUpperCase() +string.fromportfolio);
    if (strconfirm === true) {

      const current = this.state.coinz;
      Object.assign({}, current);
      delete current[coin];

      if(isUserSignedIn()) {
        // delete from blockstack
        const data = {
          coinz: current,
          pref: this.state.pref
        };
        const encrypt = true;
        putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
        // may not need to set state, because it should read from storage again
          .then(() => {
            this.setState({
              coinz: current
            })
          })
          .catch((ex) => {
            console.log(ex, 'Gaia put exception');
          })

      } else {
        // delete from localStorage
        localStorage.setItem("coinz", JSON.stringify(current));
        // go back home
      }

      // then go back
      history.goBack();

    }
  }

  render() {
    const exchangeRate = this.state.exchangeRates[this.state.pref.currency]
      ? this.state.exchangeRates[this.state.pref.currency]
      : 1; // default 1 for USD

    const totalPortfolio = this.totalPortfolio(exchangeRate);

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
                  supportedCurrencies={this.state.supportedCurrencies}
                  totalPortfolio={totalPortfolio}
                  currency={this.state.pref && this.state.pref.currency || "USD"}
                  addCoinz={this.addCoinz}
                  saveNewPref={this.saveNewPref}
                />
              }
            />

            <Route exact path="/blockstack"
              render={
                (props) => <Blockstack {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                  supportedCurrencies={this.state.supportedCurrencies}
                  currency={this.state.pref && this.state.pref.currency || "USD"}
                  addCoinz={this.addCoinz}
                  saveNewPref={this.saveNewPref}
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
                  deleteCoin={this.deleteCoin}
                  currency={this.state.pref && this.state.pref.currency || "USD"}
                />
               }
            />

            <Route path="/pie"
              render={
                (props) => <Pie {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                  totalPortfolio={totalPortfolio}
                />
              }
            />

            <Route path="/menu"
              render={
                (props) => <Menu {...props}
                  addCoinz={this.addCoinz}
                  blockstack={this.state.blockstack}
                  pref={this.state.pref}
                  saveNewPref={this.saveNewPref}
                  supportedCurrencies={this.state.supportedCurrencies}
                  currency={this.state.pref && this.state.pref.currency || "USD"}
                />
              }
            />

            <Route path="/supportedcoins" component={SupportedCoins} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
