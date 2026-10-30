// ── Portfolio Lab engine ──────────────────────────────────────────────────────
// Pure analytics: calendar alignment, a daily backtest with time-varying target
// weights, performance statistics, return attribution and ex-ante risk.
//
// Weights are fractions of NAV. Whatever is not allocated sits in cash earning
// the risk-free rate; negative cash is financed leverage at the same rate.

export const TD = 252;
const Z95 = 1.6449;

// ── Dates ─────────────────────────────────────────────────────────────────────

// +12h absorbs exchange time zones: an ASX midnight is the prior day in UTC.
export function tsToDateKey(ts) {
  return new Date((ts + 43200) * 1000).toISOString().slice(0, 10);
}

export const keyToUtc = key => Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10));
export const shiftKey = (key, days) => new Date(keyToUtc(key) + days * 864e5).toISOString().slice(0, 10);
export const isValidKey = key => /^\d{4}-\d{2}-\d{2}$/.test(key ?? '') && !Number.isNaN(keyToUtc(key));

export function shiftMonths(key, months) {
  const d = new Date(keyToUtc(key));
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const isWeekday = key => { const d = new Date(keyToUtc(key)).getUTCDay(); return d !== 0 && d !== 6; };

// Index of the last date <= key, or -1.
export function indexAtOrBefore(dates, key) {
  let lo = 0, hi = dates.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (dates[mid] <= key) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

// ── Benchmark spec ────────────────────────────────────────────────────────────

// "SPY" or "ACWI:60, AGG:40" → [{ symbol, weight }] with weights summing to 1.
export function parseBenchmark(spec) {
  const legs = String(spec ?? '').split(',').map(part => {
    const [sym, wt] = part.split(':').map(s => s.trim());
    return sym ? { symbol: sym.toUpperCase(), weight: wt == null ? 1 : parseFloat(wt) } : null;
  }).filter(l => l && l.weight > 0);
  const total = legs.reduce((s, l) => s + l.weight, 0);
  return total > 0 ? legs.map(l => ({ ...l, weight: l.weight / total })) : [];
}

// ── Panel: common calendar, base-currency returns ─────────────────────────────

// Forward-fill a sparse (keys, values) series onto the calendar. NaN before the first point.
function sampleOnto(calendar, keys, values) {
  const out = new Float64Array(calendar.length).fill(NaN);
  let j = 0, last = NaN;
  for (let t = 0; t < calendar.length; t++) {
    while (j < keys.length && keys[j] <= calendar[t]) last = values[j++];
    out[t] = last;
  }
  return out;
}

// histories: Map<symbol, { keys, adj, close, currency }>; fx: Map<ccy, history quoted in base per unit ccy>.
export function buildPanel({ symbols, benchLegs, histories, fx, base, fromKey }) {
  const all = [...new Set([...symbols, ...benchLegs.map(l => l.symbol)])];
  const keySet = new Set();
  all.forEach(s => histories.get(s)?.keys.forEach(k => { if (k >= fromKey && isWeekday(k)) keySet.add(k); }));
  const dates = [...keySet].sort();
  const T = dates.length;
  const warnings = [];

  const fxRates = new Map();
  const rateFor = ccy => {
    if (ccy === base) return null;
    if (!fxRates.has(ccy)) {
      const h = fx.get(ccy);
      if (!h) warnings.push(`No ${ccy}/${base} FX history — ${ccy} assets are shown unconverted.`);
      fxRates.set(ccy, h ? sampleOnto(dates, h.keys, h.adj) : null);
    }
    return fxRates.get(ccy);
  };

  const assets = new Map();
  all.forEach(symbol => {
    const h = histories.get(symbol);
    const local = sampleOnto(dates, h.keys, h.adj);
    const raw   = sampleOnto(dates, h.keys, h.close);
    const rate  = rateFor(h.currency);
    const rLocal = new Float64Array(T), rBase = new Float64Array(T), priceBase = new Float64Array(T);
    let firstIdx = -1;
    for (let t = 0; t < T; t++) {
      const fxT = rate && Number.isFinite(rate[t]) ? rate[t] : 1;
      priceBase[t] = raw[t] * fxT;
      if (firstIdx < 0 && Number.isFinite(local[t])) firstIdx = t;
      if (t === 0 || !Number.isFinite(local[t]) || !Number.isFinite(local[t - 1])) continue;
      rLocal[t] = local[t] / local[t - 1] - 1;
      const fxPrev = rate && Number.isFinite(rate[t - 1]) ? rate[t - 1] : 1;
      rBase[t] = (1 + rLocal[t]) * (fxT / fxPrev) - 1;
    }
    assets.set(symbol, { symbol, currency: h.currency, rLocal, rBase, priceBase, firstIdx: firstIdx < 0 ? T : firstIdx });
  });

  // Blended benchmarks are rebalanced daily to their policy weights.
  const bench = new Float64Array(T);
  benchLegs.forEach(l => { const r = assets.get(l.symbol).rBase; for (let t = 0; t < T; t++) bench[t] += l.weight * r[t]; });

  return { dates, base, assets, bench, warnings };
}

// ── Backtest ──────────────────────────────────────────────────────────────────

const PERIOD_OF = {
  monthly:   k => k.slice(0, 7),
  quarterly: k => `${k.slice(0, 4)}Q${Math.floor((+k.slice(5, 7) - 1) / 3)}`,
  annual:    k => k.slice(0, 4),
};

// Trades to each schedule entry's targets at the close of the first trading day on or
// after its date. Between entries holdings drift, or are reset to the latest target at
// each calendar period end when `rebalance` is set. Index k=0 is the inception close.
export function backtest(panel, { symbols, schedule, rebalance = 'none', costBps = 0, rf = 0 }) {
  const { dates } = panel;
  const T = dates.length, n = symbols.length;
  const R = symbols.map(s => panel.assets.get(s).rBase);
  const events = [...schedule]
    .sort((x, y) => x.date.localeCompare(y.date))
    .map(e => ({ date: e.date, target: Float64Array.from(symbols, s => (+e.weights[s] || 0) / 100) }));

  const t0 = dates.findIndex(d => d >= events[0].date);
  if (t0 < 0 || t0 >= T - 1) throw new Error('The first rebalance date is after the last available price.');

  const L = T - t0;
  const nav = new Float64Array(L), ret = new Float64Array(L), costs = new Float64Array(L);
  const cashW = new Float64Array(L), cashRet = new Float64Array(L);
  const W = symbols.map(() => new Float64Array(L)), TW = symbols.map(() => new Float64Array(L));
  const trades = [];
  const rfd = rf / TD;
  const periodOf = PERIOD_OF[rebalance];

  let w = new Float64Array(n), cash = 1, target = events[0].target, ev = 0;
  while (ev < events.length && events[ev].date <= dates[t0]) target = events[ev++].target;

  const tradeTo = (k, type) => {
    const legs = [];
    let traded = 0;
    for (let i = 0; i < n; i++) {
      const delta = target[i] - w[i];
      if (Math.abs(delta) > 1e-7) legs.push({ symbol: symbols[i], i, from: w[i], to: target[i], delta });
      traded += Math.abs(delta);
    }
    const cost = type === 'initial' ? 0 : traded * costBps / 1e4;
    w = Float64Array.from(target);
    cash = 1 - w.reduce((s, v) => s + v, 0);
    if (legs.length) trades.push({ k, date: dates[t0 + k], type, legs, turnover: type === 'initial' ? 0 : traded / 2, traded, cost, nav: nav[k] });
    return cost;
  };
  const snapshot = k => {
    for (let i = 0; i < n; i++) { W[i][k] = w[i]; TW[i][k] = target[i]; }
    cashW[k] = cash;
  };

  nav[0] = 1;
  tradeTo(0, 'initial');
  snapshot(0);

  for (let k = 1; k < L; k++) {
    const t = t0 + k;
    cashRet[k] = cash * rfd;
    let gross = cashRet[k];
    for (let i = 0; i < n; i++) gross += w[i] * R[i][t];
    const g = 1 + gross;
    for (let i = 0; i < n; i++) w[i] = g !== 0 ? w[i] * (1 + R[i][t]) / g : 0;
    cash = g !== 0 ? cash * (1 + rfd) / g : 0;
    nav[k] = nav[k - 1] * g;

    let type = null;
    while (ev < events.length && events[ev].date <= dates[t]) { target = events[ev++].target; type = 'scheduled'; }
    if (!type && periodOf && k < L - 1 && periodOf(dates[t]) !== periodOf(dates[t + 1])) type = 'calendar';
    const cost = type ? tradeTo(k, type) : 0;

    ret[k] = g * (1 - cost) - 1;
    costs[k] = ret[k] - gross;
    nav[k] = nav[k - 1] * (1 + ret[k]);
    snapshot(k);
  }

  const warnings = [];
  symbols.forEach((s, i) => {
    const first = panel.assets.get(s).firstIdx;
    if (first > t0 && events.some(e => e.target[i] !== 0 && e.date < dates[first]))
      warnings.push(`${s} has no prices before ${dates[first] ?? 'the end of the period'} — it earns 0% until then.`);
  });

  return { symbols, t0, dates: dates.slice(t0), nav, ret, costs, cashW, cashRet, W, TW, trades, warnings };
}

export function benchmarkSlice(panel, t0) {
  const ret = panel.bench.slice(t0);
  ret[0] = 0;
  const nav = new Float64Array(ret.length);
  let v = 1;
  ret.forEach((r, k) => { v *= 1 + r; nav[k] = v; });
  return { ret, nav };
}

// ── Windows ───────────────────────────────────────────────────────────────────

// Returns [a, b]: a is the base close, returns are measured over (a, b].
export function windowBounds(dates, period, from, to) {
  const b = to ? Math.max(0, indexAtOrBefore(dates, to)) : dates.length - 1;
  const end = dates[b];
  const startKey = {
    '1m':  () => shiftMonths(end, -1),
    '3m':  () => shiftMonths(end, -3),
    '6m':  () => shiftMonths(end, -6),
    ytd:   () => `${+end.slice(0, 4) - 1}-12-31`,
    '1y':  () => shiftMonths(end, -12),
    '3y':  () => shiftMonths(end, -36),
    custom: () => from ?? dates[0],
  }[period]?.();
  const a = startKey ? Math.max(0, indexAtOrBefore(dates, startKey)) : 0;
  return [Math.min(a, Math.max(0, b - 1)), b];
}

// ── Performance statistics ────────────────────────────────────────────────────

export function perfStats(ret, bench, rf, a = 0, b = ret.length - 1) {
  const n = b - a;
  if (n < 5) return null;
  const rfd = rf / TD;
  let nav = 1, peak = 1, maxDD = 0, bnav = 1, bpeak = 1, bMaxDD = 0;
  let sp = 0, sb = 0, spp = 0, sbb = 0, spb = 0, sx = 0, sxx = 0, sdown = 0;
  let upP = 0, upB = 0, dnP = 0, dnB = 0;
  const sorted = new Float64Array(n);
  for (let k = a + 1, j = 0; k <= b; k++, j++) {
    const p = ret[k], m = bench[k];
    nav *= 1 + p; peak = Math.max(peak, nav); maxDD = Math.max(maxDD, 1 - nav / peak);
    bnav *= 1 + m; bpeak = Math.max(bpeak, bnav); bMaxDD = Math.max(bMaxDD, 1 - bnav / bpeak);
    sp += p; sb += m; spp += p * p; sbb += m * m; spb += p * m;
    sx += p - m; sxx += (p - m) ** 2;
    if (p < rfd) sdown += (p - rfd) ** 2;
    if (m > 0) { upP += p; upB += m; } else if (m < 0) { dnP += p; dnB += m; }
    sorted[j] = p;
  }
  const mp = sp / n, mb = sb / n, mx = sx / n;
  const varP = Math.max(0, (spp - n * mp * mp) / (n - 1));
  const varB = Math.max(0, (sbb - n * mb * mb) / (n - 1));
  const covPB = (spb - n * mp * mb) / (n - 1);
  const years = n / TD;
  const vol = Math.sqrt(varP * TD), bvol = Math.sqrt(varB * TD);
  const cagr = nav ** (1 / years) - 1, bcagr = bnav ** (1 / years) - 1;
  const annExcess = (mp - rfd) * TD;
  const downDev = Math.sqrt(sdown / n * TD);
  const beta = varB > 0 ? covPB / varB : null;
  const te = Math.sqrt(Math.max(0, (sxx - n * mx * mx) / (n - 1)) * TD);

  let m3 = 0, m4 = 0;
  for (let k = a + 1; k <= b; k++) { const d = ret[k] - mp; m3 += d ** 3; m4 += d ** 4; }
  const sd = Math.sqrt(varP);
  sorted.sort();
  const q = Math.max(0, Math.floor(0.05 * n) - 1);
  let tail = 0;
  for (let j = 0; j <= q; j++) tail += sorted[j];

  return {
    n, years, total: nav - 1, cagr, vol, maxDD,
    sharpe:  vol > 0 ? annExcess / vol : null,
    sortino: downDev > 0 ? annExcess / downDev : null,
    calmar:  maxDD > 0 ? cagr / maxDD : null,
    beta,
    alpha:   beta != null ? (mp - rfd - beta * (mb - rfd)) * TD : null,
    corr:    varP > 0 && varB > 0 ? covPB / Math.sqrt(varP * varB) : null,
    te, ir: te > 0 ? mx * TD / te : null,
    activeCagr: cagr - bcagr,
    upCap:   upB !== 0 ? upP / upB : null,
    downCap: dnB !== 0 ? dnP / dnB : null,
    var95: -sorted[q], cvar95: -tail / (q + 1),
    skew: sd > 0 ? m3 / n / sd ** 3 : null,
    kurt: sd > 0 ? m4 / n / sd ** 4 - 3 : null,
    best: sorted[n - 1], worst: sorted[0],
    btotal: bnav - 1, bcagr, bvol, bMaxDD,
  };
}

export function rolling(ret, bench, rf, win = 63) {
  const L = ret.length, rfd = rf / TD;
  const mk = () => new Float64Array(L).fill(NaN);
  const out = { vol: mk(), bvol: mk(), beta: mk(), sharpe: mk(), bsharpe: mk(), te: mk() };
  for (let k = win; k < L; k++) {
    let sp = 0, sb = 0, spp = 0, sbb = 0, spb = 0, sx = 0, sxx = 0;
    for (let j = k - win + 1; j <= k; j++) {
      const p = ret[j], m = bench[j];
      sp += p; sb += m; spp += p * p; sbb += m * m; spb += p * m; sx += p - m; sxx += (p - m) ** 2;
    }
    const mp = sp / win, mb = sb / win, mx = sx / win;
    const vp = Math.max(0, (spp - win * mp * mp) / (win - 1)), vb = Math.max(0, (sbb - win * mb * mb) / (win - 1));
    out.vol[k] = Math.sqrt(vp * TD);
    out.bvol[k] = Math.sqrt(vb * TD);
    out.beta[k] = vb > 0 ? (spb - win * mp * mb) / (win - 1) / vb : NaN;
    out.sharpe[k] = vp > 0 ? (mp - rfd) * TD / out.vol[k] : NaN;
    out.bsharpe[k] = vb > 0 ? (mb - rfd) * TD / out.bvol[k] : NaN;
    out.te[k] = Math.sqrt(Math.max(0, (sxx - win * mx * mx) / (win - 1)) * TD);
  }
  return out;
}

export function drawdownSeries(nav) {
  const dd = new Float64Array(nav.length);
  let peak = -Infinity;
  nav.forEach((v, k) => { peak = Math.max(peak, v); dd[k] = v / peak - 1; });
  return dd;
}

// Peak-to-trough episodes, deepest first.
export function drawdownEpisodes(nav, top = 6) {
  const eps = [];
  let peakK = 0, troughK = 0, inDD = false;
  for (let k = 1; k < nav.length; k++) {
    if (nav[k] >= nav[peakK]) {
      if (inDD) eps.push({ start: peakK, trough: troughK, end: k });
      inDD = false; peakK = k;
    } else {
      if (!inDD) { inDD = true; troughK = k; }
      if (nav[k] < nav[troughK]) troughK = k;
    }
  }
  if (inDD) eps.push({ start: peakK, trough: troughK, end: null });
  return eps
    .map(e => ({ ...e, depth: nav[e.trough] / nav[e.start] - 1 }))
    .sort((x, y) => x.depth - y.depth)
    .slice(0, top);
}

// Calendar-month returns, newest year first.
export function monthlyReturns(dates, nav, bnav) {
  const years = new Map();
  let baseK = 0, cur = dates[0].slice(0, 7);
  const close = k => {
    if (k <= baseK) return;
    const y = +cur.slice(0, 4), m = +cur.slice(5, 7) - 1;
    if (!years.has(y)) years.set(y, { year: y, p: Array(12).fill(null), b: Array(12).fill(null) });
    const row = years.get(y);
    row.p[m] = nav[k] / nav[baseK] - 1;
    row.b[m] = bnav[k] / bnav[baseK] - 1;
    baseK = k;
  };
  for (let k = 1; k < dates.length; k++) {
    const mk = dates[k].slice(0, 7);
    if (mk !== cur) { close(k - 1); cur = mk; }
  }
  close(dates.length - 1);
  const chain = arr => arr.some(v => v != null) ? arr.reduce((acc, v) => acc * (1 + (v ?? 0)), 1) - 1 : null;
  return [...years.values()]
    .map(r => ({ ...r, py: chain(r.p), by: chain(r.b) }))
    .sort((x, y) => y.year - x.year);
}

// ── Attribution ───────────────────────────────────────────────────────────────

// NAV-linked contribution: each day's w(t-1)·r(t) is scaled by NAV(t-1)/NAV(a), so
// contributions are P&L per unit of starting capital and sum exactly to the window return.
// Base-currency returns split into the local-market move and the currency effect.
export function attribution(panel, bt, a, b) {
  const n = bt.symbols.length;
  const R  = bt.symbols.map(s => panel.assets.get(s).rBase);
  const RL = bt.symbols.map(s => panel.assets.get(s).rLocal);
  const span = b - a;
  const contrib = new Float64Array(n), local = new Float64Array(n), avgW = new Float64Array(n), growth = new Float64Array(n).fill(1);
  const paths = bt.symbols.map(() => new Float64Array(span + 1));
  const cashPath = new Float64Array(span + 1), costPath = new Float64Array(span + 1);
  let cash = 0, cost = 0;
  const base = bt.nav[a];
  for (let k = a + 1, j = 1; k <= b; k++, j++) {
    const s = bt.nav[k - 1] / base, t = bt.t0 + k;
    for (let i = 0; i < n; i++) {
      const w = bt.W[i][k - 1];
      contrib[i] += w * R[i][t] * s;
      local[i]   += w * RL[i][t] * s;
      avgW[i]    += w;
      growth[i]  *= 1 + R[i][t];
      paths[i][j] = contrib[i];
    }
    cash += bt.cashRet[k] * s;
    cost += bt.costs[k] * s;
    cashPath[j] = cash; costPath[j] = cost;
  }
  const total = bt.nav[b] / base - 1;
  const rows = bt.symbols.map((symbol, i) => ({
    symbol, i,
    avgW: span ? avgW[i] / span : 0,
    endW: bt.W[i][b],
    ret: growth[i] - 1,
    contrib: contrib[i], local: local[i], fx: contrib[i] - local[i],
  }));
  return { rows, cash, cost, total, paths, cashPath, costPath, a, b };
}

// Two exact decompositions of the window return:
//   Market vs specific: rf + β·(benchmark − rf) + residual (CAPM fitted over the window).
//   Policy vs trading:  inception weights held untouched + value of later trades − costs.
export function decompose(bt, policy, bench, rf, a, b) {
  const rfd = rf / TD, n = b - a;
  let sp = 0, sm = 0, spm = 0, smm = 0;
  for (let k = a + 1; k <= b; k++) {
    const p = bt.ret[k] - rfd, m = bench.ret[k] - rfd;
    sp += p; sm += m; spm += p * m; smm += m * m;
  }
  const varM = smm / n - (sm / n) ** 2;
  const beta = varM > 0 ? (spm / n - sp / n * sm / n) / varM : 0;
  let rfPart = 0, mktPart = 0, specPart = 0, costPart = 0;
  const base = bt.nav[a];
  for (let k = a + 1; k <= b; k++) {
    const s = bt.nav[k - 1] / base;
    const m = beta * (bench.ret[k] - rfd);
    rfPart   += rfd * s;
    mktPart  += m * s;
    specPart += (bt.ret[k] - rfd - m) * s;
    costPart += bt.costs[k] * s;
  }
  const total = bt.nav[b] / base - 1;
  const policyTotal = policy.nav[b] / policy.nav[a] - 1;
  const benchTotal = bench.nav[b] / bench.nav[a] - 1;
  return {
    total, benchTotal, active: total - benchTotal, beta,
    rfPart, mktPart, specPart,
    policyTotal, costPart, tradingPart: total - policyTotal - costPart,
  };
}

// ── Risk ──────────────────────────────────────────────────────────────────────

// Exponentially weighted covariance (annualised, zero-mean, RiskMetrics style).
export function ewmaCov(rows, hl) {
  const n = rows.length, T = rows[0]?.length ?? 0;
  if (T < 10) return null;
  const lambda = Math.exp(-Math.LN2 / hl);
  const cov = Array.from({ length: n }, () => new Float64Array(n));
  let totalW = 0, w = 1;
  for (let t = T - 1; t >= 0; t--) {
    for (let i = 0; i < n; i++) {
      const ri = rows[i][t] * w;
      if (ri === 0) continue;
      for (let j = i; j < n; j++) cov[i][j] += ri * rows[j][t];
    }
    totalW += w;
    w *= lambda;
  }
  for (let i = 0; i < n; i++)
    for (let j = i; j < n; j++) cov[j][i] = cov[i][j] = cov[i][j] / totalW * TD;
  return cov;
}

export function exAnteRisk(panel, symbols, weights, hl, lookback = 756) {
  const T = panel.dates.length, start = Math.max(1, T - lookback);
  const rows = [...symbols.map(s => panel.assets.get(s).rBase), panel.bench].map(r => r.subarray(start));
  const cov = ewmaCov(rows, hl);
  if (!cov) return null;
  const n = symbols.length;
  const Sw = Array.from({ length: n + 1 }, (_, i) => weights.reduce((s, w, j) => s + cov[i][j] * w, 0));
  const portVar = weights.reduce((s, w, i) => s + w * Sw[i], 0);
  const vol = Math.sqrt(Math.max(0, portVar));
  const vols = Array.from({ length: n + 1 }, (_, i) => Math.sqrt(Math.max(0, cov[i][i])));
  const benchVar = cov[n][n];
  const teVar = portVar - 2 * Sw[n] + benchVar;
  const gross = weights.reduce((s, w) => s + Math.abs(w), 0);
  const sumSq = weights.reduce((s, w) => s + w * w, 0);
  const assets = symbols.map((symbol, i) => {
    const mctr = vol > 0 ? Sw[i] / vol : 0;
    return {
      symbol, i, weight: weights[i], vol: vols[i], mctr,
      rc: weights[i] * mctr,
      pctRc: vol > 0 ? weights[i] * mctr / vol : 0,
      betaPort: portVar > 0 ? Sw[i] / portVar : null,
      corrBench: vols[i] > 0 && vols[n] > 0 ? cov[i][n] / (vols[i] * vols[n]) : null,
    };
  });
  const corr = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (vols[i] > 0 && vols[j] > 0 ? cov[i][j] / (vols[i] * vols[j]) : i === j ? 1 : 0)));
  return {
    vol, assets, corr,
    te: Math.sqrt(Math.max(0, teVar)),
    beta: benchVar > 0 ? Sw[n] / benchVar : null,
    benchVol: vols[n],
    divRatio: vol > 0 ? weights.reduce((s, w, i) => s + Math.abs(w) * vols[i], 0) / vol : null,
    effN: sumSq > 0 ? gross * gross / sumSq : null,
    var95: Z95 * vol / Math.sqrt(TD),
    var95_10d: Z95 * vol * Math.sqrt(10 / TD),
  };
}

