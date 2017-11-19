import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddCoin from './AddCoin';
// import './App.css';

class Menu extends Component {
  render() {
    const home = this.props.blockstack ? '/blockstack' : '/';
    const Menu = <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>;
    return ([
        <Link key='nav' to={home}>X</Link>,
        Menu
    ]);
  }
}

export default Menu;