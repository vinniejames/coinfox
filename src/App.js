import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import {
  isUserSignedIn,
  putFile,
  getFile,
} from './Utils/blockstackCompat';
import fetchRetry from './Utils/fetchRetry';
import {
  readPortfolio,
  writeCoinz,
  setPrefKey,
  hasCoinz,
  getHttpsFlag,
  setHttpsFlag,
  getLastImport,
  setLastImport,
  importPortfolioPayload,
  serializeLocalStorage,
  mergeCoinHolding,
  STORAGE_KEYS,
} from './storage';

import Home from './Pages/Home';
import Coin from './Pages/Coin';
import Pie from './Pages/Pie';
import Menu from './Pages/Menu';
import SupportedCoins from './Pages/SupportedCoins';
import Blockstack from './Components/Blockstack';

import './App.css';
import { translationStrings } from './Utils/i18n';

const string = translationStrings();

const supportedCurrencies = [
  ['AUD', '$'],
  ['BGN', 'лв'],
  ['BRL', 'R$'],
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
  ['SEK', 'kr'],
  ['SGD', '$'],
  ['THB', '฿'],
  ['TRY', '₺'],
  ['USD', '$'],
  ['ZAR', 'R'],
];

class App extends Component {
  constructor() {
    super();

    this.state = {
      coinz: {},
      pref: {},
      marketData: false,
      exchangeRates: { USD: 1 },
      blockstack: isUserSignedIn(),
      gaiaStorage: 'coinfox.json',
      supportedCurrencies,
    };
  }

  addExistingCoin(storage, key, payload) {
    storage.coinz[key] = mergeCoinHolding(storage.coinz[key], payload);
    return storage.coinz;
  }

  saveCoinToStorage = (key, payload) => {
    const storage = readPortfolio();
    if (storage.coinz[key]) {
      const newCoinz = this.addExistingCoin(storage, key, payload);
      writeCoinz(newCoinz);
      this.setState({ coinz: newCoinz });
    } else {
      storage.coinz[key] = payload;
      const newCoinz = storage.coinz;
      writeCoinz(newCoinz);
      this.marketData(newCoinz);
      this.setState({ coinz: newCoinz });
    }
  };

  saveCoinToGaia = (key, payload) => {
    const decrypt = true;
    getFile(this.state.gaiaStorage, decrypt)
      .then((gaia) => {
        const jsonGaia = JSON.parse(gaia);
        const gaiaCoinz = (jsonGaia.coinz && jsonGaia.coinz) || {};
        const gaiaPref = (jsonGaia.pref && jsonGaia.pref) || { currency: 'USD' };
        return { coinz: gaiaCoinz, pref: gaiaPref };
      })
      .then((storage) => {
        const encrypt = true;

        if (storage.coinz[key]) {
          const newCoinz = this.addExistingCoin(storage, key, payload);
          const data = { coinz: newCoinz, pref: storage.pref };

          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(() => {
              this.marketData(newCoinz);
            })
            .then(() => {
              this.setState({ coinz: newCoinz, pref: storage.pref });
            })
            .catch((ex) => {
              console.log(ex, 'Gaia put exception');
            });
        } else {
          storage.coinz[key] = payload;
          const newCoinz = storage.coinz;
          const data = { coinz: newCoinz, pref: storage.pref };

          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(() => {
              this.marketData(newCoinz);
            })
            .then(() => {
              this.setState({ coinz: newCoinz, pref: storage.pref });
            })
            .catch((ex) => {
              console.log(ex, 'Gaia put exception');
            });
        }
      });
  };

  addCoinz = (coin) => {
    const ticker = coin.ticker;
    const costBasis = coin.avg_cost;
    const hodl = coin.hodl;

    if (!ticker || !costBasis || !hodl) {
      alert(string.fillticker);
    } else {
      const payload = {
        cost_basis: costBasis,
        hodl: hodl,
      };
      if (isUserSignedIn()) {
        this.saveCoinToGaia(ticker, payload);
      } else {
        this.saveCoinToStorage(ticker, payload);
      }
      alert(ticker.toUpperCase() + string.added);
    }
  };

