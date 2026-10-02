import React, { Component } from 'react';
import { translationStrings } from '../Utils/i18n';
import {
  hasCoinz,
  serializeLocalStorage,
  restoreLocalStorageDump,
} from '../storage';

class ImportExport extends Component {
  constructor() {
    super();
    this.state = {
      importUrl: 'Add coins or paste import link',
      importString: '',
    };
    this._getLink = this._getLink.bind(this);
    this._importString = this._importString.bind(this);
  }

  _getLink() {
    if (hasCoinz()) {
      const base64 = serializeLocalStorage();
      this.setState({
        importUrl: window.location.origin + '?import=' + base64,
      });
    }
  }

  _importString() {
    const base64 = this.state.importString;
    const json = atob(base64.split('import=')[1]);
    const data = JSON.parse(json);
    restoreLocalStorageDump(data);
    window.location.reload();
  }

  componentDidMount() {
    this._getLink();
  }

  render() {
    const string = translationStrings(this.props.language);
    return (
      <div>
        <hr />
        <h3 className="white center">{string.importexport}</h3>
        <p className="white center">{string.copylink}</p>
        <p className="center">
          <input
            type="text"
            onChange={(e) => this.setState({ importString: e.target.value })}
            defaultValue={this.state.importUrl}
          />
        </p>
        {!hasCoinz() ? (
          <button
            style={{ margin: '8px auto' }}
            onClick={this._importString}
          >
            Import
          </button>
        ) : null}
      </div>
    );
  }
}

export default ImportExport;
