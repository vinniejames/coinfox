export const supportedLanguages = [
  'en',
  'de',
  'fr',

  // 'nl',
  // 'ru',
  // 'pt-br',
  // 'tr',
  // 'es',
  // 'zh-cn',
  // 'it',
  // 'pl',
  // 'pt-pt'
];
export const languageName = {
  'en': 'English',
  'de': 'Deutsch',
  'fr': 'Français',
}
// default to english language
let browserLang = 'en';

// reset browserLang to user's navigator.language[s]
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
navigator.languages && navigator.languages.some((lang)=>{
  if (supportedLanguages.includes(lang)){
    browserLang = lang;
  }
  return supportedLanguages.includes(lang);
});


const strings = {
  en: {
    // AddCoin
    avgcost: "Average Cost Basis ($/per coin)",
    addcoin: "Add a Coin",
    ticker: "Ticker: (BTC, LTC, etc)",
    numberheld: "Number of Coins Held",
    go: "Go",
    // App
    fillticker: "Please fill in the ticker, cost basis & holding",
    added: " added to your portfolio",
    remove: "Remove ",
    fromportfolio: " from your portfolio?",
    // Coin
    total: "Total ",
    holding: " Holding",
    volume: "24hr Volume",
    costbasis: "Cost Basis (avg)",
    // CoinList
    coins: " Coins",
    // CurrencyPref
    currencypref: "Currency preference",
    // LanguagePref
    languagepref: "Language preference",
    // Home
    welcome: "Welcome to Coinfox",
    tag: "Your secure, personal blockchain portfolio manager app. Track your crypto currency portfolio performance",
    // ImportExport
    addfirstcoin: "Please add a coin to your portfolio first",
    importexport: "Import / Export Portfolio",
    copylink: "Copy the URL below to import your current portfolio to another device",
    getlink: "Get Link",
    // Menu
    learnmore: "Learn More",
    givefeedback: "Give Feedback",
    supportedcoins: "Supported Coins",
  },
  de: {
    // AddCoin
    avgcost: "Durchschnittliche Kostenbasis ($ / pro Münze)",
    addcoin:  "Eine Münze hinzufügen",
    ticker:  "Ticker: (BTC, LTC, usw.)",
    numberheld: "Anzahl der gehaltenen Münzen",
    go: "Gehen",
    // App
    fillticker: "Bitte den Ticker ausfüllen, Kostenbasis & halten",
    added:  " ihrem Portfolio hinzugefügt",
    remove:  "Entfernen ",
    fromportfolio: " aus Ihrem Portfolio?",
    // Coin
    total: "Insgesamt ",
    holding: " Halten",
    volume: "24hr Volumen",
    costbasis:  "Kostenbasis (avg)",
    // CoinList
    coins: " Münzen",
    // CurrencyPref
    currencypref: "Münzen",
    // LanguagePref
    languagepref: "Spracheinstellung",
    // Home
    welcome: "Willkommen bei Coinfox",
    tag: "Ihre sichere, persönliche Blockchain Portfolio Manager App. Verfolgen Sie Ihre Crypto-Währung Portfolio-Performance",
    // ImportExport
    addfirstcoin: "Bitte füge zuerst eine Münze zu deinem Portfolio hinzu",
    importexport: "Import / Export Portfolio",
    copylink: "Kopieren Sie die URL unten, um Ihr aktuelles Portfolio auf ein anderes Gerät zu importieren",
    getlink:  "Link holen",
    // Menu
    learnmore: "Erfahren Sie mehr",
    givefeedback: "Vorschläge machen",
    supportedcoins: "Unterstützte Münzen",
  },
  fr: {
    // AddCoin
    avgcost: "Coût moyen ($ / par pièce)",
    addcoin: "Ajouter une pièce",
    ticker: "Ticker: (BTC, LTC, etc)",
    numberheld: "Nombre de pièces détenues",
    go: "Aller",
    // App
    fillticker: "S'il vous plaît remplir le ticker, la base des coûts et la tenue",
    added: " ajouté à votre portefeuille",
    remove: "Supprimer ",
    fromportfolio: " de votre portefeuille?",
    // Coin
    total: "Total ",
    holding: " Holding",
    volume: "Volume 24hr",
    costbasis: "Base de Coût (moy)",
    // CoinList
    coins: " Pièces",
    // CurrencyPref
    currencypref: "Préférence de devise",
    // LanguagePref
    languagepref: "Préférence de langue",
    // Home
    welcome: "Bienvenue à Coinfox",
    tag: "Votre application de gestion de portefeuilles blockchain personnelle et sécurisée. Suivez votre performance de portefeuille de devises crypto",
    // ImportExport
    addfirstcoin: "Veuillez d'abord ajouter une pièce à votre portefeuille",
    importexport: "Import / Export Portfolio",
    copylink: "Copiez l'URL ci-dessous pour importer votre portefeuille actuel vers un autre appareil",
    getlink: "Obtenir un lien",
    // Menu
    learnmore: "En savoir plus",
    givefeedback: "Donner des suggestions",
    supportedcoins: "Pièces prises en charge",
  },

}


export function translationStrings(lang) {
  if(lang){
    return strings[lang.toLowerCase()];
  }
  return strings[browserLang];
}
