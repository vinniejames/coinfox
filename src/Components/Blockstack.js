import * as React from 'react';
import Signin from './Signin';
import Profile from './Profile';
import Home from '../Pages/Home';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from '../Utils/blockstackCompat';
import { STORAGE_KEYS } from '../storage';

class Blockstack extends React.Component {
  constructor(props) {
    super(props);
    this._handleSignIn = this._handleSignIn.bind(this);
    this._handleSignOut = this._handleSignOut.bind(this);
    this.state = {
      blockurl: window.location.origin + '/blockstack',
      manifest: window.location.origin + '/manifest.json',
    };
  }

  componentDidMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(() => {
        window.location = this.state.blockurl;
      });
    }
  }

  _handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn(this.state.blockurl, this.state.manifest);
  }

  _handleSignOut(e) {
    e.preventDefault();
    signUserOut(this.state.blockurl);
    localStorage.setItem(STORAGE_KEYS.BLOCKSTACK_TRANSIT_PRIVATE_KEY, false);
  }

  render() {
    return (
      <div className="Blockstack">
        {!isUserSignedIn() ? (
          <Signin handleSignIn={this._handleSignIn} />
        ) : (
          [
            <Profile key="Profile" handleSignOut={this._handleSignOut} />,
            <Home
              supportedCurrencies={this.props.supportedCurrencies}
              exchangeRate={this.props.exchangeRate}
              key="Home"
              {...this.props}
            />,
          ]
        )}
      </div>
    );
  }
}

export default Blockstack;
