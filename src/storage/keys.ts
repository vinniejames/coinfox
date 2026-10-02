/**
 * localStorage key names used by Coinfox.
 * CRITICAL: Do not rename these — existing user portfolios depend on them.
 */
export const STORAGE_KEYS = {
  /** Portfolio holdings: { [ticker: string]: { cost_basis: number, hodl: number } } */
  COINZ: 'coinz',
  /** User preferences: { currency?: string, language?: string } */
  PREF: 'pref',
  /** Set to "true" after HTTPS migration redirect */
  HTTPS: 'https',
  /** Dedup token for ?import= portfolio transfers */
  LAST_IMPORT: 'lastImport',
  /** Blockstack auth transit key (legacy) */
  BLOCKSTACK_TRANSIT_PRIVATE_KEY: 'blockstack-transit-private-key',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
