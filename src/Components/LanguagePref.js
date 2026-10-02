import React, { Component } from 'react';
import {
  translationStrings,
  supportedLanguages,
  languageName,
} from '../Utils/i18n';
import { PrefWrapper, PrefTitle, PrefSelector } from './shared/PrefStyles';

class LanguagePref extends Component {
  handleSelectChange = (e) => {
    const newLanguagePref = e.target.value;
    this.props.saveNewPref('language', newLanguagePref);
  };

  render() {
    const selectLanguage = supportedLanguages.map((lang) => (
      <option key={lang} value={lang.toUpperCase()}>
        {languageName[lang]}
      </option>
    ));
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <PrefTitle>{string.languagepref}</PrefTitle>
        <PrefSelector>
          <select
            id="language"
            onChange={this.handleSelectChange}
            value={this.props.language || ''}
            name="select"
          >
            {selectLanguage}
          </select>
        </PrefSelector>
      </PrefWrapper>
    );
  }
}

export default LanguagePref;
