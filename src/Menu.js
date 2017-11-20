import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddCoin from './AddCoin';
import CurrencyPref from './CurrencyPref';

class Menu extends Component {
  render() {
    const home = this.props.blockstack ? '/blockstack' : '/';
    const currency = this.props.pref.currency ? this.props.pref.currency : '...';

    return ([
        <Link key='nav' to={home}>
          <i className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i>
        </Link>,
        <CurrencyPref
          supportedCurrencies={this.props.supportedCurrencies}
          saveNewPref={this.props.saveNewPref}
          currency={currency}
          key="CurrencyPref" />,
        <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>,
    ]);
  }
}

export default Menu;