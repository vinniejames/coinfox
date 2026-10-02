import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
} from '../Utils/blockstackCompat';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return 'Anon';
        },
      },
    };
  }

  componentDidMount() {
    try {
      this.setState({
        person: new Person(loadUserData().profile),
      });
    } catch (e) {
      // keep Anon fallback
    }
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;

    return !isSignInPending() ? (
      <div className="Profile">
        <span id="logout">
          {person.name() ? person.name() : 'Natoshi Sockamoto'} &nbsp;
          <i
            onClick={handleSignOut}
            className="fa fa-sign-out"
            aria-hidden="true"
          ></i>
        </span>
      </div>
    ) : null;
  }
}

export default Profile;
