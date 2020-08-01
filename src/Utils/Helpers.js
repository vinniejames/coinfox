// export function $percentRoi(current_holding_value, total_cost_basis){
//   return ( (current_holding_value - total_cost_basis) / total_cost_basis ) * 100;
// }
//
// export function $cashRoi(current_price, cost_basis, hodl){
//   return (current_price - cost_basis) * hodl;
// }
//
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
  return currentValue / costBasis;
}

// export function $dontShowNaN(value) {
//
//   return isNaN(value) ? 0 : value;
//
// }
