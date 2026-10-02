import { STORAGE_KEYS } from './keys';

export type CoinHolding = {
  cost_basis: number;
  hodl: number;
};

export type CoinzMap = Record<string, CoinHolding>;

export type Prefs = {
  currency?: string;
  language?: string;
  [key: string]: string | undefined;
};

export type PortfolioStorage = {
  coinz: CoinzMap;
  pref: Prefs;
};

const DEFAULT_PREF: Prefs = { currency: 'USD' };

function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw == null || raw === '') return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Read portfolio + prefs. Same keys/shapes as legacy App.readLocalStorage(). */
export function readPortfolio(): PortfolioStorage {
  const coinz = safeParse<CoinzMap>(localStorage.getItem(STORAGE_KEYS.COINZ), {});
  const pref = safeParse<Prefs>(localStorage.getItem(STORAGE_KEYS.PREF), { ...DEFAULT_PREF });
  return { coinz, pref };
}

export function writeCoinz(coinz: CoinzMap): void {
  localStorage.setItem(STORAGE_KEYS.COINZ, JSON.stringify(coinz));
}

export function writePref(pref: Prefs): void {
  localStorage.setItem(STORAGE_KEYS.PREF, JSON.stringify(pref));
}

export function getPref(): Prefs {
  return safeParse<Prefs>(localStorage.getItem(STORAGE_KEYS.PREF), { ...DEFAULT_PREF });
}

export function setPrefKey(name: string, value: string): Prefs {
  const prefs = getPref();
  prefs[name] = value;
  writePref(prefs);
  return prefs;
}

export function hasCoinz(): boolean {
  return Boolean(localStorage.getItem(STORAGE_KEYS.COINZ));
}

export function getHttpsFlag(): string | null {
  return localStorage.getItem(STORAGE_KEYS.HTTPS);
}

export function setHttpsFlag(value: string = 'true'): void {
  localStorage.setItem(STORAGE_KEYS.HTTPS, value);
}

export function getLastImport(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_IMPORT);
}

export function setLastImport(value: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_IMPORT, value);
}

/**
 * Import portfolio from a decoded ?import= payload.
 * Values for coinz/pref are stored as already-stringified JSON (legacy shape).
 */
export function importPortfolioPayload(payload: {
  coinz?: string;
  pref?: string;
  [key: string]: string | undefined;
}): void {
  if (payload.pref) {
    localStorage.setItem(STORAGE_KEYS.PREF, payload.pref);
  }
  if (payload.coinz) {
    localStorage.setItem(STORAGE_KEYS.COINZ, payload.coinz);
  }
}

/**
 * Serialize entire localStorage for export/HTTPS migrate (legacy behavior).
 */
export function serializeLocalStorage(): string {
  return btoa(JSON.stringify(localStorage));
}

/**
 * Restore keys from an exported localStorage JSON object (ImportExport legacy).
 */
export function restoreLocalStorageDump(data: Record<string, string>): void {
  Object.keys(data).forEach((key) => {
    localStorage.setItem(key, data[key]);
  });
}

export function mergeCoinHolding(
  existing: CoinHolding,
  incoming: CoinHolding
): CoinHolding {
  const newHodl = incoming.hodl + existing.hodl;
  const newTotalValue =
    incoming.cost_basis * incoming.hodl + existing.cost_basis * existing.hodl;
  return {
    cost_basis: newTotalValue / newHodl,
    hodl: newHodl,
  };
}

export { STORAGE_KEYS };
