import React, { Component } from 'react';
import Menu from '../Pages/Menu'; // maybe dont need

class Controller extends Component {

  state = {
    userData: "userData",
  };

  _getUserData () {
     console.log('_controller got user data');
  }


  render() {
    return (
      <div className="app-controller">
        <Menu />
        {this.props.children}
      </div>
    );
  }
}

export default Controller;
