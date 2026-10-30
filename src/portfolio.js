// ── Portfolio Lab Tab ─────────────────────────────────────────────────────────
// Schedule-driven portfolio construction: dated target weights, a daily backtest
// in a chosen base currency, then performance, attribution, trading and risk views.

import { createLocalStore, newPortfolio, normalisePortfolio, uid } from './portlab/store.js';
import { loadUniverse, lookupSymbol } from './portlab/data.js';
import * as E from './portlab/engine.js';
import { chartTheme, timeChart, eventBars, esc, shortDate, MAX_SERIES } from './portlab/charts.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const MARKETS = [
  { label: 'US',    suffix: '' },
  { label: 'ASX',   suffix: '.AX' },
  { label: 'LSE',   suffix: '.L' },
  { label: 'TSX',   suffix: '.TO' },
  { label: 'XETRA', suffix: '.DE' },
  { label: 'TSE',   suffix: '.T' },
  { label: 'HKEX',  suffix: '.HK' },
];

const BENCHMARKS = [
  { spec: 'SPY',            label: 'S&P 500 (SPY)' },
  { spec: 'ACWI',           label: 'MSCI ACWI (ACWI)' },
  { spec: 'QQQ',            label: 'Nasdaq-100 (QQQ)' },
  { spec: 'STW.AX',         label: 'S&P/ASX 200 (STW)' },
  { spec: 'AGG',            label: 'US Aggregate Bond (AGG)' },
  { spec: 'ACWI:60,AGG:40', label: '60/40 Global (ACWI / AGG)' },
  { spec: '^GSPC',          label: 'S&P 500 price index' },
];
const CURRENCIES = ['USD', 'AUD', 'EUR', 'GBP', 'JPY', 'CAD', 'CHF', 'HKD', 'NZD', 'SGD'];
const REBALANCE = [['none', 'Drift between dates'], ['monthly', 'Rebalance monthly'], ['quarterly', 'Rebalance quarterly'], ['annual', 'Rebalance annually']];
const PERIODS = [['1m', '1M'], ['3m', '3M'], ['6m', '6M'], ['ytd', 'YTD'], ['1y', '1Y'], ['3y', '3Y'], ['all', 'Inception']];
const VIEWS = [['overview', 'Overview'], ['attribution', 'Attribution'], ['trading', 'Trading'], ['risk', 'Risk']];
const PERF_MODES = [['growth', 'Growth of 100'], ['drawdown', 'Drawdown'], ['active', 'Relative'], ['vol', 'Rolling vol'], ['beta', 'Rolling beta'], ['sharpe', 'Rolling Sharpe'], ['te', 'Rolling TE']];
const ROLL_WIN = 63;
// History reaches back far enough for every stress scenario, whatever the inception date.
const HISTORY_FROM = '2019-12-01';

// ── Module state ──────────────────────────────────────────────────────────────

const store = createLocalStore();
let ws = null;
let result = null;
let halfLife = 63;
const ui = { view: 'overview', perfMode: 'growth', period: 'all', from: null, to: null, weightsMode: 'actual', calMode: 'p', tradeFilter: 'scheduled' };

const active = () => ws.portfolios.find(p => p.id === ws.activeId) ?? ws.portfolios[0];

// ── Formatting ────────────────────────────────────────────────────────────────

const ok = v => v != null && Number.isFinite(v);
const fmt = {
  pct:  (v, d = 2) => ok(v) ? `${v >= 0 ? '+' : ''}${(v * 100).toFixed(d)}%` : '—',
  pctU: (v, d = 1) => ok(v) ? `${(v * 100).toFixed(d)}%` : '—',
  num:  (v, d = 2) => ok(v) ? v.toFixed(d) : '—',
  bps:  v => ok(v) ? `${(v * 1e4).toFixed(0)} bps` : '—',
  cls:  v => !ok(v) || Math.abs(v) < 5e-7 ? '' : v > 0 ? 'up' : 'dn',
  money(v, ccy, compact = false) {
    if (!ok(v)) return '—';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: ccy, notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 0 }).format(v);
    } catch { return v.toFixed(0); }
  },
};

const colourFor = (i, th) => i < MAX_SERIES ? th.series[i] : th.other;

function download(filename, text, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const fileSafe = s => s.replace(/[^\w.-]+/g, '_').slice(0, 60) || 'portfolio';
const csvCell = v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);

// Lightweight-charts needs plain rgba strings.
function alpha(hex, a) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  return m ? `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})` : hex;
}

function seg(name, options, current) {
  return `<div class="pl-seg" role="group">${options.map(([v, l]) =>
    `<button class="port-period-btn${v === current ? ' active' : ''}" data-action="${name}" data-value="${v}">${l}</button>`).join('')}</div>`;
}

function panel(title, body, { tools = '', cls = '' } = {}) {
  return `<section class="mkt-panel pl-panel ${cls}">
    <div class="pl-panel-hdr"><span class="mkt-panel-label">${title}</span>${tools}</div>${body}</section>`;
}

function kpi(label, value, { cls = '', sub = '' } = {}) {
  return `<div class="pl-kpi"><div class="pl-kpi-label">${label}</div><div class="pl-kpi-val ${cls}">${value}</div>${sub ? `<div class="pl-kpi-sub">${sub}</div>` : ''}</div>`;
}

// ── Schedule helpers ──────────────────────────────────────────────────────────

const colTotal = (pf, col) => pf.assets.reduce((s, a) => s + (+col.weights[a.symbol] || 0), 0);

function validate(pf) {
  const errors = [], notes = [];
  if (!pf.assets.length) errors.push('Add at least one asset.');
  const dates = pf.schedule.map(c => c.date);
  if (dates.some(d => !E.isValidKey(d))) errors.push('Every rebalance column needs a valid date.');
  else {
    if (new Set(dates).size !== dates.length) errors.push('Two rebalance columns share a date.');
    if (dates[0] >= E.todayKey()) errors.push('The inception date must be in the past.');
  }
  if (!E.parseBenchmark(pf.settings.benchmark).length) errors.push('Choose a benchmark.');
  pf.schedule.forEach(c => {
    const t = colTotal(pf, c);
    if (pf.assets.length && Math.abs(t - 100) > 0.05 && E.isValidKey(c.date))
      notes.push(`${shortDate(c.date)}: ${t.toFixed(1)}% invested (${t < 100 ? `${(100 - t).toFixed(1)}% cash` : `${(t - 100).toFixed(1)}% financed`})`);
  });
  return { errors, notes };
}

// Wide CSV: header "date,SYM1,SYM2,…", one row per rebalance. Fractions or percentages.
function parseScheduleCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('Paste a header row and at least one rebalance row.');
  const split = l => l.split(/[,\t;]/).map(s => s.trim().replace(/^"|"$/g, ''));
  const head = split(lines[0]);
  if (!/^date$/i.test(head[0])) throw new Error('The first column header must be "date".');
  const symbols = head.slice(1).map(s => s.toUpperCase());
  if (!symbols.length || symbols.some(s => !s)) throw new Error('Every column after "date" needs a ticker.');
  const rows = lines.slice(1).map((l, r) => {
    const cells = split(l);
    let date = cells[0];
    const au = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
    if (au) date = `${au[3]}-${au[2].padStart(2, '0')}-${au[1].padStart(2, '0')}`;
    if (!E.isValidKey(date)) throw new Error(`Row ${r + 2}: "${cells[0]}" is not a date (use YYYY-MM-DD or DD/MM/YYYY).`);
    const vals = symbols.map((_, i) => parseFloat((cells[i + 1] ?? '').replace('%', '')) || 0);
    return { date, vals };
  });
  const fractional = rows.every(r => r.vals.every(v => Math.abs(v) <= 1.5) && r.vals.reduce((s, v) => s + v, 0) <= 1.5);
  return {
    symbols,
    rows: rows.map(r => ({ date: r.date, weights: Object.fromEntries(symbols.map((s, i) => [s, +(fractional ? r.vals[i] * 100 : r.vals[i]).toFixed(4)])) })),
  };
}

// ── Entry point ───────────────────────────────────────────────────────────────

