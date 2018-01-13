import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {translationStrings} from './i18n';
import fetch from "fetch-retry";

class SupportedCoins extends Component {

  constructor(props) {
    super(props);
    this.state = {
      supported: []
    }
  }

  componentWillMount () {

    console.log('hi im here');

    fetch('https://www.cryptonator.com/api/currencies')
      .then(function(res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res)=> {
          // https://stackoverflow.com/a/40969739/1580610
            this.setState({supported: res.rows});
        }
      )

  }

  render() {
    console.log(this.state.supported, 'where coisn');

    return (
      <div className="SupportedCoins">
        <div id="topMenu">
          <Link className="menu" key='nav' to={'/menu'}>
            <i className="btn-menu fa fa-lg fa-times" aria-hidden="true"></i>
          </Link>
        </div>
        <div className="supportedCoins">
          <ul>
          {this.state.supported.map((coin)=>{
            return <li>{coin.name} ({coin.code})</li>;
          })}
          </ul>
        </div>
      </div>
    );
  }
}

export default SupportedCoins;
