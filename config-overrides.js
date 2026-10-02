const { override } = require('customize-cra');

// CRA 5 + react-app-rewired retained.
// Blockstack/node polyfills removed — Blockstack is optional/stubbed.
module.exports = override();
