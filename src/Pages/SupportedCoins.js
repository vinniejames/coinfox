import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {translationStrings} from '../Utils/i18n';
import fetch from "fetch-retry";
import styled from 'styled-components';

const SupportedCoinsList = styled.ul`
  background: #303032;
  margin-top: 0px;
  list-style: none;
  padding: 65px 20px 0px 20px;
`;
const SupportedCoinItem = styled.li`
  border-bottom: 1px solid hsla(0,0%,100%,.1);
  color: white;
  padding: 10px 0;
`;

class SupportedCoins extends Component {

  constructor(props) {
    super(props);
    this.state = {
      supported: []
    }
  }

  componentWillMount () {

    // TODO fetch currencies from CoinGecko

    // fetch('https://www.cryptonator.com/api/currencies')
    //   .then(function(res) {
    //     if (!res.ok) {
    //       throw Error(res.statusText);
    //     }
    //     return res;
    //   })
    //   .then((res) => res.json())
    //   .then((res)=> {
    //       // https://stackoverflow.com/a/40969739/1580610
    //         this.setState({supported: res.rows});
    //     }
    //   )

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
        <div>
          <SupportedCoinsList>
          {this.state.supported.map((coin)=>(
            <SupportedCoinItem>
              {coin.name} ({coin.code})
            </SupportedCoinItem>
          ))}
          </SupportedCoinsList>
        </div>
      </div>
    );
  }
}

export default SupportedCoins;
