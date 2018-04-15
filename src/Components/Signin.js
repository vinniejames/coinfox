import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

// import './Signin.css';

class Signin extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { handleSignIn } = this.props;

    return (
      <div className={"block-login"}>
        <h1>Coinfox</h1>
        <p>A decentralized portfolio tracker built on <a rel="noopener noreferrer" target="_blank" href="https://blockstack.org/">Blockstack</a></p>
        <p>
          <button className="btn" id="login" onClick={handleSignIn.bind(this)}>
            <i className="fa fa-lg fa-user-circle" aria-hidden="true"></i> Sign In With Blockstack</button>
        </p>
      </div>
    )
  }
}

export default Signin;