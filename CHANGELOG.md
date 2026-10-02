# Changelog

## 0.2.0 — Refresh 2026

Dependency and architecture refresh while **preserving localStorage portfolio compatibility**.

### localStorage keys preserved (do not rename)
- `coinz` — holdings map `{ [ticker]: { cost_basis, hodl } }`
- `pref` — `{ currency?, language? }`
- `https` — HTTPS migration flag
- `lastImport` — import deduplication token
- `blockstack-transit-private-key` — legacy Blockstack key

All reads/writes go through `src/storage/` thin wrappers around the same keys and JSON shapes.

### Package upgrades
- React / React DOM → 18.3.1
- react-router-dom → 5.3.4 (from 4.x; `Switch`/`Route` retained)
- styled-components → 5.3.11 (from 3.x)
- highcharts → 11.4.8 (from 9.x; `Highcharts.color` API)
- react-select → 5.10.x (replaces unmaintained `react-virtualized-select`)
- Testing Library / Jest types / TypeScript types updated
- Removed unused Redux (`redux`, `react-redux`, `redux-thunk`) — never wired in `index.tsx`
- Removed `fetch-retry` in favor of `src/Utils/fetchRetry.js`
- Blockstack SDK removed from dependencies (optional stubs in `src/Utils/blockstackCompat.js`); `/blockstack` UI remains, auth/Gaia are no-ops

### Architecture cleanup
- `src/storage/` — portfolio persistence layer
- `src/Components/shared/PrefStyles.js` — shared preference UI styles
- Removed dead `Controller.js` and unused `ChartPortfolioValue.js`
- Prefer `componentDidMount` over deprecated `componentWillMount` where touched
- Coin route: `/coin/:coinId` (was splat `/coin/*`)

### Verify
- `npm test` (non-interactive)
- `npm run build`
