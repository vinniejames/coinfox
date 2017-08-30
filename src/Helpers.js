export function $percentRoi(current_holding_value, total_cost_basis){
    return ( (current_holding_value - total_cost_basis) / total_cost_basis ) * 100;
}

export function $cashRoi(current_price, cost_basis, hodl){
  return (current_price - cost_basis) * hodl;
}

export function $currencySymbol(ticker){
  const symbol = {
    aud: "$",
    btc: "฿",
    cad: "$",
    chf: "Fr. ",
    cny: "¥",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    rur: "₽",
    uah: "₴",
    usd: "$"
  }
  return symbol[ticker.toLowerCase()];
}


export function $numberWithCommas(d) {
  return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function $dontShowNaN(value) {

  return isNaN(value) ? 0 : value;

}
