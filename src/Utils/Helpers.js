export function $currencySymbol(ticker){
  const symbol = {
    "aud": "$",
    "bgn": "лв",
    "brl": "R$",
    "btc": "฿",
    "cad": "$",
    "chf": "Fr.",
    "cny": "¥",
    "czk": "Kč",
    "dkk": "kr",
    "eur": "€",
    "gbp": "£",
    "hkd": "$",
    "hrk": "kn",
    "huf": "Ft",
    "idr": "Rp",
    "ils": "₪",
    "inr": "₹",
    "jpy": "¥",
    "krw": "₩",
    "mxn": "$",
    "myr": "RM",
    "nok": "kr",
    "nzd": "$",
    "php": "₱",
    "pln": "zł",
    "ron": "lei",
    "rur": "₽",
    "sek": "kr",
    "sgd": "$",
    "thb": "฿",
    "try": "₺",
    "uah": "₴",
    "usd": "$",
    "zar": "R"
  };
  return symbol[ticker.toLowerCase()] + " ";
}


export function $numberWithCommas(d) {
  return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const returnMultiple = (currentValue, costBasis) => {
  if (!costBasis) return 0;
  return currentValue / costBasis;
}
