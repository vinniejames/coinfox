import React, { Component } from 'react';
import {$currencySymbol} from '../Utils/Helpers';
import {translationStrings} from '../Utils/i18n';
import styled from 'styled-components';
import { supportedLanguages } from '../Utils/i18n'

const PrefWrapper = styled.div`
  display: flex;
  margin: 10px auto;
  padding: 0px 10px;
  max-width: 1100px;
`;
const Title = styled.h3`
color: white;
`;

const Selector = styled.div`
  display: flex;
  margin: auto 0px;
  margin-left: auto;
`;

const Label = styled.div`
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: #303032;
  line-height: 30px;
  border-radius: 100%;
  padding:2px;
  background-color: white;
  text-align: center;
  margin: auto 0px;
  margin-right: 10px;
  font-weight: 700;
  font-family: Roboto, sans-serif;
`;

class LanguagePref extends Component {

  handleSelectChange = (e) => {
    const domElement = e.target.id;
    const newLanguagePref = e.target.value;
    const currentLanguagePref = this.props.language;

    console.log(newLanguagePref, currentLanguagePref, domElement);
    this.props.saveNewPref("language", newLanguagePref);
  }

  render() {
    const selectLanguage = supportedLanguages.map((lang) => {
      return <option key={lang} value={lang.toUpperCase()}>{lang.toUpperCase()}</option>
    });
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <Title>{string.languagepref}</Title>
        <Selector>
          <Label htmlFor="language">{this.props.language}</Label>
          <select id="language" onChange={this.handleSelectChange} value={this.props.language} name="select">
            {selectLanguage}
          </select>
        </Selector>
      </PrefWrapper>
    );
  }
}

export default LanguagePref;
