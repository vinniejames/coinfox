import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddCoin from './AddCoin';
import CurrencyPref from './CurrencyPref';
// import './App.css';

class Menu extends Component {
  render() {
    console.log(this.props, 'where my shit')
    const home = this.props.blockstack ? '/blockstack' : '/';
    const currency = this.props.pref.currency ? this.props.pref.currency : '...';

    return ([
        <Link key='nav' to={home}>X</Link>,
        <CurrencyPref saveNewPref={this.props.saveNewPref} currency={currency} key="CurrencyPref" />,
        <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>,
    ]);
  }
}

export default Menu;