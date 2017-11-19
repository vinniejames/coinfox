import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
} from 'blockstack';

// const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return 'Anon';
        },
        // avatarUrl() {
        //   return avatarFallbackImage;
        // },
      },
    };
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
  }

  render () {
    const { handleSignOut } = this.props;
    const { person } = this.state;

    return (
      !isSignInPending() ?
        <div className="Profile">
          <span id="logout">
            { person.name() ? person.name() : 'Natoshi Sockamoto' } &nbsp;
            <i onClick={handleSignOut.bind(this)} className="fa fa-sign-out" aria-hidden="true"></i>
          </span>
        </div>
        : null
    )
  }

}

export default Profile;
