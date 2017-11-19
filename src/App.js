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

    this.state = {
      coinz: {},
      pref: {},
      marketData: false, // no data yet
      blockstack: false,
      exchangeRate: 1 // defaults to 1 for US Dollar
    }
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
        // this.setState({
        //   blockstack: true,
        //   coinz: storage.coinz,
        //   pref: storage.pref});
      }, 2000)

      // @TODO VALID LOGIN
      //http://localhost:8888/auth?authRequest=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJiNWVlOTk4OC1mZTgzLTRiMjYtYmVhNi0zZTA1OWFhZTQ3YjgiLCJpYXQiOjE1MTEwNTM1MTYsImV4cCI6MTUxMTA1NzExNiwiaXNzIjoiZGlkOmJ0Yy1hZGRyOjE0S0NaVXhIQ1BSV3JVR1Jkb3RIZXg1VjJlWENtaHNGVGgiLCJwdWJsaWNfa2V5cyI6WyIwMmQ3MmNjYmFlMzkwZjZlOTYxNTU1YmQyY2M5YTBhMzI3ODYzNzE1ODMxNTIwYTExZDY2NjhjNzhkNWFmODQzYWQiXSwiZG9tYWluX25hbWUiOiJodHRwOi8vdXNlLmNvaW5zYXBwLmNvIiwibWFuaWZlc3RfdXJpIjoiaHR0cDovL3VzZS5jb2luc2FwcC5jby9tYW5pZmVzdC5qc29uIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL3VzZS5jb2luc2FwcC5jby8iLCJzY29wZXMiOlsic3RvcmVfd3JpdGUiXX0.4PuIFj2qWQtx2ZBY_6gQgjm2_KCn2hhdgvia_hTqHqdAXj7ZsDMRoeDadrVDaoGtnaj8WA-aDv3cS6CbNYzaLQ#coreAPIPassword=off&logServerPort=off
      //http://localhost:8888/auth?authRequest=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJhNjg3MDc5OS1jMmExLTQ2ZjktODVlNy05ZjRiZThmNzMwYjIiLCJpYXQiOjE1MTEwNTM4MTksImV4cCI6MTUxMTA1NzQxOSwiaXNzIjoiZGlkOmJ0Yy1hZGRyOjFMSkNRZkZkS0JuMmdTdjVoOGZVZmFhMk5WejJSRWVWN1oiLCJwdWJsaWNfa2V5cyI6WyIwMjJmMjI2YzE4OTZjN2MyYTQ0MzgxYTJkOGYwODFkOGY3ZmRjZGZlYzlhNzAzZDU2MWU5YzQwZDI2YWNiMWFhMjEiXSwiZG9tYWluX25hbWUiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJtYW5pZmVzdF91cmkiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvbWFuaWZlc3QuanNvbiIsInJlZGlyZWN0X3VyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8iLCJ2ZXJzaW9uIjoiMS4xLjAiLCJkb19ub3RfaW5jbHVkZV9wcm9maWxlIjp0cnVlLCJzY29wZXMiOlsic3RvcmVfd3JpdGUiXX0.zqqS45VRF2zHTIgvGR2lQM-NGV9Hlpc51-6aBFbMSOFKuJFM9CwRipD0ULGSL3jQpiAgRaJQX-JQ4l1UhbOR0g#coreAPIPassword=off&logServerPort=off
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
