// ── Portfolio Lab persistence ─────────────────────────────────────────────────
// A workspace holds every saved portfolio. It is read and written through an async
// adapter so a signed-in remote backend can replace localStorage without touching
// the UI: implement { kind, label, load(), save(workspace) } and swap it in.

import { shiftMonths, todayKey, isValidKey } from './engine.js';

const KEY        = 'portlab:v2';
const LEGACY_KEY = 'portv1';

export const DEFAULT_SETTINGS = { benchmark: 'SPY', base: 'USD', rebalance: 'none', costBps: 10, rf: 4, aum: 1000000 };

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function newPortfolio(name = 'Untitled portfolio', parts = {}) {
  const now = Date.now();
  return {
    id: uid(), name, createdAt: now, updatedAt: now,
    assets: [],
    schedule: [{ id: uid(), date: shiftMonths(todayKey(), -12), weights: {} }],
    ...parts,
    settings: { ...DEFAULT_SETTINGS, ...(parts.settings ?? {}) },
  };
}

export function samplePortfolio() {
  const a = (symbol, display, name, currency) => ({ symbol, display, name, currency });
  const col = (date, weights) => ({ id: uid(), date, weights });
  return newPortfolio('Global multi-asset (sample)', {
    assets: [
      a('SPY', 'SPY', 'SPDR S&P 500 ETF Trust', 'USD'),
      a('QQQ', 'QQQ', 'Invesco QQQ Trust', 'USD'),
      a('EFA', 'EFA', 'iShares MSCI EAFE ETF', 'USD'),
      a('VAS.AX', 'VAS', 'Vanguard Australian Shares Index ETF', 'AUD'),
      a('AGG', 'AGG', 'iShares Core US Aggregate Bond ETF', 'USD'),
      a('GLD', 'GLD', 'SPDR Gold Shares', 'USD'),
    ],
    schedule: [
      col('2021-01-04', { SPY: 35, QQQ: 0,  EFA: 15, 'VAS.AX': 10, AGG: 30, GLD: 10 }),
      col('2022-06-01', { SPY: 30, QQQ: 0,  EFA: 15, 'VAS.AX': 10, AGG: 25, GLD: 15 }),
      col('2023-07-03', { SPY: 35, QQQ: 10, EFA: 10, 'VAS.AX': 10, AGG: 25, GLD: 10 }),
      col('2025-01-02', { SPY: 30, QQQ: 15, EFA: 10, 'VAS.AX': 5,  AGG: 20, GLD: 15 }),
    ],
    settings: { benchmark: 'ACWI:60,AGG:40', rebalance: 'quarterly' },
  });
}

// Holdings saved by the original single-portfolio tab become a one-column schedule.
function migrateLegacy() {
  try {
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? 'null');
    if (!Array.isArray(old) || !old.length) return null;
    const weights = Object.fromEntries(old.map(h => [h.symbol, +h.weight || 0]));
    return newPortfolio('My portfolio', {
      assets: old.map(h => ({ symbol: h.symbol, display: h.displaySymbol ?? h.symbol, name: h.name ?? h.symbol, currency: '' })),
      schedule: [{ id: uid(), date: shiftMonths(todayKey(), -12), weights }],
      settings: { benchmark: '^GSPC' },
    });
  } catch { return null; }
}

// Validates and repairs a portfolio from storage or a user-supplied file.
export function normalisePortfolio(raw, { freshId = false } = {}) {
  if (!raw || typeof raw !== 'object') throw new Error('Not a portfolio file.');
  const assets = (Array.isArray(raw.assets) ? raw.assets : [])
    .filter(a => a && typeof a.symbol === 'string' && a.symbol.trim())
    .map(a => ({
      symbol: a.symbol.trim().toUpperCase(),
      display: String(a.display ?? a.symbol).slice(0, 16),
      name: String(a.name ?? a.symbol).slice(0, 120),
      currency: String(a.currency ?? '').slice(0, 4),
    }));
  const symbols = new Set(assets.map(a => a.symbol));
  const schedule = (Array.isArray(raw.schedule) ? raw.schedule : [])
    .filter(c => c && isValidKey(c.date))
    .map(c => ({
      id: typeof c.id === 'string' ? c.id : uid(),
      date: c.date,
      weights: Object.fromEntries(Object.entries(c.weights ?? {})
        .filter(([s, w]) => symbols.has(s) && Number.isFinite(+w))
        .map(([s, w]) => [s, +w])),
    }))
    .sort((x, y) => x.date.localeCompare(y.date));
  if (!schedule.length) schedule.push({ id: uid(), date: shiftMonths(todayKey(), -12), weights: {} });
  const s = { ...DEFAULT_SETTINGS, ...(raw.settings ?? {}) };
  return {
    id: !freshId && typeof raw.id === 'string' ? raw.id : uid(),
    name: String(raw.name ?? 'Imported portfolio').slice(0, 80),
    createdAt: +raw.createdAt || Date.now(),
    updatedAt: +raw.updatedAt || Date.now(),
    assets, schedule,
    settings: {
      benchmark: String(s.benchmark || DEFAULT_SETTINGS.benchmark).slice(0, 120),
      base: /^[A-Z]{3}$/.test(s.base) ? s.base : DEFAULT_SETTINGS.base,
      rebalance: ['none', 'monthly', 'quarterly', 'annual'].includes(s.rebalance) ? s.rebalance : 'none',
      costBps: Math.max(0, +s.costBps || 0),
      rf: Number.isFinite(+s.rf) ? +s.rf : DEFAULT_SETTINGS.rf,
      aum: Math.max(0, +s.aum || DEFAULT_SETTINGS.aum),
    },
  };
}

export function createLocalStore() {
  return {
    kind: 'local',
    label: 'Local workspace · this browser',
    async load() {
      let ws = null;
      try { ws = JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch {}
      if (ws && Array.isArray(ws.portfolios) && ws.portfolios.length) {
        const portfolios = ws.portfolios.flatMap(p => { try { return [normalisePortfolio(p)]; } catch { return []; } });
        if (portfolios.length) {
          return { version: 2, activeId: portfolios.some(p => p.id === ws.activeId) ? ws.activeId : portfolios[0].id, portfolios };
        }
      }
      const portfolios = [migrateLegacy(), samplePortfolio()].filter(Boolean);
      return { version: 2, activeId: portfolios[0].id, portfolios };
    },
    async save(ws) {
      localStorage.setItem(KEY, JSON.stringify(ws));
    },
  };
}