export function renderPortfolioTab(container) {
  container.innerHTML = `
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <div><div class="eyebrow">03 / PORTFOLIO LAB</div><h1 class="mkt-title">Construction, attribution &amp; risk</h1></div>
      </div>
      <div class="mkt-actions"><span class="data-note" id="pl-save-state">Loading workspace…</span></div>
    </div>
    <div class="mkt-panel pl-workbar" id="pl-workbar"></div>
    <div class="mkt-panel pl-builder" id="pl-builder"></div>
    <div id="pl-results"></div>
    <dialog class="pl-dialog" id="pl-csv-dialog">
      <form method="dialog" class="pl-dialog-body">
        <div class="mkt-panel-label">Import schedule from CSV</div>
        <p class="pl-note">One row per rebalance date, one column per Yahoo ticker. Weights as percentages or fractions. Pasting replaces the current schedule; new tickers are looked up and added.</p>
        <pre class="pl-code">date,SPY,AGG,GLD,CBA.AX
2022-01-03,50,30,10,10
2023-07-03,45,30,15,10</pre>
        <textarea id="pl-csv-text" rows="8" spellcheck="false" placeholder="Paste CSV here"></textarea>
        <div class="pl-dialog-foot">
          <span class="port-add-err" id="pl-csv-err"></span>
          <button class="ghost-btn" value="cancel" formnovalidate>Cancel</button>
          <button class="port-analyze-btn" type="button" data-action="csv-apply">Import</button>
        </div>
      </form>
    </dialog>
    <input type="file" id="pl-import-file" accept="application/json,.json" hidden>
  `;

  const $ = sel => container.querySelector(sel);
  const workbar = $('#pl-workbar'), builder = $('#pl-builder'), resultsEl = $('#pl-results');
  const saveState = $('#pl-save-state'), csvDialog = $('#pl-csv-dialog'), importFile = $('#pl-import-file');
  let abortCtrl = null, saveTimer = null, alive = true;
  let viewCleanups = [], perfCleanup = null;
  const clearView = () => { perfCleanup?.(); perfCleanup = null; viewCleanups.forEach(f => f()); viewCleanups = []; };

  // ── Persistence ──

  function flushSave() {
    clearTimeout(saveTimer); saveTimer = null;
    return store.save(ws)
      .then(() => { if (alive) saveState.textContent = `${store.label} · saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; })
      .catch(() => { if (alive) saveState.textContent = 'Could not save — browser storage unavailable'; });
  }
  function persist() {
    active().updatedAt = Date.now();
    saveState.textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, 300);
    const stale = container.querySelector('#pl-stale');
    if (stale && result) stale.hidden = active().updatedAt <= result.ranAt;
  }

  // ── Workbar: portfolio management ──

  function renderWorkbar() {
    const pf = active();
    workbar.innerHTML = `<div class="pl-workbar-row">
      <label class="pl-field pl-field-inline"><span>Portfolio</span>
        <select id="pl-pf-select" class="sa-market-sel">${ws.portfolios.map(p => `<option value="${p.id}"${p.id === pf.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
      </label>
      <label class="pl-field pl-field-inline pl-grow"><span>Name</span><input id="pl-name" class="sa-ticker-inp pl-name-inp" value="${esc(pf.name)}" maxlength="80"></label>
      <div class="pl-btn-group">
        <button class="ghost-btn" data-action="new">New</button>
        <button class="ghost-btn" data-action="duplicate">Duplicate</button>
        <button class="ghost-btn" data-action="export-json" title="Download this portfolio as a JSON file">Export</button>
        <button class="ghost-btn" data-action="import-json" title="Load a portfolio JSON file">Import</button>
        <button class="ghost-btn pl-danger" data-action="delete">Delete</button>
      </div>
    </div>`;
  }

  // ── Builder: assets × rebalance-date grid and settings ──

  function gridHtml(pf) {
    if (!pf.assets.length) return `<div class="port-empty">No assets yet — add tickers above, or import a schedule from CSV.</div>`;
    const th = chartTheme();
    const cols = pf.schedule;
    return `<div class="pl-sched-scroll"><table class="pl-sched">
      <thead><tr>
        <th class="pl-sticky">Asset</th>
        ${cols.map((c, j) => `<th class="pl-col-hdr">
          <div class="pl-col-top"><span>${j === 0 ? 'Inception' : `Rebalance ${j}`}</span>
            ${cols.length > 1 ? `<button class="pl-x" data-action="del-col" data-col="${j}" title="Remove this date" aria-label="Remove this date">×</button>` : ''}</div>
          <input type="date" class="pl-date-inp" data-col="${j}" value="${c.date}" max="${E.todayKey()}">
        </th>`).join('')}
        <th class="pl-add-col"><button class="ghost-btn" data-action="add-col">+ Date</button></th>
      </tr></thead>
      <tbody>${pf.assets.map((a, i) => `<tr>
        <td class="pl-sticky"><div class="pl-asset">
          <span class="pl-swatch" style="background:${colourFor(i, th)}"></span>
          <span class="pl-asset-sym">${esc(a.display)}</span>
          <span class="pl-asset-meta" title="${esc(a.name)}">${esc(a.name)}${a.currency ? ` · ${esc(a.currency)}` : ''}</span>
          <button class="pl-x" data-action="del-asset" data-sym="${esc(a.symbol)}" title="Remove ${esc(a.display)}" aria-label="Remove ${esc(a.display)}">×</button>
        </div></td>
        ${cols.map((c, j) => `<td><input type="number" class="pl-cell" data-col="${j}" data-sym="${esc(a.symbol)}" value="${c.weights[a.symbol] ?? ''}" step="0.5" placeholder="0" aria-label="${esc(a.display)} weight on ${c.date}"></td>`).join('')}
        <td></td>
      </tr>`).join('')}</tbody>
      <tfoot>
        <tr class="pl-total-row"><td class="pl-sticky">Invested</td>${cols.map((_, j) => `<td class="num" data-total="${j}"></td>`).join('')}<td></td></tr>
        <tr class="pl-cash-row"><td class="pl-sticky">Cash</td>${cols.map((_, j) => `<td class="num" data-cash="${j}"></td>`).join('')}<td></td></tr>
        <tr class="pl-tools-row"><td class="pl-sticky"></td>${cols.map((_, j) => `<td>
          <button class="pl-mini-btn" data-action="normalise" data-col="${j}" title="Scale this column to 100%">→100</button>
          <button class="pl-mini-btn" data-action="equal" data-col="${j}" title="Equal-weight this column">EW</button></td>`).join('')}<td></td></tr>
      </tfoot>
    </table></div>`;
  }

  function renderBuilder() {
    const pf = active(), s = pf.settings;
    const preset = BENCHMARKS.some(b => b.spec === s.benchmark);
    builder.innerHTML = `
      <div class="mkt-panel-label">Allocation schedule</div>
      <p class="pl-intro">Each column is a target allocation. The portfolio trades to it at the close of that date, then drifts with the market — or resets to the latest target on the calendar policy below — until the next column. Under 100% holds cash at the risk-free rate; over 100% is financed at the same rate. Negative weights are shorts.</p>
      <div class="port-add-form">
        <select id="pl-market" class="sa-market-sel" aria-label="Exchange">${MARKETS.map(m => `<option value="${m.suffix}">${m.label}</option>`).join('')}</select>
        <input id="pl-ticker" type="text" class="sa-ticker-inp" placeholder="Ticker (e.g. MSFT, BTC-USD)" maxlength="16" aria-label="Ticker">
        <button class="ghost-btn" data-action="add-asset">+ Add asset</button>
        <span id="pl-add-err" class="port-add-err" role="status"></span>
        <span class="pl-grow"></span>
        <button class="ghost-btn" data-action="csv-open">Paste CSV</button>
        <button class="ghost-btn" data-action="csv-export">Export CSV</button>
      </div>
      ${gridHtml(pf)}
      <div class="pl-settings">
        <label class="pl-field"><span>Benchmark</span>
          <select id="pl-bench" class="sa-market-sel">${BENCHMARKS.map(b => `<option value="${esc(b.spec)}"${b.spec === s.benchmark ? ' selected' : ''}>${b.label}</option>`).join('')}
            <option value="__custom"${preset ? '' : ' selected'}>Custom / blend…</option></select>
        </label>
        <label class="pl-field" id="pl-bench-custom-wrap"${preset ? ' hidden' : ''}><span>Custom benchmark</span>
          <input id="pl-bench-custom" class="sa-ticker-inp" value="${preset ? '' : esc(s.benchmark)}" placeholder="VT or IOZ.AX:70,AGG:30"></label>
        <label class="pl-field"><span>Base currency</span>
          <select class="sa-market-sel" data-setting="base">${CURRENCIES.map(c => `<option${c === s.base ? ' selected' : ''}>${c}</option>`).join('')}</select></label>
        <label class="pl-field"><span>Between dates</span>
          <select class="sa-market-sel" data-setting="rebalance">${REBALANCE.map(([v, l]) => `<option value="${v}"${v === s.rebalance ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="pl-field"><span>Trading cost (bps)</span><input type="number" class="sa-ticker-inp pl-num-inp" data-setting="costBps" value="${s.costBps}" min="0" step="1"></label>
        <label class="pl-field"><span>Risk-free (% p.a.)</span><input type="number" class="sa-ticker-inp pl-num-inp" data-setting="rf" value="${s.rf}" step="0.25"></label>
        <label class="pl-field"><span>Portfolio value (${esc(s.base)})</span><input type="number" class="sa-ticker-inp pl-num-inp pl-aum" data-setting="aum" value="${s.aum}" min="0" step="10000"></label>
      </div>
      <div class="port-holdings-footer">
        <div id="pl-validate" class="pl-validate" role="status"></div>
        <button class="port-analyze-btn" data-action="run">Run backtest</button>
      </div>`;
    updateTotals();
  }

  function updateTotals() {
    const pf = active();
    pf.schedule.forEach((c, j) => {
      const t = colTotal(pf, c);
      const tot = builder.querySelector(`[data-total="${j}"]`), cash = builder.querySelector(`[data-cash="${j}"]`);
      if (tot) { tot.textContent = `${t.toFixed(1)}%`; tot.className = `num ${Math.abs(t - 100) < 0.05 ? 'up' : t > 100 ? 'dn' : ''}`; }
      if (cash) cash.textContent = `${(100 - t).toFixed(1)}%`;
    });
    const { errors, notes } = validate(pf);
    const el = builder.querySelector('#pl-validate');
    if (el) el.innerHTML = [...errors.map(e => `<span class="dn">${esc(e)}</span>`), ...notes.slice(0, 3).map(n => `<span>${esc(n)}</span>`),
      notes.length > 3 ? `<span>+${notes.length - 3} more columns not fully invested</span>` : ''].join('');
  }

  function renderAll() {
    renderWorkbar();
    renderBuilder();
    renderResults();
  }

  // ── Actions ──

  async function addAsset() {
    const pf = active();
    const errEl = builder.querySelector('#pl-add-err'), btn = builder.querySelector('[data-action="add-asset"]');
    const raw = builder.querySelector('#pl-ticker').value.trim().toUpperCase();
    if (!raw) { errEl.textContent = 'Enter a ticker'; return; }
    const suffix = builder.querySelector('#pl-market').value;
    const symbol = raw.includes('.') ? raw : raw + suffix;
    if (pf.assets.some(a => a.symbol === symbol)) { errEl.textContent = 'Already in the portfolio'; return; }
    btn.disabled = true; errEl.textContent = 'Looking up…';
    const info = await lookupSymbol(symbol);
    if (!alive) return;
    btn.disabled = false;
    if (!info) { errEl.textContent = `"${symbol}" not found`; return; }
    pf.assets.push({ symbol, display: symbol.replace(/\.[A-Z]+$/, ''), name: info.name, currency: info.currency });
    persist();
    renderBuilder();
    builder.querySelector('#pl-ticker')?.focus();
  }

  async function applyCsv() {
    const errEl = $('#pl-csv-err');
    let parsed;
    try { parsed = parseScheduleCsv($('#pl-csv-text').value); } catch (e) { errEl.textContent = e.message; return; }
    const pf = active();
    const known = new Set(pf.assets.map(a => a.symbol));
    const missing = parsed.symbols.filter(s => !known.has(s));
    errEl.textContent = missing.length ? `Looking up ${missing.length} ticker${missing.length > 1 ? 's' : ''}…` : '';
    const found = await Promise.all(missing.map(s => lookupSymbol(s)));
    if (!alive) return;
    const bad = missing.filter((_, i) => !found[i]);
    if (bad.length) { errEl.textContent = `Not found: ${bad.join(', ')}`; return; }
    missing.forEach((s, i) => pf.assets.push({ symbol: s, display: s.replace(/\.[A-Z]+$/, ''), name: found[i].name, currency: found[i].currency }));
    pf.schedule = parsed.rows
      .sort((x, y) => x.date.localeCompare(y.date))
      .map(r => ({ id: uid(), date: r.date, weights: r.weights }));
    persist();
    csvDialog.close();
    renderBuilder();
  }

  function exportScheduleCsv() {
    const pf = active();
    const lines = [['date', ...pf.assets.map(a => a.symbol)].join(',')];
    pf.schedule.forEach(c => lines.push([c.date, ...pf.assets.map(a => +c.weights[a.symbol] || 0)].join(',')));
    download(`${fileSafe(pf.name)}-schedule.csv`, lines.join('\n'));
  }

  const actions = {
    new() { const p = newPortfolio(); ws.portfolios.push(p); ws.activeId = p.id; persist(); renderAll(); },
    duplicate() {
      const p = normalisePortfolio(structuredClone(active()), { freshId: true });
      p.name = `${active().name} (copy)`; p.createdAt = Date.now();
      ws.portfolios.push(p); ws.activeId = p.id; persist(); renderAll();
    },
    delete() {
      const pf = active();
      if (!confirm(`Delete "${pf.name}"? This cannot be undone.`)) return;
      ws.portfolios = ws.portfolios.filter(p => p.id !== pf.id);
      if (!ws.portfolios.length) ws.portfolios.push(newPortfolio());
      ws.activeId = ws.portfolios[0].id;
      persist(); renderAll();
    },
    'export-json'() {
      const pf = active();
      download(`${fileSafe(pf.name)}.portfolio.json`, JSON.stringify({ format: 'portlab', version: 2, ...pf }, null, 2), 'application/json');
    },
    'import-json'() { importFile.value = ''; importFile.click(); },
    'add-asset': addAsset,
    'del-asset'(btn) {
      const pf = active(), sym = btn.dataset.sym;
      pf.assets = pf.assets.filter(a => a.symbol !== sym);
      pf.schedule.forEach(c => delete c.weights[sym]);
      persist(); renderBuilder();
    },
    'add-col'() {
      const pf = active(), last = pf.schedule[pf.schedule.length - 1];
      let date = E.shiftMonths(last.date, 3);
      if (date >= E.todayKey()) date = E.shiftKey(E.todayKey(), -1);
      pf.schedule.push({ id: uid(), date, weights: { ...last.weights } });
      pf.schedule.sort((x, y) => x.date.localeCompare(y.date));
      persist(); renderBuilder();
      builder.querySelector('.pl-sched-scroll')?.scrollTo({ left: 1e6, behavior: 'smooth' });
    },
    'del-col'(btn) { active().schedule.splice(+btn.dataset.col, 1); persist(); renderBuilder(); },
    normalise(btn) {
      const pf = active(), c = pf.schedule[+btn.dataset.col], t = colTotal(pf, c);
      if (!t) return;
      pf.assets.forEach(a => { if (c.weights[a.symbol]) c.weights[a.symbol] = +(c.weights[a.symbol] * 100 / t).toFixed(2); });
      persist(); renderBuilder();
    },
    equal(btn) {
      const pf = active(), c = pf.schedule[+btn.dataset.col];
      pf.assets.forEach(a => { c.weights[a.symbol] = +(100 / pf.assets.length).toFixed(2); });
      persist(); renderBuilder();
    },
    'csv-open'() { $('#pl-csv-err').textContent = ''; csvDialog.showModal(); },
    'csv-apply': applyCsv,
    'csv-export': exportScheduleCsv,
    run,
    view(btn) { ui.view = btn.dataset.value; renderResults(); },
    'perf-mode'(btn) { ui.perfMode = btn.dataset.value; markActive(btn); drawPerf(); },
    'weights-mode'(btn) { ui.weightsMode = btn.dataset.value; markActive(btn); drawWeights(); },
    'cal-mode'(btn) { ui.calMode = btn.dataset.value; markActive(btn); container.querySelector('#pl-monthly').innerHTML = monthlyTable(); },
    period(btn) { ui.period = btn.dataset.value; ui.from = ui.to = null; renderView(); },
    'trade-filter'(btn) { ui.tradeFilter = btn.dataset.value; renderView(); },
    'export-results': exportResults,
    'export-trades': exportTrades,
  };
  const markActive = btn => btn.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));

  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !ws || btn.disabled) return;
    actions[btn.dataset.action]?.(btn);
  });

  container.addEventListener('input', e => {
    const t = e.target;
    if (t.classList.contains('pl-cell')) {
      const c = active().schedule[+t.dataset.col];
      const v = parseFloat(t.value);
      if (Number.isFinite(v)) c.weights[t.dataset.sym] = v; else delete c.weights[t.dataset.sym];
      updateTotals(); persist();
    }
  });

  container.addEventListener('change', e => {
    const t = e.target, pf = ws && active();
    if (!pf) return;
    if (t.id === 'pl-pf-select') { ws.activeId = t.value; persist(); renderAll(); }
    else if (t.id === 'pl-name') { pf.name = t.value.trim() || 'Untitled portfolio'; persist(); renderWorkbar(); }
    else if (t.classList.contains('pl-date-inp')) {
      if (!E.isValidKey(t.value)) { updateTotals(); return; }
      pf.schedule[+t.dataset.col].date = t.value;
      pf.schedule.sort((x, y) => x.date.localeCompare(y.date));
      persist(); renderBuilder();
    } else if (t.id === 'pl-bench') {
      const custom = t.value === '__custom';
      builder.querySelector('#pl-bench-custom-wrap').hidden = !custom;
      if (custom) builder.querySelector('#pl-bench-custom').focus();
      else { pf.settings.benchmark = t.value; persist(); updateTotals(); }
    } else if (t.id === 'pl-bench-custom') {
      pf.settings.benchmark = t.value.trim().toUpperCase(); persist(); updateTotals();
    } else if (t.dataset.setting) {
      const key = t.dataset.setting;
      pf.settings[key] = ['costBps', 'rf', 'aum'].includes(key) ? (parseFloat(t.value) || 0) : t.value;
      persist();
      if (key === 'base') renderBuilder();
    } else if (t.id === 'pl-attr-from' || t.id === 'pl-attr-to') {
      ui.period = 'custom';
      ui.from = container.querySelector('#pl-attr-from').value || null;
      ui.to = container.querySelector('#pl-attr-to').value || null;
      renderView();
    }
  });

  container.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'pl-ticker') addAsset();
  });

  importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const p = normalisePortfolio(JSON.parse(await file.text()), { freshId: true });
      ws.portfolios.push(p); ws.activeId = p.id; persist(); renderAll();
    } catch (e) {
      alert(`Could not import that file: ${e.message}`);
    }
  });

  // ── Backtest run ──

  async function run() {
    const pf = active();
    const { errors } = validate(pf);
    if (errors.length) { updateTotals(); return; }
    abortCtrl?.abort();
    abortCtrl = new AbortController();
    const { signal } = abortCtrl;
    const runBtn = builder.querySelector('[data-action="run"]');
    runBtn.disabled = true;
    clearView();
    resultsEl.innerHTML = `<div class="port-msg port-loading"><div class="sa-spinner"></div><span id="pl-progress">Fetching price history…</span></div>`;

    const s = pf.settings;
    const symbols = pf.assets.map(a => a.symbol);
    const benchLegs = E.parseBenchmark(s.benchmark);
    const schedule = [...pf.schedule].sort((x, y) => x.date.localeCompare(y.date));
    const inception = schedule[0].date;
    const fromKey = E.shiftKey(inception < HISTORY_FROM ? inception : HISTORY_FROM, -10);
    const universe = [...new Set([...symbols, ...benchLegs.map(l => l.symbol)])];

    try {
      const uni = await loadUniverse({
        symbols: universe, base: s.base, fromKey, signal,
        onProgress: (d, n) => { const p = container.querySelector('#pl-progress'); if (p) p.textContent = `Fetching price history… ${d}/${n}`; },
      });
      if (!alive || signal.aborted) return;
      if (uni.failed.length) throw new Error(`Could not load price history for: ${uni.failed.join(', ')}`);

      // Fill in currencies that legacy portfolios did not record.
      pf.assets.forEach(a => { if (!a.currency) a.currency = uni.histories.get(a.symbol)?.currency ?? ''; });

      const panelData = E.buildPanel({ symbols, benchLegs, histories: uni.histories, fx: uni.fx, base: s.base, fromKey });
      const opts = { symbols, schedule, rebalance: s.rebalance, costBps: s.costBps, rf: s.rf / 100 };
      const bt = E.backtest(panelData, opts);
      const policy = E.backtest(panelData, { ...opts, schedule: [schedule[0]], rebalance: 'none', costBps: 0 });
      const bench = E.benchmarkSlice(panelData, bt.t0);
      const rf = s.rf / 100;
      result = {
        pfId: pf.id, name: pf.name, ranAt: Date.now(),
        settings: { ...s }, assets: pf.assets.map(a => ({ ...a })),
        benchLabel: BENCHMARKS.find(b => b.spec === s.benchmark)?.label ?? s.benchmark,
        panel: panelData, bt, policy, bench, rf,
        stats: E.perfStats(bt.ret, bench.ret, rf),
        roll: E.rolling(bt.ret, bench.ret, rf, ROLL_WIN),
        attrAll: E.attribution(panelData, bt, 0, bt.dates.length - 1),
        warnings: [...panelData.warnings, ...bt.warnings],
      };
      if (!result.stats) throw new Error('Not enough history after the inception date — need at least a week of prices.');
      ui.period = 'all'; ui.from = ui.to = null;
      persist();
      result.ranAt = active().updatedAt;
      renderResults();
    } catch (e) {
      if (e.name === 'AbortError' || !alive) return;
      result = null;
      resultsEl.innerHTML = `<div class="port-msg port-err">${esc(e.message || 'Backtest failed.')}</div>`;
    } finally {
      if (alive) builder.querySelector('[data-action="run"]')?.removeAttribute('disabled');
    }
  }

  // ── Results shell ──

  function renderResults() {
    clearView();
    const pf = active();
    if (!result || result.pfId !== pf.id) {
      resultsEl.innerHTML = `<div class="pl-empty">
        <div class="pl-empty-title">Run the backtest to analyse “${esc(pf.name)}”.</div>
        <div class="pl-empty-body">You'll get performance against the benchmark, weights and trades through time, NAV-linked return attribution with currency effects, and ex-ante risk with historical stress tests.</div>
      </div>`;
      return;
    }
    const { bt, settings: s } = result;
    resultsEl.innerHTML = `
      <div class="pl-results-head">
        <div class="pl-subtabs" role="tablist">${VIEWS.map(([v, l]) =>
          `<button class="pl-subtab${v === ui.view ? ' active' : ''}" role="tab" aria-selected="${v === ui.view}" data-action="view" data-value="${v}">${l}</button>`).join('')}</div>
        <div class="pl-run-meta">
          <span>${shortDate(bt.dates[0])} → ${shortDate(bt.dates[bt.dates.length - 1])}</span>
          <span>${esc(s.base)} · vs ${esc(result.benchLabel)}</span>
          <span class="pl-stale" id="pl-stale"${active().updatedAt > result.ranAt ? '' : ' hidden'}>Schedule edited since this run — <button class="pl-link" data-action="run">re-run</button></span>
          <button class="ghost-btn pl-sm" data-action="export-results">Export series CSV</button>
        </div>
      </div>
      ${result.warnings.length ? `<div class="pl-warn">${result.warnings.map(w => `<div>⚠ ${esc(w)}</div>`).join('')}</div>` : ''}
      <div id="pl-view" class="pl-view"></div>`;
    renderView();
  }

  function renderView() {
    clearView();
    const el = container.querySelector('#pl-view');
    if (!el || !result) return;
    ({ overview: overviewView, attribution: attributionView, trading: tradingView, risk: riskView })[ui.view](el);
  }

  // ── Overview ──

  function overviewView(el) {
    const { stats: s } = result;
    el.innerHTML = `
      <div class="pl-kpis">
        <div class="pl-kpi-group"><div class="pl-kpi-title">Absolute</div><div class="pl-kpi-row">
          ${kpi('Total return', fmt.pct(s.total), { cls: fmt.cls(s.total), sub: `Bench ${fmt.pct(s.btotal)}` })}
          ${kpi('CAGR', fmt.pct(s.cagr), { cls: fmt.cls(s.cagr), sub: `Bench ${fmt.pct(s.bcagr)}` })}
          ${kpi('Volatility', fmt.pctU(s.vol), { sub: `Bench ${fmt.pctU(s.bvol)}` })}
          ${kpi('Sharpe', fmt.num(s.sharpe), { sub: `Sortino ${fmt.num(s.sortino)}` })}
          ${kpi('Max drawdown', fmt.pct(-s.maxDD), { cls: 'dn', sub: `Bench ${fmt.pct(-s.bMaxDD)}` })}
          ${kpi('Calmar', fmt.num(s.calmar), { sub: `${s.years.toFixed(1)} yrs of data` })}
        </div></div>
        <div class="pl-kpi-group"><div class="pl-kpi-title">Relative to benchmark</div><div class="pl-kpi-row">
          ${kpi('Active return p.a.', fmt.pct(s.activeCagr), { cls: fmt.cls(s.activeCagr) })}
          ${kpi('Tracking error', fmt.pctU(s.te))}
          ${kpi('Information ratio', fmt.num(s.ir), { cls: fmt.cls(s.ir) })}
          ${kpi('Beta', fmt.num(s.beta), { sub: `Correlation ${fmt.num(s.corr)}` })}
          ${kpi('Alpha p.a.', fmt.pct(s.alpha), { cls: fmt.cls(s.alpha), sub: 'Jensen, daily' })}
          ${kpi('Up / down capture', `${fmt.num(s.upCap * 100, 0)} / ${fmt.num(s.downCap * 100, 0)}`, { sub: 'Daily, % of benchmark' })}
        </div></div>
      </div>
      ${panel('Performance', `<div class="pl-lw-legend" id="pl-perf-legend"></div><div class="pl-lw" id="pl-perf"></div>
        <p class="pl-note">Total return in ${esc(result.settings.base)} after trading costs. ▼ marks scheduled rebalances. Rolling statistics use a ${ROLL_WIN}-day window.</p>`,
        { tools: seg('perf-mode', PERF_MODES, ui.perfMode) })}
      ${panel('Weights through time', `<div id="pl-weights" class="pl-chart"></div>
        <p class="pl-note">Actual shows drifted end-of-day weights; target shows the policy in force. Vertical rules are scheduled rebalances.</p>`,
        { tools: seg('weights-mode', [['actual', 'Actual'], ['target', 'Target']], ui.weightsMode) })}
      ${panel('Current positioning', positioningTable())}
      ${panel('Monthly returns', `<div id="pl-monthly" class="pl-table-scroll">${monthlyTable()}</div>`,
        { tools: seg('cal-mode', [['p', 'Portfolio'], ['b', 'Benchmark'], ['a', 'Active']], ui.calMode) })}`;
    drawPerf();
    drawWeights();
  }

  async function drawPerf() {
    perfCleanup?.(); perfCleanup = null;
    const host = container.querySelector('#pl-perf'), legend = container.querySelector('#pl-perf-legend');
    if (!host) return;
    const { createChart } = await import('lightweight-charts');
    if (!host.isConnected) return;
    host.innerHTML = '';
    const th = chartTheme();
    const { bt, bench, policy, roll } = result;
    const dates = bt.dates, mode = ui.perfMode;
    const isPct = !['growth', 'beta', 'sharpe'].includes(mode);
    const format = v => isPct ? `${v.toFixed(1)}%` : v.toFixed(mode === 'growth' ? 1 : 2);

    const chart = createChart(host, {
      autoSize: true,
      layout: { background: { color: 'transparent' }, textColor: th.text, fontSize: th.fontSize, fontFamily: th.mono },
      grid: { vertLines: { color: th.grid }, horzLines: { color: th.grid } },
      rightPriceScale: { borderColor: th.border },
      timeScale: { borderColor: th.border },
      localization: { priceFormatter: format },
      crosshair: { mode: 0 },
    });
    const lines = [];
    const add = (label, color, values, style = 0, width = th.lineWidth) => {
      const series = chart.addLineSeries({ color, lineWidth: width, lineStyle: style, priceLineVisible: false, crosshairMarkerRadius: 4 });
      series.setData(dates.map((d, k) => ok(values[k]) ? { time: d, value: values[k] } : { time: d }));
      lines.push({ label, color, series, values, style });
      return series;
    };
    const map = (arr, f) => Array.from(arr, f);

    if (mode === 'growth') {
      const port = add('Portfolio', th.accent, map(bt.nav, v => v * 100));
      add(result.benchLabel, th.text, map(bench.nav, v => v * 100), 2, 1.5);
      add('Inception weights, buy & hold', th.faint, map(policy.nav, v => v * 100), 1, 1.5);
      port.setMarkers(bt.trades.filter(t => t.type === 'scheduled').map(t => ({ time: t.date, position: 'aboveBar', color: th.accent, shape: 'arrowDown' })));
    } else if (mode === 'drawdown') {
      add('Portfolio', th.accent, map(E.drawdownSeries(bt.nav), v => v * 100));
      add(result.benchLabel, th.text, map(E.drawdownSeries(bench.nav), v => v * 100), 2, 1.5);
    } else if (mode === 'active') {
      const rel = map(bt.nav, (v, k) => (v / bench.nav[k] - 1) * 100);
      const s = chart.addBaselineSeries({
        baseValue: { type: 'price', price: 0 }, lineWidth: th.lineWidth, priceLineVisible: false,
        topLineColor: th.up, topFillColor1: alpha(th.up, 0.28), topFillColor2: alpha(th.up, 0.04),
        bottomLineColor: th.down, bottomFillColor1: alpha(th.down, 0.04), bottomFillColor2: alpha(th.down, 0.28),
      });
      s.setData(dates.map((d, k) => ({ time: d, value: rel[k] })));
      lines.push({ label: 'Relative wealth vs benchmark', color: th.up, series: s, values: rel });
    } else if (mode === 'vol') {
      add('Portfolio', th.accent, map(roll.vol, v => v * 100));
      add(result.benchLabel, th.text, map(roll.bvol, v => v * 100), 2, 1.5);
    } else if (mode === 'beta') {
      add('Portfolio beta', th.accent, roll.beta);
    } else if (mode === 'sharpe') {
      add('Portfolio', th.accent, roll.sharpe);
      add(result.benchLabel, th.text, roll.bsharpe, 2, 1.5);
    } else if (mode === 'te') {
      add('Tracking error', th.accent, map(roll.te, v => v * 100));
    }
    chart.timeScale().fitContent();

    const paintLegend = k => {
      legend.innerHTML = `<span class="pl-lw-date">${shortDate(dates[k])}</span>` + lines.map(l =>
        `<span class="pl-legend-item"><i class="${l.style ? 'dash' : ''}" style="--c:${l.color}"></i>${esc(l.label)} <b>${ok(l.values[k]) ? format(l.values[k]) : '—'}</b></span>`).join('');
    };
    paintLegend(dates.length - 1);
    const onMove = p => {
      const k = p.time ? E.indexAtOrBefore(dates, typeof p.time === 'string' ? p.time : `${p.time.year}-${String(p.time.month).padStart(2, '0')}-${String(p.time.day).padStart(2, '0')}`) : -1;
      paintLegend(k >= 0 ? k : dates.length - 1);
    };
    chart.subscribeCrosshairMove(onMove);
    perfCleanup = () => { chart.unsubscribeCrosshairMove(onMove); chart.remove(); };
  }

  function drawWeights() {
    const host = container.querySelector('#pl-weights');
    if (!host) return;
    const th = chartTheme();
    const { bt, assets } = result;
    const src = ui.weightsMode === 'target' ? bt.TW : bt.W;
    const L = bt.dates.length;
    const series = [];
    const other = new Float64Array(L);
    assets.forEach((a, i) => {
      if (i < MAX_SERIES) series.push({ label: a.display, color: colourFor(i, th), values: src[i] });
      else for (let k = 0; k < L; k++) other[k] += src[i][k];
    });
    if (assets.length > MAX_SERIES) series.push({ label: 'Other', color: th.other, values: other });
    const cash = ui.weightsMode === 'target'
      ? Float64Array.from({ length: L }, (_, k) => 1 - src.reduce((s, w) => s + w[k], 0))
      : bt.cashW;
    if (cash.some(v => Math.abs(v) > 5e-4)) series.push({ label: 'Cash', color: th.faint, values: cash });
    const cleanup = timeChart(host, {
      dates: bt.dates, series, stacked: true, height: 280,
      fmt: v => `${(v * 100).toFixed(1)}%`,
      rules: bt.trades.filter(t => t.type === 'scheduled').map(t => ({ index: t.k, label: `Rebalance ${t.date}` })),
    });
    viewCleanups.push(cleanup);
  }

  function positioningTable() {
    const { bt, assets, attrAll, panel: p, settings: s } = result;
    const last = bt.dates.length - 1, t = bt.t0 + last;
    const th = chartTheme();
    const rows = assets.map((a, i) => {
      const w = bt.W[i][last], tw = bt.TW[i][last], r = attrAll.rows[i];
      return `<tr>
        <td class="mkt-name"><span class="pl-swatch" style="background:${colourFor(i, th)}"></span>${esc(a.display)} <span class="pl-asset-meta">${esc(a.name)}</span></td>
        <td>${esc(a.currency)}</td>
        <td class="num">${fmt.num(p.assets.get(a.symbol).priceBase[t])}</td>
        <td class="num">${fmt.pctU(tw)}</td>
        <td class="num">${fmt.pctU(w)}</td>
        <td class="num ${Math.abs(w - tw) > 0.02 ? 'dn' : ''}">${fmt.pct(w - tw, 1)}</td>
        <td class="num">${fmt.money(w * bt.nav[last] * s.aum, s.base)}</td>
        <td class="num ${fmt.cls(r.ret)}">${fmt.pct(r.ret)}</td>
        <td class="num ${fmt.cls(r.contrib)}">${fmt.pct(r.contrib)}</td>
      </tr>`;
    }).join('');
    const cashW = bt.cashW[last];
    return `<div class="pl-table-scroll"><table class="mkt-table pl-table">
      <thead><tr><th>Asset</th><th>Ccy</th><th class="num">Price (${esc(s.base)})</th><th class="num">Target</th><th class="num">Actual</th>
        <th class="num">Drift</th><th class="num">Market value</th><th class="num">Return since inception</th><th class="num">Contribution</th></tr></thead>
      <tbody>${rows}
        <tr class="pl-sub-row"><td class="mkt-name">Cash</td><td>${esc(s.base)}</td><td></td><td></td><td class="num">${fmt.pctU(cashW)}</td><td></td>
          <td class="num">${fmt.money(cashW * bt.nav[last] * s.aum, s.base)}</td><td></td><td class="num ${fmt.cls(attrAll.cash)}">${fmt.pct(attrAll.cash)}</td></tr>
      </tbody>
      <tfoot><tr class="pl-total-row"><td>Total</td><td></td><td></td><td></td><td class="num">100.0%</td><td></td>
        <td class="num">${fmt.money(bt.nav[last] * s.aum, s.base)}</td><td></td><td class="num ${fmt.cls(attrAll.total)}">${fmt.pct(attrAll.total)}</td></tr></tfoot>
    </table></div>
    <p class="pl-note">Market value scales ${fmt.money(s.aum, s.base)} invested at inception. Contribution is NAV-linked and sums to the total including trading costs (${fmt.pct(attrAll.cost)}).</p>`;
  }

  function monthlyTable() {
    const { bt, bench } = result;
    const rows = E.monthlyReturns(bt.dates, bt.nav, bench.nav);
    const pick = (p, b) => p == null ? null : ui.calMode === 'p' ? p : ui.calMode === 'b' ? b : p - b;
    const heat = v => {
      if (!ok(v)) return '';
      const a = Math.min(1, Math.abs(v) / 0.08) * 0.55 + 0.05;
      return ` class="num pl-heat ${v >= 0 ? 'up' : 'dn'}" style="--heat:${(a * 100).toFixed(0)}%"`;
    };
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `<table class="mkt-table pl-table pl-cal">
      <thead><tr><th>Year</th>${months.map(m => `<th class="num">${m}</th>`).join('')}<th class="num">Year</th><th class="num">Bench</th><th class="num">Active</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td class="mkt-name">${r.year}</td>
        ${r.p.map((p, m) => { const v = pick(p, r.b[m]); return `<td${heat(v) || ' class="num"'}>${v == null ? '' : (v * 100).toFixed(1)}</td>`; }).join('')}
        <td class="num pl-strong ${fmt.cls(pick(r.py, r.by))}">${fmt.pct(pick(r.py, r.by), 1)}</td>
        <td class="num">${fmt.pct(r.by, 1)}</td>
        <td class="num ${fmt.cls(r.py - r.by)}">${fmt.pct(r.py - r.by, 1)}</td></tr>`).join('')}</tbody>
    </table>`;
  }

  // ── Attribution ──

  function bridge(steps) {
    // steps: [{ label, value, total? }] — totals are drawn from zero, steps from the running sum.
    let run = 0;
    const bars = steps.map(st => {
      const start = st.total ? 0 : run, end = st.total ? st.value : run + st.value;
      if (!st.total) run = end;
      return { ...st, start, end };
    });
    const lo = Math.min(0, ...bars.map(b => Math.min(b.start, b.end)));
    const hi = Math.max(0, ...bars.map(b => Math.max(b.start, b.end)));
    const span = hi - lo || 1;
    const pos = v => (v - lo) / span * 100;
    return `<div class="pl-bridge">${bars.map(b => {
      const left = pos(Math.min(b.start, b.end)), width = Math.max(0.4, Math.abs(pos(b.end) - pos(b.start)));
      const kind = b.total ? 'total' : b.value >= 0 ? 'up' : 'dn';
      return `<div class="pl-bridge-row${b.total ? ' is-total' : ''}">
        <div class="pl-bridge-label">${b.label}</div>
        <div class="pl-bridge-track"><span class="pl-bridge-zero" style="left:${pos(0)}%"></span>
          <span class="pl-bridge-bar ${kind}" style="left:${left}%;width:${width}%"></span></div>
        <div class="pl-bridge-val ${b.total ? '' : fmt.cls(b.value)}">${fmt.pct(b.value)}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function attributionView(el) {
    const { bt, panel: p, policy, bench, rf, assets, settings: s } = result;
    const [a, b] = E.windowBounds(bt.dates, ui.period, ui.from, ui.to);
    const at = E.attribution(p, bt, a, b);
    const dc = E.decompose(bt, policy, bench, rf, a, b);
    const hasFx = assets.some(x => x.currency && x.currency !== s.base);
    const th = chartTheme();

    const rows = [...at.rows].sort((x, y) => y.contrib - x.contrib);
    const ext = Math.max(1e-9, ...rows.map(r => Math.abs(r.contrib)), Math.abs(at.cost), Math.abs(at.cash));
    const cbar = v => `<div class="pl-cbar"><span class="pl-cbar-mid"></span><span class="pl-cbar-fill ${v >= 0 ? 'up' : 'dn'}" style="${v >= 0 ? 'left:50%' : `right:50%`};width:${Math.abs(v) / ext * 50}%"></span></div>`;
    const share = v => at.total !== 0 && Math.abs(at.total) > 1e-4 ? `${(v / at.total * 100).toFixed(0)}%` : '—';

    el.innerHTML = `
      <div class="mkt-panel pl-window">
        ${seg('period', PERIODS, ui.period)}
        <div class="pl-window-dates">
          <label class="pl-field pl-field-inline"><span>From</span><input type="date" id="pl-attr-from" class="pl-date-inp" value="${bt.dates[a]}" min="${bt.dates[0]}" max="${bt.dates[bt.dates.length - 1]}"></label>
          <label class="pl-field pl-field-inline"><span>To</span><input type="date" id="pl-attr-to" class="pl-date-inp" value="${bt.dates[b]}" min="${bt.dates[0]}" max="${bt.dates[bt.dates.length - 1]}"></label>
        </div>
        <div class="pl-window-sum">
          <span>Portfolio <b class="${fmt.cls(dc.total)}">${fmt.pct(dc.total)}</b></span>
          <span>Benchmark <b class="${fmt.cls(dc.benchTotal)}">${fmt.pct(dc.benchTotal)}</b></span>
          <span>Active <b class="${fmt.cls(dc.active)}">${fmt.pct(dc.active)}</b></span>
        </div>
      </div>
      <div class="mkt-two-col mkt-section">
        ${panel('Market vs. specific', `${bridge([
          { label: 'Risk-free rate', value: dc.rfPart },
          { label: `Market exposure (β ${dc.beta.toFixed(2)})`, value: dc.mktPart },
          { label: 'Specific / alpha', value: dc.specPart },
          { label: 'Portfolio', value: dc.total, total: true },
          { label: 'Benchmark', value: dc.benchTotal, total: true },
        ])}<p class="pl-note">CAPM fitted over the window: what the portfolio earned from its beta to the benchmark, and what it earned beyond it.</p>`)}
        ${panel('Policy vs. trading', `${bridge([
          { label: 'Inception weights, untouched', value: dc.policyTotal },
          { label: 'Rebalancing & allocation changes', value: dc.tradingPart },
          { label: 'Trading costs', value: dc.costPart },
          { label: 'Portfolio', value: dc.total, total: true },
        ])}<p class="pl-note">Value added by every trade after inception, against simply holding the starting allocation.</p>`)}
      </div>
      ${panel('Contribution to return', `<div class="pl-table-scroll"><table class="mkt-table pl-table">
        <thead><tr><th>Asset</th><th class="num">Avg weight</th><th class="num">Return (${esc(s.base)})</th><th class="num">Contribution</th><th class="pl-cbar-col"></th>
          ${hasFx ? '<th class="num">Local market</th><th class="num">Currency</th>' : ''}<th class="num">Share</th></tr></thead>
        <tbody>${rows.map(r => `<tr>
          <td class="mkt-name"><span class="pl-swatch" style="background:${colourFor(r.i, th)}"></span>${esc(assets[r.i].display)}</td>
          <td class="num">${fmt.pctU(r.avgW)}</td>
          <td class="num ${fmt.cls(r.ret)}">${fmt.pct(r.ret)}</td>
          <td class="num ${fmt.cls(r.contrib)}">${fmt.pct(r.contrib)}</td>
          <td class="pl-cbar-col">${cbar(r.contrib)}</td>
          ${hasFx ? `<td class="num ${fmt.cls(r.local)}">${fmt.pct(r.local)}</td><td class="num ${fmt.cls(r.fx)}">${fmt.pct(r.fx)}</td>` : ''}
          <td class="num">${share(r.contrib)}</td></tr>`).join('')}
          <tr class="pl-sub-row"><td class="mkt-name">Cash &amp; financing</td><td></td><td></td><td class="num ${fmt.cls(at.cash)}">${fmt.pct(at.cash)}</td><td class="pl-cbar-col">${cbar(at.cash)}</td>${hasFx ? '<td></td><td></td>' : ''}<td class="num">${share(at.cash)}</td></tr>
          <tr class="pl-sub-row"><td class="mkt-name">Trading costs</td><td></td><td></td><td class="num ${fmt.cls(at.cost)}">${fmt.pct(at.cost)}</td><td class="pl-cbar-col">${cbar(at.cost)}</td>${hasFx ? '<td></td><td></td>' : ''}<td class="num">${share(at.cost)}</td></tr>
        </tbody>
        <tfoot><tr class="pl-total-row"><td>Portfolio</td><td></td><td></td><td class="num ${fmt.cls(at.total)}">${fmt.pct(at.total)}</td><td></td>
          ${hasFx ? `<td class="num">${fmt.pct(at.rows.reduce((t, r) => t + r.local, 0))}</td><td class="num">${fmt.pct(at.rows.reduce((t, r) => t + r.fx, 0))}</td>` : ''}<td class="num">100%</td></tr></tfoot>
      </table></div>
      <p class="pl-note">NAV-linked: each day's weight × return is scaled by the portfolio's value at the prior close, so contributions add up exactly to the window return.${hasFx ? ` Currency is the part of each asset's ${esc(s.base)} return that came from its currency moving against the ${esc(s.base)}.` : ''}</p>`)}
      ${panel('Cumulative contribution', `<div id="pl-cum" class="pl-chart"></div>`)}`;

    const dates = bt.dates.slice(a, b + 1);
    const series = assets.slice(0, MAX_SERIES).map((x, i) => ({ label: x.display, color: colourFor(i, th), values: at.paths[i] }));
    if (assets.length > MAX_SERIES) {
      const other = new Float64Array(dates.length);
      at.paths.slice(MAX_SERIES).forEach(pth => pth.forEach((v, k) => { other[k] += v; }));
      series.push({ label: 'Other', color: th.other, values: other });
    }
    const total = Float64Array.from(dates, (_, k) => bt.nav[a + k] / bt.nav[a] - 1);
    series.push({ label: 'Portfolio', color: th.ink, values: total, dash: true });
    viewCleanups.push(timeChart(el.querySelector('#pl-cum'), { dates, series, height: 300, fmt: v => fmt.pct(v, 1) }));
  }

  // ── Trading ──

  function tradingView(el) {
    const { bt, panel: p, assets, settings: s, attrAll, stats } = result;
    const th = chartTheme();
    const later = bt.trades.filter(t => t.type !== 'initial');
    const sched = later.filter(t => t.type === 'scheduled'), cal = later.filter(t => t.type === 'calendar');
    const turnoverPa = later.reduce((x, t) => x + t.turnover, 0) / Math.max(stats.years, 1 / 12);
    const lastTrade = later[later.length - 1];
    const shown = bt.trades.filter(t => ui.tradeFilter === 'all' || t.type !== 'calendar');
    const value = (t, leg) => Math.abs(leg.delta) * t.nav * s.aum;
    const LIMIT = 600;
    let legCount = 0;

    const blotter = shown.slice().reverse().map(t => {
      if (legCount >= LIMIT) return '';
      const legs = [...t.legs].sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
      legCount += legs.length;
      const buys = legs.filter(l => l.delta > 0).reduce((x, l) => x + l.delta, 0), sells = legs.filter(l => l.delta < 0).reduce((x, l) => x - l.delta, 0);
      return `<tbody class="pl-trade-group">
        <tr class="pl-trade-head"><td colspan="2"><b>${shortDate(t.date)}</b> <span class="pl-tag ${t.type}">${t.type === 'initial' ? 'Initial' : t.type === 'scheduled' ? 'Scheduled' : 'Calendar'}</span></td>
          <td class="num">Buys ${fmt.pctU(buys)}</td><td class="num">Sells ${fmt.pctU(sells)}</td>
          <td class="num">Turnover ${fmt.pctU(t.turnover)}</td><td class="num">Cost ${fmt.money(t.cost * t.nav * s.aum, s.base)}</td><td></td></tr>
        ${legs.map(l => {
          const px = p.assets.get(l.symbol).priceBase[bt.t0 + t.k];
          const v = value(t, l);
          return `<tr><td class="mkt-name"><span class="pl-swatch" style="background:${colourFor(l.i, th)}"></span>${esc(assets[l.i].display)}</td>
            <td class="${l.delta > 0 ? 'up' : 'dn'}">${l.delta > 0 ? 'Buy' : 'Sell'}</td>
            <td class="num">${fmt.pctU(l.from)}</td><td class="num">${fmt.pctU(l.to)}</td>
            <td class="num ${fmt.cls(l.delta)}">${fmt.pct(l.delta)}</td>
            <td class="num">${fmt.money(v, s.base)}</td>
            <td class="num">${ok(px) && px > 0 ? Math.round(v / px).toLocaleString('en-US') : '—'}</td></tr>`;
        }).join('')}</tbody>`;
    }).join('');

    el.innerHTML = `
      <div class="pl-kpis"><div class="pl-kpi-group"><div class="pl-kpi-row">
        ${kpi('Rebalances', `${sched.length}`, { sub: cal.length ? `+ ${cal.length} calendar` : 'No calendar resets' })}
        ${kpi('Turnover p.a.', fmt.pctU(turnoverPa), { sub: 'One-way, excl. initial' })}
        ${kpi('Avg. per rebalance', fmt.pctU(later.length ? later.reduce((x, t) => x + t.turnover, 0) / later.length : null))}
        ${kpi('Trading costs', fmt.bps(-attrAll.cost), { sub: `${s.costBps} bps per unit traded` })}
        ${kpi('Last rebalance', lastTrade ? shortDate(lastTrade.date) : '—', { sub: lastTrade ? `${Math.round((E.keyToUtc(bt.dates[bt.dates.length - 1]) - E.keyToUtc(lastTrade.date)) / 864e5)} days ago` : '' })}
        ${kpi('Positions', `${assets.length}`, { sub: `${bt.trades.reduce((x, t) => x + t.legs.length, 0)} trade tickets` })}
      </div></div></div>
      ${panel('Trades through time', `<div id="pl-turnover" class="pl-chart"></div>
        <p class="pl-note">Weight bought (up) and sold (down) at each rebalance, as a share of NAV. Hover a bar for the tickets.</p>`)}
      ${panel('Trade blotter', `<div class="pl-table-scroll"><table class="mkt-table pl-table pl-blotter">
          <thead><tr><th>Asset</th><th>Side</th><th class="num">From</th><th class="num">To</th><th class="num">Δ weight</th><th class="num">Est. value (${esc(s.base)})</th><th class="num">Est. units</th></tr></thead>
          ${blotter}
        </table></div>
        ${legCount >= LIMIT ? `<p class="pl-note">Showing the most recent ${LIMIT} tickets — export for the full list.</p>` : ''}
        <p class="pl-note">Values scale ${fmt.money(s.aum, s.base)} at inception through the portfolio's NAV. Units use the unadjusted close converted to ${esc(s.base)}.</p>`,
        { tools: `${seg('trade-filter', [['scheduled', 'Scheduled'], ['all', 'Incl. calendar']], ui.tradeFilter)}<button class="ghost-btn pl-sm" data-action="export-trades">Export CSV</button>` })}`;

    const events = later.map(t => {
      const up = t.legs.filter(l => l.delta > 0).reduce((x, l) => x + l.delta, 0);
      const down = t.legs.filter(l => l.delta < 0).reduce((x, l) => x - l.delta, 0);
      const top = [...t.legs].sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta)).slice(0, 5);
      return {
        index: t.k, up, down,
        html: `<div class="pl-tip-date">${shortDate(t.date)} · ${t.type}</div>
          ${top.map(l => `<div class="pl-tip-row"><i style="background:${colourFor(l.i, th)}"></i><span>${esc(assets[l.i].display)}</span><b>${fmt.pct(l.delta, 1)}</b></div>`).join('')}
          ${t.legs.length > 5 ? `<div class="pl-tip-row"><span>+${t.legs.length - 5} more</span></div>` : ''}
          <div class="pl-tip-row pl-tip-total"><span>Turnover</span><b>${fmt.pctU(t.turnover)}</b></div>`,
      };
    });
    if (events.length) viewCleanups.push(eventBars(el.querySelector('#pl-turnover'), { dates: bt.dates, events, fmt: v => `${(v * 100).toFixed(0)}%` }));
    else el.querySelector('#pl-turnover').innerHTML = `<div class="port-empty">No trades after inception — add rebalance dates or a calendar policy.</div>`;
  }

  // ── Risk ──

  function riskView(el) {
    const { bt, panel: p, assets, stats, settings: s } = result;
    const last = bt.dates.length - 1;
    const weights = bt.W.map(w => w[last]);
    const symbols = assets.map(a => a.symbol);
    const th = chartTheme();
    const dds = E.drawdownEpisodes(bt.nav);
    const stress = E.stressTests(p, symbols, weights);
    const value = bt.nav[last] * s.aum;

    el.innerHTML = `
      <div class="mkt-panel pl-window">
        <span class="pl-note pl-inline">Ex-ante risk on current (drifted) weights, EWMA covariance over the last 3 years.</span>
        <div class="port-hl-ctrl">
          <span class="port-hl-label">Half-life</span>
          <input type="range" id="pl-hl" class="port-hl-slider" min="10" max="252" value="${halfLife}" step="1" aria-label="EWMA half-life in days">
          <span id="pl-hl-val" class="port-hl-val">${halfLife}d</span>
        </div>
      </div>
      <div id="pl-risk-live"></div>
      <div class="mkt-two-col mkt-section">
        ${panel('Worst drawdowns', `<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Peak</th><th>Trough</th><th>Recovered</th><th class="num">Depth</th><th class="num">Days to trough</th><th class="num">Days to recover</th></tr></thead>
          <tbody>${dds.length ? dds.map(d => `<tr><td>${shortDate(bt.dates[d.start])}</td><td>${shortDate(bt.dates[d.trough])}</td>
            <td>${d.end != null ? shortDate(bt.dates[d.end]) : '<span class="dn">Not yet</span>'}</td>
            <td class="num dn">${fmt.pct(d.depth)}</td><td class="num">${d.trough - d.start}</td><td class="num">${d.end != null ? d.end - d.trough : '—'}</td></tr>`).join('')
            : '<tr><td colspan="6" class="port-empty">No drawdowns in the period.</td></tr>'}</tbody>
        </table></div><p class="pl-note">Realised: 1-day historical VaR 95% ${fmt.pctU(stats.var95)}, CVaR ${fmt.pctU(stats.cvar95)}. Skew ${fmt.num(stats.skew)}, excess kurtosis ${fmt.num(stats.kurt)}.</p>`)}
        ${panel('Historical stress tests', `<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Scenario</th><th>Window</th><th class="num">Portfolio</th><th class="num">Benchmark</th><th class="num">Active</th><th class="num">P&amp;L</th></tr></thead>
          <tbody>${stress.map(x => x.available ? `<tr><td class="mkt-name">${x.name}${x.missing.length ? ` <span class="pl-asset-meta" title="No history for ${esc(x.missing.join(', '))}">partial</span>` : ''}</td>
            <td class="pl-asset-meta">${shortDate(x.from)} – ${shortDate(x.to)}</td>
            <td class="num ${fmt.cls(x.port)}">${fmt.pct(x.port, 1)}</td><td class="num ${fmt.cls(x.bench)}">${fmt.pct(x.bench, 1)}</td>
            <td class="num ${fmt.cls(x.active)}">${fmt.pct(x.active, 1)}</td><td class="num ${fmt.cls(x.port)}">${fmt.money(x.port * value, s.base, true)}</td></tr>`
            : `<tr><td class="mkt-name">${x.name}</td><td class="pl-asset-meta">${shortDate(x.from)} – ${shortDate(x.to)}</td><td colspan="4" class="pl-asset-meta">No data</td></tr>`).join('')}</tbody>
        </table></div><p class="pl-note">Today's weights replayed through each historical window in ${esc(s.base)}, held static. "Partial" means some assets had not listed yet and are excluded.</p>`)}
      </div>`;

    const live = el.querySelector('#pl-risk-live');
    const paint = () => {
      const r = E.exAnteRisk(p, symbols, weights, halfLife);
      if (!r) { live.innerHTML = `<div class="port-msg port-err">Not enough history for a covariance estimate.</div>`; return; }
      const maxBar = Math.max(1e-9, ...r.assets.map(x => Math.max(Math.abs(x.weight), Math.abs(x.pctRc))));
      const corrBg = v => {
        const a = Math.min(1, Math.abs(v)) * 0.6 + 0.06;
        return `pl-heat ${v >= 0 ? 'dn' : 'up'}" style="--heat:${(a * 100).toFixed(0)}%`;
      };
      live.innerHTML = `
        <div class="pl-kpis"><div class="pl-kpi-group"><div class="pl-kpi-row">
          ${kpi('Ex-ante volatility', fmt.pctU(r.vol), { sub: `Benchmark ${fmt.pctU(r.benchVol)}` })}
          ${kpi('Ex-ante tracking error', fmt.pctU(r.te))}
          ${kpi('Ex-ante beta', fmt.num(r.beta))}
          ${kpi('VaR 95% · 1 day', fmt.pctU(r.var95, 2), { sub: fmt.money(r.var95 * value, s.base) })}
          ${kpi('VaR 95% · 10 day', fmt.pctU(r.var95_10d, 2), { sub: fmt.money(r.var95_10d * value, s.base) })}
          ${kpi('Diversification', `${fmt.num(r.divRatio)}×`, { sub: `Effective N ${fmt.num(r.effN, 1)}` })}
        </div></div></div>
        ${panel('Risk budget', `<div class="pl-table-scroll"><table class="mkt-table pl-table">
          <thead><tr><th>Asset</th><th class="num">Weight</th><th class="num">Risk share</th><th class="pl-dual-col">
            <span class="pl-key"><i class="w"></i>Weight</span><span class="pl-key"><i class="r"></i>Risk</span></th>
            <th class="num">Vol</th><th class="num">MCTR</th><th class="num">β → port</th><th class="num">ρ → bench</th></tr></thead>
          <tbody>${[...r.assets].sort((x, y) => y.pctRc - x.pctRc).map(x => `<tr>
            <td class="mkt-name"><span class="pl-swatch" style="background:${colourFor(x.i, th)}"></span>${esc(assets[x.i].display)}</td>
            <td class="num">${fmt.pctU(x.weight)}</td>
            <td class="num ${x.pctRc > x.weight * 1.25 && x.pctRc > 0.05 ? 'dn' : ''}">${fmt.pctU(x.pctRc)}</td>
            <td class="pl-dual-col"><div class="pl-dual"><span class="w" style="width:${Math.abs(x.weight) / maxBar * 100}%"></span><span class="r" style="width:${Math.abs(x.pctRc) / maxBar * 100}%"></span></div></td>
            <td class="num">${fmt.pctU(x.vol)}</td><td class="num">${fmt.pctU(x.mctr)}</td>
            <td class="num">${fmt.num(x.betaPort)}</td><td class="num">${fmt.num(x.corrBench)}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="pl-note">Risk share is each position's contribution to portfolio variance (w·Σw / σ²); it sums to 100%. Highlighted where risk share exceeds 1.25× the capital weight. MCTR is the marginal change in volatility per unit of weight.</p>`)}
        ${panel('Correlation matrix', `<div class="pl-table-scroll"><table class="corr-table pl-corr">
          <thead><tr><th></th>${assets.map(a => `<th class="corr-col-hdr">${esc(a.display)}</th>`).join('')}</tr></thead>
          <tbody>${assets.map((a, i) => `<tr><th class="corr-row-hdr">${esc(a.display)}</th>${assets.map((_, j) => i === j
            ? '<td class="corr-cell corr-diag">—</td>'
            : `<td class="corr-cell ${corrBg(r.corr[i][j])}">${r.corr[i][j].toFixed(2)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <div class="corr-legend"><span class="corr-leg"><span class="pl-key"><i class="neg"></i>Diversifying (negative)</span></span><span class="corr-leg"><span class="pl-key"><i class="pos"></i>Correlated (positive)</span></span></div>`)}`;
    };
    paint();
    const slider = el.querySelector('#pl-hl');
    let raf = 0;
    slider.addEventListener('input', () => {
      halfLife = +slider.value;
      el.querySelector('#pl-hl-val').textContent = `${halfLife}d`;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    });
  }

  // ── Exports ──

  function exportResults() {
    const { bt, bench, assets, name } = result;
    const head = ['date', 'nav', 'benchmark_nav', 'return', 'benchmark_return', 'trading_cost', 'cash_weight', ...assets.map(a => `w_${a.symbol}`)];
    const lines = [head.join(',')];
    bt.dates.forEach((d, k) => lines.push([d, bt.nav[k].toFixed(6), bench.nav[k].toFixed(6), bt.ret[k].toFixed(6), bench.ret[k].toFixed(6),
      bt.costs[k].toFixed(6), bt.cashW[k].toFixed(6), ...bt.W.map(w => w[k].toFixed(6))].join(',')));
    download(`${fileSafe(name)}-backtest.csv`, lines.join('\n'));
  }

  function exportTrades() {
    const { bt, panel: p, settings: s, name } = result;
    const lines = [['date', 'type', 'symbol', 'side', 'from_weight', 'to_weight', 'delta_weight', `est_value_${s.base}`, 'est_units', `cost_${s.base}`].join(',')];
    bt.trades.forEach(t => t.legs.forEach(l => {
      const v = Math.abs(l.delta) * t.nav * s.aum;
      const px = p.assets.get(l.symbol).priceBase[bt.t0 + t.k];
      lines.push([t.date, t.type, csvCell(l.symbol), l.delta > 0 ? 'BUY' : 'SELL', l.from.toFixed(6), l.to.toFixed(6), l.delta.toFixed(6),
        v.toFixed(2), px > 0 ? (v / px).toFixed(2) : '', (Math.abs(l.delta) * s.costBps / 1e4 * t.nav * s.aum).toFixed(2)].join(','));
    }));
    download(`${fileSafe(name)}-trades.csv`, lines.join('\n'));
  }

  // ── Boot ──

  const onTheme = () => { if (ws) { renderBuilder(); renderView(); } };
  document.addEventListener('macro-theme-change', onTheme);

  store.load().then(loaded => {
    if (!alive) return;
    ws = loaded;
    saveState.textContent = store.label;
    renderAll();
  });

  return () => {
    alive = false;
    abortCtrl?.abort();
    clearView();
    document.removeEventListener('macro-theme-change', onTheme);
    if (saveTimer && ws) flushSave();
  };
}
