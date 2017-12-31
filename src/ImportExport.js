import React, { Component } from 'react';

class ImportExport extends Component {
  constructor(){
    super();
    this.state = {
      importUrl: false
    };
    this._getLink = this._getLink.bind(this);
  }

  _getLink () {
    if (!localStorage.coinz){
      alert("Please add a coin to your portfolio first");
    } else {
      const base64 = btoa(JSON.stringify(localStorage));
      this.setState({importUrl: window.location.origin + "?import=" + base64});
    }
  }

  render() {
    return (
      <div>
        <hr />
        <h3 className="white center">Import / Export Portfolio</h3>
        <p className="white center">Copy the link below to import your current portfolio to another device</p>
        {!this.state.importUrl
          ? <p className="center"><button className="btn" onClick={this._getLink}>Get Link</button></p>
          : <p className="center"><input type="text" defaultValue={this.state.importUrl}></input></p>}

      </div>
    );
  }
}

export default ImportExport;