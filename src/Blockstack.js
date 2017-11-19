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
} from 'blockstack';

class Blockstack extends React.Component {

  constructor(props){
    super(props);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        const blockUrl = window.location.origin + "?fuckinghell";
        window.location = blockUrl;
      });
    }
  }

  _handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  _handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin + "?fuckinghell");
    // manually clear local storage blockstack key
    // @TODO ask proper way
    localStorage.setItem("blockstack-transit-private-key", false);
  }

  render () {

      return (
        <div className="Blockstack">
          {!isUserSignedIn() ?
            <Signin handleSignIn={this._handleSignIn}/>
            : <Profile handleSignOut={this._handleSignOut}/>}
          <Home {...this.props} />
        </div>)
  }
}

export default Blockstack;

