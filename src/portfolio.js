// ── Portfolio Analysis Tab ─────────────────────────────────────────────────────

import { buildYfUrl } from './api.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portv1';
const BENCHMARK   = { symbol: '^GSPC', name: 'S&P 500' };

const MARKETS = [
  { label: 'US',    suffix: '' },
  { label: 'ASX',   suffix: '.AX' },
  { label: 'LSE',   suffix: '.L' },
  { label: 'TSX',   suffix: '.TO' },
  { label: 'XETRA', suffix: '.DE' },
  { label: 'TSE',   suffix: '.T' },
  { label: 'HKEX',  suffix: '.HK' },
];

// ── Module state ───────────────────────────────────────────────────────────────

let holdings    = [];
let halfLife    = 63;
let chartCleanup = null;

function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings)); } catch {} }
function restore() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; } }

// ── Data fetching ──────────────────────────────────────────────────────────────

const SER_CACHE = new Map();
const SER_TTL   = 10 * 60 * 1000;

async function fetchSeries(symbol, signal) {
  const hit = SER_CACHE.get(symbol);
  if (hit && Date.now() - hit.ts < SER_TTL) return hit.data;
  try {
    const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`;
    const r    = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' }, signal });
    if (!r.ok) return null;
    const j   = await r.json();
    const res = j?.chart?.result?.[0];
    if (!res) return null;
    const ts = res.timestamp ?? [];
    const cl = res.indicators?.quote?.[0]?.close ?? [];
    const m  = res.meta;
    const retData = [];
    for (let i = 1; i < ts.length; i++) {
      if (cl[i] != null && cl[i - 1] != null && cl[i - 1] !== 0)
        retData.push({ date: ts[i], ret: (cl[i] - cl[i - 1]) / cl[i - 1] });
    }
    const data = { symbol, name: m.longName || m.shortName || symbol, price: m.regularMarketPrice, retData };
    SER_CACHE.set(symbol, { ts: Date.now(), data });
    return data;
  } catch { return null; }
}

async function quickLookup(symbol) {
  try {
    const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
    const r    = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    const m = (await r.json())?.chart?.result?.[0]?.meta;
    return m ? { name: m.longName || m.shortName || symbol, price: m.regularMarketPrice } : null;
  } catch { return null; }
}

// ── Math engine ────────────────────────────────────────────────────────────────

// Normalize unix timestamp to YYYY-MM-DD date key.
// +12h offset absorbs timezone differences between markets:
//   AU midnight AEST = prev-day 14:00 UTC → +12h → same-day 02:00 UTC → correct date.
//   US midnight UTC → +12h → 12:00 UTC → correct date.
function tsToDateKey(ts) {
  const d = new Date((ts + 43200) * 1000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

function alignSeries(seriesArr) {
  // Normalize timestamps → date strings, union all dates, forward-fill missing with 0.
  const normalised = seriesArr.map(s => s.map(r => ({ key: tsToDateKey(r.date), ret: r.ret })));
  const allKeys = new Set();
  normalised.forEach(s => s.forEach(r => allKeys.add(r.key)));
  const sorted = [...allKeys].sort(); // YYYY-MM-DD sorts lexicographically
  const aligned = normalised.map(s => {
    const m = new Map(s.map(r => [r.key, r.ret]));
    return sorted.map(k => m.get(k) ?? 0); // 0 = market closed / holiday
  });
  return { dates: sorted, aligned }; // dates are YYYY-MM-DD strings
}

function ewmaCov(retMatrix, hl) {
  const n = retMatrix.length;
  const T = retMatrix[0]?.length ?? 0;
  if (T < 10 || n < 1) return null;
  const lambda = Math.exp(-Math.LN2 / hl);
  const cov = Array.from({ length: n }, () => new Array(n).fill(0));
  let totalW = 0, w = 1;
  for (let t = T - 1; t >= 0; t--) {
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        cov[i][j] += w * retMatrix[i][t] * retMatrix[j][t];
    totalW += w;
    w *= lambda;
  }
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      cov[i][j] = (cov[i][j] / totalW) * 252;
  return cov;
}

function covToCorr(cov) {
  const n = cov.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      const d = Math.sqrt(cov[i][i] * cov[j][j]);
      return d > 0 ? cov[i][j] / d : (i === j ? 1 : 0);
    })
  );
}

function riskDecompose(weights, cov) {
  const n  = weights.length;
  const Sw = weights.map((_, i) => weights.reduce((s, w, j) => s + cov[i][j] * w, 0));
  const portVar = weights.reduce((s, w, i) => s + w * Sw[i], 0);
  const portVol = Math.sqrt(Math.max(0, portVar));
  const RC      = weights.map((w, i) => portVol > 0 ? w * Sw[i] / portVol : 0);
  const pctRC   = RC.map(r => portVol > 0 ? r / portVol : 0);
  const indivVols   = cov.map((_, i) => Math.sqrt(Math.max(0, cov[i][i])));
  const wAvgVol     = weights.reduce((s, w, i) => s + w * indivVols[i], 0);
  const divRatio    = portVol > 0 ? wAvgVol / portVol : 1;
  return { portVol, RC, pctRC, indivVols, divRatio };
}

function portMetrics(portRets, bmkRets) {
  const T = portRets.length;
  if (T < 5) return null;
  let nav = 1, peak = 1, maxDD = 0;
  const navSeries = [], ddSeries = [];
  for (const r of portRets) {
    nav *= (1 + r);
    navSeries.push(nav);
    if (nav > peak) peak = nav;
    const dd = nav / peak - 1;
    ddSeries.push(dd);
    if (-dd > maxDD) maxDD = -dd;
  }
  const annRet = Math.pow(Math.max(nav, 1e-9), 252 / T) - 1;
  const mean   = portRets.reduce((s, r) => s + r, 0) / T;
  const vol    = Math.sqrt(portRets.reduce((s, r) => s + (r - mean) ** 2, 0) / (T - 1) * 252);
  const sharpe = vol > 0 ? (annRet - 0.04) / vol : null;
  const calmar = maxDD > 0 ? annRet / maxDD : null;
  let beta = null;
  if (bmkRets?.length === T) {
    const bm = bmkRets.reduce((s, r) => s + r, 0) / T;
    let cov = 0, bv = 0;
    portRets.forEach((r, t) => { cov += (r - mean) * (bmkRets[t] - bm); bv += (bmkRets[t] - bm) ** 2; });
    beta = bv > 0 ? cov / bv : null;
  }
  let bn = 1;
  const bmkNav = bmkRets?.map(r => { bn *= (1 + r); return bn; }) ?? [];
  return { annRet, vol, sharpe, beta, maxDD, calmar, navSeries, ddSeries, bmkNav };
}

// ── Formatting ─────────────────────────────────────────────────────────────────

const fmt = {
  pct:   (v, d = 2) => v == null || isNaN(v) ? '—' : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(d)}%`,
  num:   (v, d = 2) => v == null || isNaN(v) ? '—' : v.toFixed(d),
  price: (v)        => v == null ? '—' : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  cls:   (v)        => v == null || isNaN(v) ? '' : v >= 0 ? 'up' : 'dn',
};

function corrBg(v) {
  if (v == null || isNaN(v)) return 'transparent';
  const c = Math.max(-1, Math.min(1, v));
  const a = (Math.abs(c) * 0.65 + 0.08).toFixed(2);
  return c >= 0 ? `rgba(248,113,113,${a})` : `rgba(52,211,153,${a})`;
}

// ── HTML builders ──────────────────────────────────────────────────────────────

function metricsStrip(m) {
  const cards = [
    ['Ann. Return',  fmt.pct(m.annRet),   fmt.cls(m.annRet)],
    ['Ann. Vol',     fmt.pct(m.vol),       ''],
    ['Sharpe',       fmt.num(m.sharpe),    fmt.cls(m.sharpe)],
    ['Beta (SPX)',   fmt.num(m.beta),      ''],
    ['Max Drawdown', fmt.pct(-m.maxDD),    'dn'],
    ['Calmar',       fmt.num(m.calmar),    fmt.cls(m.calmar)],
  ];
  return `<div class="port-metrics-strip">
    ${cards.map(([l, v, c]) => `
      <div class="port-metric-card">
        <div class="port-metric-label">${l}</div>
        <div class="port-metric-val ${c}">${v}</div>
      </div>`).join('')}
  </div>`;
}

function riskPanel(labels, weights, cov) {
  const { portVol, pctRC, indivVols, divRatio } = riskDecompose(weights, cov);
  const maxPct = Math.max(1e-9, ...pctRC.map(Math.abs));
  const rows = labels.map((l, i) => `
    <div class="port-risk-row">
      <div class="port-risk-lbl">${l}</div>
      <div class="port-risk-bar-wrap">
        <div class="port-risk-bar" style="width:${(Math.abs(pctRC[i]) / maxPct * 100).toFixed(1)}%"></div>
      </div>
      <div class="port-risk-pct">${(pctRC[i] * 100).toFixed(1)}%</div>
      <div class="port-risk-vol">${(indivVols[i] * 100).toFixed(1)}% vol</div>
    </div>`).join('');
  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Risk Contribution</div>
      <div class="port-risk-meta">
        Portfolio Vol <strong>${(portVol * 100).toFixed(2)}%</strong>
        &nbsp;·&nbsp; Div. Ratio <strong>${divRatio.toFixed(2)}×</strong>
      </div>
      <div class="port-risk-rows">${rows}</div>
    </div>`;
}

function volTable(labels, weights, cov) {
  const portVar = weights.reduce((sv, w, i) => sv + w * weights.reduce((s, wj, j) => s + wj * cov[i][j], 0), 0);
  const rows = labels.map((l, i) => {
    const vol         = Math.sqrt(Math.max(0, cov[i][i]));
    const covWithPort = weights.reduce((s, w, j) => s + w * cov[i][j], 0);
    const betaPort    = portVar > 0 ? covWithPort / portVar : null;
    return `<tr>
      <td class="mkt-name">${l}</td>
      <td class="num">${(weights[i] * 100).toFixed(1)}%</td>
      <td class="num">${(vol * 100).toFixed(1)}%</td>
      <td class="num">${fmt.num(betaPort)}</td>
    </tr>`;
  }).join('');
  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Volatility & Contribution Beta</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Ann. Vol</th><th class="num">β → Port</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function corrHeatmap(labels, cov, hl) {
  const corr = covToCorr(cov);
  const hdrs = labels.map(l => `<th class="corr-col-hdr">${l}</th>`).join('');
  const rows = labels.map((l, i) =>
    `<tr><th class="corr-row-hdr">${l}</th>${labels.map((_, j) => {
      const v    = corr[i][j];
      const diag = i === j;
      return `<td class="corr-cell${diag ? ' corr-diag' : ''}"
        style="background:${diag ? 'var(--bg-base)' : corrBg(v)}">${diag ? '—' : v.toFixed(2)}</td>`;
    }).join('')}</tr>`
  ).join('');
  return `
    <div class="mkt-panel">
      <div class="port-corr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">EWMA Correlation Matrix</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="port-hl-slider" class="port-hl-slider" min="5" max="252" value="${hl}" step="1">
          <span id="port-hl-val" class="port-hl-val">${hl}d</span>
        </div>
      </div>
      <div class="corr-legend">
        <span class="corr-leg corr-leg-neg">■ Diversifying (negative)</span>
        <span class="corr-leg corr-leg-pos">■ Correlated (positive)</span>
      </div>
      <div class="corr-scroll">
        <table class="corr-table">
          <thead><tr><th></th>${hdrs}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function attrTable(labels, weights, retMatrix, dates, period) {
  const T = dates.length;
  const offsets = { '1d': 1, '1w': 5, '1m': 21, '3m': 63 };
  let startIdx;
  if (period === 'ytd') {
    const yr = String(new Date().getFullYear());
    startIdx = dates.findIndex(d => d.startsWith(yr));
    if (startIdx < 0) startIdx = 0;
  } else {
    startIdx = Math.max(0, T - (offsets[period] ?? 1));
  }
  const assetRets = retMatrix.map(rets =>
    rets.slice(startIdx).reduce((acc, r) => acc * (1 + r), 1) - 1
  );
  const portRet = assetRets.reduce((s, r, i) => s + weights[i] * r, 0);
  const maxAbs  = Math.max(1e-9, ...assetRets.map(r => Math.abs(r)));
  const periodBtns = ['1d','1w','1m','3m','ytd'].map(p =>
    `<button class="port-period-btn${p === period ? ' active' : ''}" data-period="${p}">${p.toUpperCase()}</button>`
  ).join('');
  const rows = labels.map((l, i) => {
    const ret    = assetRets[i];
    const contrib = weights[i] * ret;
    const barW   = (Math.abs(ret) / maxAbs * 100).toFixed(1);
    return `<tr>
      <td class="mkt-name">${l}</td>
      <td class="num">${(weights[i] * 100).toFixed(1)}%</td>
      <td class="num ${fmt.cls(ret)}">${fmt.pct(ret)}</td>
      <td class="num ${fmt.cls(contrib)}">${fmt.pct(contrib)}</td>
      <td class="port-attr-bar-cell">
        <span class="port-attr-bar ${ret >= 0 ? 'up' : 'dn'}" style="width:${barW}%"></span>
      </td>
    </tr>`;
  }).join('');
  return `
    <div class="mkt-panel">
      <div class="port-attr-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 8px">Return Attribution</span>
        <div class="port-attr-periods" id="port-attr-periods">${periodBtns}</div>
      </div>
      <div class="port-attr-summary">
        Portfolio return: <strong class="${fmt.cls(portRet)}">${fmt.pct(portRet)}</strong>
      </div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Weight</th>
          <th class="num">Return</th><th class="num">Contribution</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Chart ──────────────────────────────────────────────────────────────────────

async function drawNavChart(container, dates, portNav, bmkNav) {
  const wrap = container.querySelector('#port-chart-wrap');
  if (!wrap) return;
  if (chartCleanup) { chartCleanup(); chartCleanup = null; }

  const { createChart } = await import('lightweight-charts');
  wrap.innerHTML = '';
  const el = document.createElement('div');
  el.style.height = '280px';
  wrap.appendChild(el);

  const chart = createChart(el, {
    layout: { background: { color: 'transparent' }, textColor: '#6b7280' },
    grid:   { vertLines: { color: '#22253a' }, horzLines: { color: '#22253a' } },
    rightPriceScale: { borderColor: '#22253a' },
    timeScale:       { borderColor: '#22253a' },
  });

  // dates are already YYYY-MM-DD strings — pass directly to lightweight-charts
  const portSer = chart.addLineSeries({ color: '#7c6af7', lineWidth: 2, title: 'Portfolio' });
  const bmkSer  = chart.addLineSeries({ color: '#4b5563', lineWidth: 1, lineStyle: 2, title: 'S&P 500' });

  function applyMode(mode) {
    if (mode === 'cumret') {
      portSer.setData(dates.map((d, i) => ({ time: d, value: +((portNav[i] - 1) * 100).toFixed(3) })));
      bmkSer.setData(dates.map((d, i) => ({ time: d, value: +((bmkNav[i]  - 1) * 100).toFixed(3) })));
    } else {
      let pk = 1;
      portSer.setData(dates.map((d, i) => {
        if (portNav[i] > pk) pk = portNav[i];
        return { time: d, value: +((portNav[i] / pk - 1) * 100).toFixed(3) };
      }));
      bmkSer.setData([]);
    }
    chart.timeScale().fitContent();
  }

  applyMode('cumret');

  container.querySelector('#port-chart-toggle')?.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('#port-chart-toggle [data-mode]')
        .forEach(b => b.classList.toggle('active', b === btn));
      applyMode(btn.dataset.mode);
    });
  });

  const ro = new ResizeObserver(() => chart.resize(el.offsetWidth, 280));
  ro.observe(el);
  chartCleanup = () => { ro.disconnect(); chart.remove(); };
}

// ── Analytics render ───────────────────────────────────────────────────────────

function renderAnalytics(aEl, retMatrix, dates, labels, weights, metrics) {
  aEl.innerHTML = `
    <div id="port-metrics-strip"></div>

    <div class="mkt-panel port-chart-panel">
      <div class="port-chart-hdr">
        <span class="mkt-panel-label" style="border:none;padding:10px 14px 4px">Portfolio Returns</span>
        <div id="port-chart-toggle" class="port-chart-toggle">
          <button class="port-period-btn active" data-mode="cumret">Cumulative</button>
          <button class="port-period-btn" data-mode="dd">Drawdown</button>
        </div>
      </div>
      <div id="port-chart-wrap"></div>
    </div>

    <div class="mkt-section mkt-two-col">
      <div id="port-risk-panel"></div>
      <div id="port-vol-panel"></div>
    </div>

    <div id="port-corr-panel" class="mkt-section"></div>

    <div id="port-attr-panel" class="mkt-section"></div>
  `;

  aEl.querySelector('#port-metrics-strip').innerHTML = metricsStrip(metrics);

  function rebuildCovPanels(hl) {
    const newCov = ewmaCov(retMatrix, hl);
    if (!newCov) return;
    aEl.querySelector('#port-risk-panel').innerHTML = riskPanel(labels, weights, newCov);
    aEl.querySelector('#port-vol-panel').innerHTML  = volTable(labels, weights, newCov);
    aEl.querySelector('#port-corr-panel').innerHTML = corrHeatmap(labels, newCov, hl);
    wireSlider();
  }

  function wireSlider() {
    const s = aEl.querySelector('#port-hl-slider');
    const v = aEl.querySelector('#port-hl-val');
    if (!s) return;
    s.addEventListener('input', () => {
      halfLife = +s.value;
      if (v) v.textContent = `${halfLife}d`;
      rebuildCovPanels(halfLife);
    });
  }

  function wireAttr(period = '1d') {
    aEl.querySelector('#port-attr-panel').innerHTML = attrTable(labels, weights, retMatrix, dates, period);
    aEl.querySelector('#port-attr-periods')?.querySelectorAll('.port-period-btn').forEach(btn => {
      btn.addEventListener('click', () => wireAttr(btn.dataset.period));
    });
  }

  rebuildCovPanels(halfLife);
  wireAttr('1d');
  drawNavChart(aEl, dates, metrics.navSeries, metrics.bmkNav);
}

// ── Entry point ────────────────────────────────────────────────────────────────

export function renderPortfolioTab(container) {
  holdings = restore();
  if (!Array.isArray(holdings)) holdings = [];

  container.innerHTML = `
    <div class="port-layout">
      <div class="mkt-panel port-holdings-panel">
        <div class="mkt-panel-label">Portfolio Holdings</div>

        <div class="port-add-form">
          <select id="port-market" class="sa-market-sel">
            ${MARKETS.map(m => `<option value="${m.suffix}">${m.label}</option>`).join('')}
          </select>
          <input id="port-ticker" type="text" class="sa-ticker-inp" placeholder="Ticker" maxlength="12">
          <div class="port-add-weight-wrap">
            <input id="port-weight-inp" type="number" class="port-add-weight" placeholder="Wt" min="0" max="100" step="0.5">
            <span class="port-weight-pct">%</span>
          </div>
          <button id="port-add-btn" class="ghost-btn">+ Add</button>
          <span id="port-add-err" class="port-add-err"></span>
        </div>

        <table class="mkt-table port-holdings-table">
          <thead><tr>
            <th>Ticker</th><th>Name</th><th>Weight</th><th class="num">Price</th><th></th>
          </tr></thead>
          <tbody id="port-holdings-body"></tbody>
        </table>

        <div class="port-holdings-footer">
          <span id="port-total" class="port-total">Total: 0%</span>
          <button id="port-analyze-btn" class="port-analyze-btn">Analyze Portfolio</button>
        </div>
      </div>

      <div id="port-analytics"></div>
    </div>
  `;

  let nextId   = holdings.reduce((m, h) => Math.max(m, h.id ?? 0), 0) + 1;
  let abortCtrl = null;

  const aEl       = container.querySelector('#port-analytics');
  const addBtn    = container.querySelector('#port-add-btn');
  const analyzeBtn = container.querySelector('#port-analyze-btn');
  const addErrEl  = container.querySelector('#port-add-err');
  const tickerInp = container.querySelector('#port-ticker');
  const marketSel = container.querySelector('#port-market');
  const weightInp = container.querySelector('#port-weight-inp');
  const body      = container.querySelector('#port-holdings-body');

  function refreshTable() {
    const total = holdings.reduce((s, h) => s + h.weight, 0);
    body.innerHTML = holdings.length === 0
      ? `<tr><td colspan="5" class="port-empty">No holdings yet — add a ticker above.</td></tr>`
      : holdings.map(h => `
        <tr>
          <td class="mkt-name mono">${h.displaySymbol}</td>
          <td class="port-name-cell">${h.name}</td>
          <td>
            <div class="port-wt-cell">
              <input type="number" class="port-wt-inp" data-id="${h.id}"
                value="${h.weight}" min="0" max="100" step="0.5">
              <span class="port-weight-pct">%</span>
            </div>
          </td>
          <td class="num">${fmt.price(h.price)}</td>
          <td><button class="port-remove" data-id="${h.id}" title="Remove">×</button></td>
        </tr>`).join('');

    const totalEl = container.querySelector('#port-total');
    if (totalEl) {
      totalEl.textContent = `Total: ${total.toFixed(1)}%`;
      totalEl.className   = `port-total ${total > 100.01 ? 'dn' : Math.abs(total-100) < 0.01 ? 'up' : ''}`;
    }

    body.querySelectorAll('.port-wt-inp').forEach(inp => {
      inp.addEventListener('change', e => {
        const h = holdings.find(h => h.id === +e.target.dataset.id);
        if (h) { h.weight = parseFloat(e.target.value) || 0; persist(); refreshTable(); }
      });
    });
    body.querySelectorAll('.port-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        holdings = holdings.filter(h => h.id !== +e.target.dataset.id);
        persist(); refreshTable();
      });
    });
  }

  addBtn.addEventListener('click', async () => {
    const suffix = marketSel.value;
    const raw    = tickerInp.value.trim().toUpperCase();
    if (!raw) { addErrEl.textContent = 'Enter a ticker'; return; }
    const symbol = raw + suffix;
    if (holdings.some(h => h.symbol === symbol)) { addErrEl.textContent = 'Already added'; return; }
    const weight = parseFloat(weightInp.value) || 0;
    addBtn.disabled    = true;
    addErrEl.textContent = 'Looking up…';
    const info = await quickLookup(symbol);
    addBtn.disabled    = false;
    if (!info) { addErrEl.textContent = `"${symbol}" not found`; return; }
    holdings.push({ id: nextId++, symbol, displaySymbol: raw, name: info.name, price: info.price, weight });
    persist();
    tickerInp.value = '';
    weightInp.value = '';
    addErrEl.textContent = '';
    refreshTable();
  });

  tickerInp.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  analyzeBtn.addEventListener('click', async () => {
    if (holdings.length < 2) {
      aEl.innerHTML = `<div class="port-msg port-err">Add at least 2 holdings to analyze.</div>`;
      return;
    }
    abortCtrl?.abort();
    abortCtrl = new AbortController();
    aEl.innerHTML = `<div class="port-msg port-loading"><div class="sa-spinner"></div><span>Fetching 1Y data for ${holdings.length} holdings…</span></div>`;
    analyzeBtn.disabled = true;

    const syms    = [...new Set([BENCHMARK.symbol, ...holdings.map(h => h.symbol)])];
    const results = await Promise.all(syms.map(s => fetchSeries(s, abortCtrl.signal)));
    analyzeBtn.disabled = false;

    const dataMap = new Map(syms.map((s, i) => [s, results[i]]));
    const failed  = holdings.filter(h => !dataMap.get(h.symbol));
    if (failed.length) {
      aEl.innerHTML = `<div class="port-msg port-err">Could not load data for: ${failed.map(h => h.displaySymbol).join(', ')}</div>`;
      return;
    }

    const bmkData        = dataMap.get(BENCHMARK.symbol);
    const holdingSeries  = holdings.map(h => dataMap.get(h.symbol).retData);
    const allForAlign    = bmkData ? [...holdingSeries, bmkData.retData] : holdingSeries;
    const { dates, aligned } = alignSeries(allForAlign);
    const retMatrix      = aligned.slice(0, holdings.length);
    const bmkAligned     = bmkData ? aligned[aligned.length - 1] : null;
    const weights        = holdings.map(h => h.weight / 100);
    const portRets       = dates.map((_, t) => weights.reduce((s, w, i) => s + w * (retMatrix[i][t] ?? 0), 0));
    const metrics        = portMetrics(portRets, bmkAligned);

    if (!metrics) {
      aEl.innerHTML = `<div class="port-msg port-err">Insufficient data for analysis (need ≥5 aligned trading days).</div>`;
      return;
    }

    const labels = holdings.map(h => h.displaySymbol);
    renderAnalytics(aEl, retMatrix, dates, labels, weights, metrics);
  });

  refreshTable();

  return () => { abortCtrl?.abort(); if (chartCleanup) { chartCleanup(); chartCleanup = null; } };
}
