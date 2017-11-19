import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddCoin from './AddCoin';
// import './App.css';

class Menu extends Component {
  render() {
    const Menu = <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>;
    return ([
        <Link key='nav' to='/'>X</Link>,
        Menu
    ]);
  }
}

export default Menu;