import * as React from 'react';
import Signin from './Signin';
import Profile from './Profile';
import Home from "../Pages/Home";
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
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

  render () {
      return (
        <div className="Blockstack">
          {!isUserSignedIn() ?
            <Signin handleSignIn={this._handleSignIn}/>
            : [
              <Profile key="Profile" handleSignOut={this._handleSignOut}/>,
              <Home
                supportedCurrencies={this.props.supportedCurrencies}
                exchangeRate={this.props.exchangeRate}
                key="Home" {...this.props} />
            ]
          }
        </div>)
  }
}

export default Blockstack;

