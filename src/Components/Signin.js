import React, { Component } from 'react';

class Signin extends Component {
  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="block-login">
        <h1>Coinfox</h1>
        <p>
          A decentralized portfolio tracker. Blockstack cloud sync is no longer
          available in this build; use localStorage and Import/Export instead.
        </p>
        <p>
          <button className="btn" id="login" onClick={handleSignIn}>
            <i className="fa fa-lg fa-user-circle" aria-hidden="true"></i> Sign
            In With Blockstack
          </button>
        </p>
      </div>
    );
  }
}

export default Signin;
