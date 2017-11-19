import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

// import './Signin.css';

class Signin extends Component {
  constructor (props) {
    super(props);
    this._handleSignIn = props.handleSignIn.bind(this);
  }

  render () {
    return (
      <div className={"block-login"}>
        <h2>Coinfox on Blockstack</h2>
        <p>A decentralized portfolio tracker built on <a target="_blank" href="https://blockstack.org/">Blockstack</a></p>
        <p>
          <button id="login" onClick={this._handleSignIn}>
            <i className="fa fa-lg fa-user-circle" aria-hidden="true"></i> Sign In With Blockstack</button>
        </p>
      </div>
    )
  }
}

export default Signin;