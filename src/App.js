import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor () {
    super();

    this._toggleMenu = this._toggleMenu.bind(this);
    this._onChange = this._onChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);

    this.state = {
      menu_visibility: "hidden",
      add_ticker: "",
      add_cost_basis: "",
      add_hodl: "",
      coinz: {}
    }
  }

  componentWillMount(){
    const localCoins = {};
    // object to array for map
    const lStore = Object.entries(localStorage);

    lStore.map((key) => {
      const ticker = key[0].replace(/_.*/i, '');
      const cost = ticker + "_cost_basis";
      const hodl = ticker + "_hodl";

      // if localCoins doesnt have the ticker yet, create it
      // add localStorage key to localCoins for state
      if (!localCoins.hasOwnProperty(ticker)) {
        localCoins[ticker] = {hodl: null, cost_basis: null};
        if (key[0] === cost) {
          // key[x] needs to be converted into number
          localCoins[ticker].cost_basis = Number(key[1]);
        } else if (key[0] === hodl) {
          localCoins[ticker].hodl = Number(key[1]);
        } else {
          console.log('invalid localStorage');
        }
      // localCoins has the ticker, so we add to it instead
      } else {
        if (key[0] === cost) {
          localCoins[ticker].cost_basis = Number(key[1]);
        } else if (key[0] === hodl) {
          localCoins[ticker].hodl = Number(key[1]);
        } else {
          console.log('invalid localStorage');
        }
      }
    })
    const localCoinsLength = Object.keys(localCoins).length;
    const localStorageLength = Object.keys(localStorage).length / 2;
    const newCoinsState = {
      coinz: localCoins
    }
    this.setState(newCoinsState);
  }

  componentDidMount(){
    this._marketPrice();
  }

  _numberWithCommas(d) {
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  _costBasis(){
    var cost = 0;

    for (var coin in this.state.coinz) {
      const cost_basis = this.state.coinz[coin].cost_basis;
      const hodl = this.state.coinz[coin].hodl;
      if (hodl){
        cost = cost + (hodl * cost_basis);
      }
    }

    return cost //.toFixed(2);
  }

  _portfolioValue(){
    var value = 0;

    for (var coin in this.state.coinz) {
      const hodl = this.state.coinz[coin].hodl;
      const curr_price = this.state.coinz[coin].curr_price;
      if (hodl){
        value = value + (hodl * curr_price);
      }
    }

    return value //.toFixed(2);
  }

  _totalGainLoss(){
    return ( this._portfolioValue() - this._costBasis() ) //.toFixed(2);
  }

  _percentReturn(){
    return ( 100 * ( ( this._portfolioValue() / this._costBasis() ) - 1 ) ) //.toFixed(2);
  }

  _marketPrice(){
    const tempState = this.state.coinz;

    for (var coin in this.state.coinz) {
      var count = 1;
      const numCoins = Object.keys(this.state.coinz).length;
      const endpoint = 'https://api.cryptonator.com/api/ticker/'+ coin +'-usd';

      fetch(endpoint)
      .then(function(res) {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then(function(res){
        const price = res.ticker.price;
        // var coin was not keeping the correct value in here
        // using res.ticker.base instead
        const theCoin = res.ticker.base.toLowerCase();
        tempState[theCoin].curr_price = price;
      })
      .then(function(){
        count++;
        if (count >= numCoins) {
          this.setState({coinz: tempState});
        }
      }.bind(this))
    }

  }

  _toggleMenu(){
    if (this.state.menu_visibility === "hidden") {
      this.setState({menu_visibility: ""})
    } else {
      this.setState({menu_visibility: "hidden"})
    }
  }

  _handleSubmit (e) {
    e.preventDefault();

    const keyCost = this.state.add_ticker.toLowerCase() + "_cost_basis";
    const keyHodl = this.state.add_ticker.toLowerCase() + "_hodl";
    const costBasis = this.state.add_cost_basis;
    const hodl = this.state.add_hodl;
    localStorage.setItem(keyCost, costBasis);
    localStorage.setItem(keyHodl, hodl);
    window.location.href = window.location.href;
  }

  _onChange (e) {
    var text = e.target.value;
    var item = e.target.className;

    this.setState({[item]: text});
  }

  render() {
    const coinStats = Object.entries(this.state.coinz);
    const gainz = Object.keys(this.state.coinz).length
      ? "$" + this._numberWithCommas(this._totalGainLoss().toFixed(2)) + " (" + this._numberWithCommas(this._percentReturn().toFixed(2)) + "%)"
      : "Use the menu to add your coin holdings";
    return (
      <div className="App">
        <i onClick={this._toggleMenu} className="btn-menu fa fa-lg fa-bars" aria-hidden="true"></i>
        <div id="menu-body" className={this.state.menu_visibility}>
          <i onClick={this._toggleMenu} className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i>

          <form className="" onSubmit={this._handleSubmit}>
                <input type="text"
                  className="add_ticker"
                  onChange={this._onChange}
                  value={this.state.ticker}
                  placeholder="Ticker: (BTC, LTC, etc)"/>
                  <br/>
                <input type="text"
                  className="add_cost_basis"
                  onChange={this._onChange}
                  value={this.state.cost_basist}
                  placeholder="Average Cost Basis (per coin)"/>
                  <br/>
                <input type="text"
                  className="add_hodl"
                  onChange={this._onChange}
                  value={this.state.hodl}
                  placeholder="Number of Coins Held"/>
                <br/>
                <input className="" type="submit" value="Go"/>
            </form>

        </div>

        <div className="App-header">
          <div className="Overview">
          <h1>
            ${this._numberWithCommas(this._portfolioValue().toFixed(2))}
          </h1>
          <h2>
            {gainz}
          </h2>
          </div>
        </div>
        <div className="Coins">
          {coinStats.map(function(coin, i){
            const ticker = coin[0].toUpperCase();
            const hodl = coin[1].hodl.toFixed(2);
            const gain_loss = ((Number(coin[1].curr_price) - coin[1].cost_basis) * coin[1].hodl).toFixed(2);
            const curr_price = Number(coin[1].curr_price).toFixed(2);
            const color = gain_loss >= 0 ? "green" : "red";

            if (!Number(hodl)) {
              return null;
            } else {
              return (
                <div key={i} className="coin">
                  <p className="float-left">
                    {ticker}<br/>
                    <span>{this._numberWithCommas(hodl)} Coins</span>
                  </p>
                  <p className="text-right float-right">
                    <span className={color}>${this._numberWithCommas(gain_loss)}</span><br/>
                    <span>${this._numberWithCommas(curr_price)}</span>
                  </p>
                </div>
              );
            }

          }.bind(this))}
        </div>
      </div>
    );
  }
}

export default App;
