import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AddCoin from '../Components/AddCoin';
import CurrencyPref from '../CurrencyPref';
import ImportExport from '../ImportExport';
import {translationStrings} from '../i18n';
const string = translationStrings();

class Menu extends Component {
  render() {
    const home = this.props.blockstack ? '/blockstack' : '/';
    const currency = this.props.pref.currency ? this.props.pref.currency : '...';

    return (
      <div className="theMenu">
        <Link className="menu" key='nav' to={home}>
          <i className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i>
        </Link>
        <CurrencyPref
          supportedCurrencies={this.props.supportedCurrencies}
          saveNewPref={this.props.saveNewPref}
          currency={currency}
          key="CurrencyPref" />
        <AddCoin addCoinz={this.props.addCoinz} key='AddCoin'/>

        <ImportExport />

        <div>
          <hr/>
          <p className="center">
            <a href="https://github.com/vinniejames/coinfox">{string.learnmore}</a> or&nbsp;
            <a href="https://github.com/vinniejames/coinfox/issues">{string.givefeedback}</a>
          </p>
        </div>

      </div>
    );
  }
}

export default Menu;
