import * as React from 'react';
// import './Blockstack.css';
import Signin from './Signin';
import Profile from './Profile';
import Home from "./Home";
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
  // getFile, // delete after testing
  // putFile, // delete
} from 'blockstack';

class Blockstack extends React.Component {

  constructor(props){
    super(props);
    this._handleSignIn = this._handleSignIn.bind(this);
    this._handleSignOut = this._handleSignOut.bind(this);
    this.state = {
      blockurl: window.location.origin + "/blockstack",
      manifest: window.location.origin + "/manifest.json",
    }
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = this.state.blockurl;
      });
    }
  }

  _handleSignIn(e) {
    e.preventDefault();
    //https://blockstack.github.io/blockstack.js/index.html#redirecttosignin
    redirectToSignIn(this.state.blockurl, this.state.manifest);
  }

  _handleSignOut(e) {
    e.preventDefault();
    signUserOut(this.state.blockurl);
    // manually clear local storage blockstack key
    // @TODO ask proper way
    localStorage.setItem("blockstack-transit-private-key", false);
  }

  // _fetchFromGaia () {
  //   const decrypt = true;
  //   const STORAGE_FILE = 'coinfox.json';
  //   getFile(STORAGE_FILE, decrypt)
  //     .then((gaia) => {
  //       const jsonGaia = JSON.parse(gaia);
  //       const gaiaCoinz = jsonGaia.coinz && jsonGaia.coinz || {};
  //       const gaiaPref = jsonGaia.pref && jsonGaia.pref || {};
  //
  //       console.log(jsonGaia, gaiaCoinz, gaiaPref, 'gaia vars');
  //     })
  //     .catch((ex) => {
  //       console.log(ex, 'fetch from Gaia exception')
  //     })
  // }
  //
  // _saveToGaia () {
  //   console.log('!Gaia!');
  //   const STORAGE_FILE = 'coinfox.json';
  //   const encrypt = true;
  //
  //   const data = {
  //     coinz: {btc:{cost_basis:200,hodl:2}},
  //     pref: {currency: "USD"}
  //   };
  //   console.log("writing to gaia", data);
  //   putFile(STORAGE_FILE, JSON.stringify(data), encrypt)
  //     .then(() => {
  //       console.log(data, 'done');
  //     })
  //     .catch((ex) => {
  //       console.log(ex, 'Gaia put exception');
  //     })
  // }

  render () {
      return (
        <div className="Blockstack">
          {/*<button onClick={this._saveToGaia}>Add to store</button>*/}
          {/*<button onClick={this._fetchFromGaia}>Get from store</button>*/}
          {!isUserSignedIn() ?
            <Signin handleSignIn={this._handleSignIn}/>
            : [
              <Profile key="Profile" handleSignOut={this._handleSignOut}/>,
              <Home key="Home" {...this.props} />
            ]
          }
        </div>)
  }
}

export default Blockstack;

