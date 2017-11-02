import * as React from 'react';
import './Blockstack.css';
import Signin from './Signin';
import Profile from './Profile';
import App from "./App";
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

class Blockstack extends React.Component {

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin + "?blockstack";
      });
    }
  }

  _handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  _handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin + "?blockstack");
  }

  render () {

    const blockstack = window.location.search.search("blockstack") > -1;
    if (blockstack) {
      return (
        <div className="Blockstack">
          {!isUserSignedIn() ?
            <Signin handleSignIn={this._handleSignIn}/>
            : <Profile handleSignOut={this._handleSignOut}/>}
          <App blockstack={true}/>
        </div>)
    } else {
      return <App blockstack={false}/>;
    }
  }
}

export default Blockstack;