  fetchThen = (endpoint) => {
    return new Promise((resolve, reject) => {
      const handleFetchErr = (res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      };

      fetchRetry(endpoint, { retries: 3, retryDelay: 1000 })
        .then(handleFetchErr)
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          reject();
        });
    });
  };

  marketData = async (userCoinz) => {
    let marketData = {};
    const userTickers = Object.keys(userCoinz);

    try {
      const usersCoinList = (
        await fetch('https://api.coingecko.com/api/v3/coins/list').then((res) =>
          res.json()
        )
      ).filter((coin) => userTickers.includes(coin.symbol));
      const usersCoinIds = usersCoinList.map((coin) => coin.id);

      const currency = 'usd';
      const usersMarketData = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${usersCoinIds.join(
          '%2C'
        )}&vs_currencies=${currency}&include_24hr_vol=true&include_24hr_change=true`
      ).then((res) => res.json());

      userTickers.forEach((t) => {
        try {
          const meta = usersCoinList.find((c) => c.symbol === t);
          const marketDataz = usersMarketData[meta.id];
          marketData[t] = {
            ticker: {
              base: t.toUpperCase(),
              target: currency.toUpperCase(),
              price: marketDataz[currency],
              volume: marketDataz.usd_24h_vol,
              change: marketDataz.usd_24h_change,
            },
            timestamp: Math.floor(new Date().getTime() / 100),
            success: true,
            error: '',
          };
        } catch (e) {
          console.log(e, `ticker not found in market data: ${t}`);
        }
      });
      this.setState({ marketData });
    } catch (e) {
      console.log(e, 'marketData fetch failed');
      this.setState({ marketData: {} });
    }
  };

  readLocalStorage() {
    return readPortfolio();
  }

  fetchExchangeRates = () => {
    // CoinGecko local currency pricing is preferred long-term;
    // exchangeRates currently defaults to USD = 1.
  };

  totalPortfolio = (exchangeRate) => {
    const coinz = this.state.coinz ? this.state.coinz : false;
    const marketData = this.state.marketData ? this.state.marketData : false;

    let totalValue = 0;
    let totalBasis = 0;

    for (const coin in coinz) {
      const costBasis = coinz[coin].cost_basis;
      const hodl = coinz[coin].hodl;
      const basisForCoin = costBasis * hodl;

      if (marketData[coin]) {
        const price =
          marketData[coin] &&
          marketData[coin].ticker &&
          marketData[coin].ticker.price
            ? Number(marketData[coin].ticker.price)
            : 0;
        const coinPrice = price * exchangeRate;
        const valueForCoin = coinPrice * hodl;
        totalValue = totalValue + valueForCoin;
      }
      totalBasis = totalBasis + basisForCoin;
    }

    return {
      totalValue: totalValue,
      totalBasis: totalBasis,
    };
  };

  redirectToHttps = () => {
    const userHasCoins = hasCoinz();
    const https = window.location.protocol === 'https:';
    if (getHttpsFlag() === 'true' || (!userHasCoins && !https)) {
      window.location.protocol = 'https:';
    } else if (userHasCoins && !https) {
      console.log('redirect to https with coin string');
      const base64 = serializeLocalStorage();
      setHttpsFlag('true');
      window.location.href = 'https://coinfox.co?import=' + base64;
    }
  };

  componentDidMount() {
    if (!window.location.origin.includes('localhost')) {
      this.redirectToHttps();
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('import')) {
      const importToken = searchParams.get('import');
      const importPortfolio = JSON.parse(atob(importToken));
      const alreadyImported = importToken === getLastImport();

      if (alreadyImported) {
        console.log('already imported this portfolio');
        window.location.search = 'x';
      } else {
        importPortfolioPayload(importPortfolio);
        setLastImport(importToken);
        window.location.search = '';
      }
    }

    if (isUserSignedIn() && window.location.pathname === '/blockstack') {
      const decrypt = true;
      getFile(this.state.gaiaStorage, decrypt)
        .then((gaia) => {
          console.log('gimme gaia', gaia);
          const jsonGaia = JSON.parse(gaia);
          const gaiaCoinz = (jsonGaia.coinz && jsonGaia.coinz) || {};
          const gaiaPref = (jsonGaia.pref && jsonGaia.pref) || {
            currency: 'USD',
          };
          return { coinz: gaiaCoinz, pref: gaiaPref };
        })
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
          const encrypt = true;
          const data = {
            coinz: this.state.coinz,
            pref: { currency: 'USD' },
          };
          putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
            .then(() => {
              window.location.reload();
            })
            .catch((putEx) => {
              console.log(putEx, 'Gaia put exception');
            });
        });
    } else {
      const storage = readPortfolio();
      this.marketData(storage.coinz);
      this.setState({
        coinz: storage.coinz,
        pref: storage.pref,
      });
      this.fetchExchangeRates();
    }
  }

  saveNewPref = (name, value) => {
    if (isUserSignedIn()) {
      const encrypt = true;
      const data = {
        coinz: this.state.coinz,
        pref: { [name]: value },
      };
      this.setState({ pref: data.pref });
      putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt).catch(
        (ex) => {
          console.log(ex, 'Gaia put exception');
        }
      );
    } else {
      const prefs = setPrefKey(name, value);
      this.setState({ pref: prefs });
    }
  };

  deleteCoin = (coin, history) => {
    const strconfirm = window.confirm(
      string.remove + coin.toUpperCase() + string.fromportfolio
    );
    if (strconfirm === true) {
      const current = { ...this.state.coinz };
      delete current[coin];

      if (isUserSignedIn()) {
        const data = {
          coinz: current,
          pref: this.state.pref,
        };
        const encrypt = true;
        putFile(this.state.gaiaStorage, JSON.stringify(data), encrypt)
          .then(() => {
            this.setState({ coinz: current });
          })
          .catch((ex) => {
            console.log(ex, 'Gaia put exception');
          });
      } else {
        writeCoinz(current);
        this.setState({ coinz: current });
      }

      history.goBack();
    }
  };

  render() {
    const exchangeRate = this.state.exchangeRates[this.state.pref.currency]
      ? this.state.exchangeRates[this.state.pref.currency]
      : 1;

    const totalPortfolio = this.totalPortfolio(exchangeRate);
    const currency = (this.state.pref && this.state.pref.currency) || 'USD';
    const language = (this.state.pref && this.state.pref.language) || 'EN';

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Home
                  {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                  supportedCurrencies={this.state.supportedCurrencies}
                  totalPortfolio={totalPortfolio}
                  currency={currency}
                  language={language}
                  addCoinz={this.addCoinz}
                  saveNewPref={this.saveNewPref}
                />
              )}
            />

            <Route
              exact
              path="/blockstack"
              render={(props) => (
                <Blockstack
                  {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                  supportedCurrencies={this.state.supportedCurrencies}
                  currency={currency}
                  language={language}
                  addCoinz={this.addCoinz}
                  saveNewPref={this.saveNewPref}
                />
              )}
            />

            <Route
              path="/coin/:coinId"
              render={(props) => (
                <Coin
                  {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  blockstack={this.state.blockstack}
                  exchangeRate={exchangeRate}
                  deleteCoin={this.deleteCoin}
                  currency={currency}
                  language={language}
                />
              )}
            />

            <Route
              path="/pie"
              render={(props) => (
                <Pie
                  {...props}
                  coinz={this.state.coinz}
                  marketData={this.state.marketData}
                  exchangeRate={exchangeRate}
                  totalPortfolio={totalPortfolio}
                  language={language}
                />
              )}
            />

            <Route
              path="/menu"
              render={(props) => (
                <Menu
                  {...props}
                  addCoinz={this.addCoinz}
                  blockstack={this.state.blockstack}
                  pref={this.state.pref}
                  saveNewPref={this.saveNewPref}
                  supportedCurrencies={this.state.supportedCurrencies}
                  currency={currency}
                  language={language}
                />
              )}
            />

            <Route path="/supportedcoins" component={SupportedCoins} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

// Re-export for any legacy references / tests
export { STORAGE_KEYS };
