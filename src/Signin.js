import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

class Signin extends Component {
  constructor (props) {
    super(props);
    this._handleSignIn = props.handleSignIn.bind(this);
  }

  render () {
    return (
      <i id="login" onClick={this._handleSignIn} className="fa fa-lg fa-user-circle" aria-hidden="true"></i>
    )
  }
}

export default Signin;