export const SCENARIOS = [
  { name: 'COVID crash',            from: '2020-02-19', to: '2020-03-23' },
  { name: 'COVID rebound',          from: '2020-03-23', to: '2020-06-08' },
  { name: '2022 inflation & rates', from: '2022-01-03', to: '2022-10-12' },
  { name: 'UK gilt / LDI crisis',   from: '2022-09-21', to: '2022-09-28' },
  { name: 'SVB banking stress',     from: '2023-03-08', to: '2023-03-17' },
  { name: 'Late-2023 rates rally',  from: '2023-10-27', to: '2023-12-29' },
  { name: 'Yen carry unwind',       from: '2024-07-16', to: '2024-08-05' },
  { name: 'Tariff shock',           from: '2025-04-02', to: '2025-04-08' },
];

// Replays historical windows with today's weights held static.
export function stressTests(panel, symbols, weights) {
  const { dates } = panel;
  return SCENARIOS.map(sc => {
    const a = indexAtOrBefore(dates, sc.from), b = indexAtOrBefore(dates, sc.to);
    if (a < 0 || b <= a || dates[dates.length - 1] < sc.to) return { ...sc, available: false };
    const grow = r => { let g = 1; for (let t = a + 1; t <= b; t++) g *= 1 + r[t]; return g - 1; };
    const missing = [];
    let port = 0;
    symbols.forEach((s, i) => {
      const asset = panel.assets.get(s);
      if (asset.firstIdx > a) { if (weights[i]) missing.push(s); return; }
      port += weights[i] * grow(asset.rBase);
    });
    const bench = grow(panel.bench);
    return { ...sc, available: true, port, bench, active: port - bench, missing };
  });
}
