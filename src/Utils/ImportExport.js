import React, { Component } from 'react';
import {translationStrings} from './i18n';
const string = translationStrings();

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
      alert(string.addfirstcoin);
    } else {
      const base64 = btoa(JSON.stringify(localStorage));
      this.setState({importUrl: window.location.origin + "?import=" + base64});
    }
  }

  render() {
    return (
      <div>
        <hr />
        <h3 className="white center">{string.importexport}</h3>
        <p className="white center">{string.copylink}</p>
        {!this.state.importUrl
          ? <p className="center"><button className="btn" onClick={this._getLink}>{string.getlink}</button></p>
          : <p className="center"><input type="text" defaultValue={this.state.importUrl}></input></p>}

      </div>
    );
  }
}

export default ImportExport;
