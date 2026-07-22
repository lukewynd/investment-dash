// ── Stock Analysis Tab ────────────────────────────────────────────────────────

import { buildYfUrl } from './api.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const MARKETS = [
  { label: 'US (NYSE / NASDAQ)', suffix: '',    example: 'AAPL'    },
  { label: 'Australia (ASX)',    suffix: '.AX', example: 'CBA.AX'  },
  { label: 'UK (LSE)',           suffix: '.L',  example: 'HSBA.L'  },
  { label: 'Canada (TSX)',       suffix: '.TO', example: 'RY.TO'   },
  { label: 'Germany (XETRA)',    suffix: '.DE', example: 'SAP.DE'  },
  { label: 'Japan (TSE)',        suffix: '.T',  example: '7203.T'  },
  { label: 'Hong Kong (HKEX)',   suffix: '.HK', example: '0700.HK' },
];

const RANGES = [
  { label: '1W',  range: '5d',  interval: '1d'  },
  { label: '1M',  range: '1mo', interval: '1d'  },
  { label: '3M',  range: '3mo', interval: '1d'  },
  { label: '6M',  range: '6mo', interval: '1d'  },
  { label: '1Y',  range: '1y',  interval: '1d'  },
  { label: '2Y',  range: '2y',  interval: '1wk' },
  { label: '5Y',  range: '5y',  interval: '1wk' },
  { label: 'MAX', range: 'max', interval: '1mo' },
];

const MA_DEFS = {
  ma20:  { period: 20,  color: '#fbbf24', label: 'MA 20'  },
  ma50:  { period: 50,  color: '#60a5fa', label: 'MA 50'  },
  ma200: { period: 200, color: '#f87171', label: 'MA 200' },
};

// ── Technical indicators ──────────────────────────────────────────────────────

function sma(candles, period) {
  const out = [];
  for (let i = period - 1; i < candles.length; i++) {
    const sum = candles.slice(i - period + 1, i + 1).reduce((a, c) => a + c.close, 0);
    out.push({ time: candles[i].time, value: +(sum / period).toFixed(4) });
  }
  return out;
}

function bollinger(candles, period = 20, mult = 2) {
  const mid = sma(candles, period);
  const upper = [], lower = [];
  for (let i = 0; i < mid.length; i++) {
    const idx   = i + period - 1;
    const slice = candles.slice(idx - period + 1, idx + 1).map(c => c.close);
    const mean  = mid[i].value;
    const sd    = Math.sqrt(slice.reduce((a, c) => a + (c - mean) ** 2, 0) / period);
    upper.push({ time: mid[i].time, value: +(mean + mult * sd).toFixed(4) });
    lower.push({ time: mid[i].time, value: +(mean - mult * sd).toFixed(4) });
  }
  return { upper, mid, lower };
}

// ── Data fetching ─────────────────────────────────────────────────────────────

const priceCache = new Map();
const fundsCache = new Map();
const TTL = 5 * 60 * 1000;

function toDateStr(unix) {
  const d = new Date(unix * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchPriceData(symbol, range, interval) {
  const key = `${symbol}:${range}:${interval}`;
  const hit = priceCache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  const r    = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);

  const j      = await r.json();
  const result = j?.chart?.result?.[0];
  if (!result) throw new Error('Symbol not found');

  const times   = result.timestamp ?? [];
  const q       = result.indicators.quote[0];
  const candles = [], volumes = [];

  for (let i = 0; i < times.length; i++) {
    if (q.open[i] == null || q.close[i] == null) continue;
    const time = toDateStr(times[i]);
    candles.push({ time, open: +q.open[i].toFixed(4), high: +q.high[i].toFixed(4), low: +q.low[i].toFixed(4), close: +q.close[i].toFixed(4) });
    volumes.push({ time, value: q.volume[i] ?? 0, color: q.close[i] >= q.open[i] ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)' });
  }

  const data = { candles, volumes, meta: result.meta };
  priceCache.set(key, { ts: Date.now(), data });
  return data;
}

async function fetchFundamentals(symbol) {
  const hit = fundsCache.get(symbol);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const mods = 'price,summaryDetail,defaultKeyStatistics,financialData,assetProfile';
  const path = `/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${mods}`;
  const r    = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
  if (!r.ok) return null;

  const j    = await r.json();
  const data = j?.quoteSummary?.result?.[0] ?? null;
  if (data) fundsCache.set(symbol, { ts: Date.now(), data });
  return data;
}

// ── Formatting ────────────────────────────────────────────────────────────────

const fmtN = (v, opts = {}) => v == null ? '—' : v.toLocaleString('en-US', opts);
const fmtPct = v => v == null ? '—' : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`;
const fmtBig = v => {
  if (v == null) return '—';
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};

// ── Fundamentals panel ────────────────────────────────────────────────────────

function renderFundamentals(el, f) {
  if (!f) { el.innerHTML = '<div class="sa-no-data">Fundamental data unavailable.</div>'; return; }

  const p  = f.price               ?? {};
  const sd = f.summaryDetail        ?? {};
  const ks = f.defaultKeyStatistics ?? {};
  const fd = f.financialData        ?? {};
  const ap = f.assetProfile         ?? {};

  const metrics = [
    ['Market Cap',    fmtBig(p.marketCap?.raw)],
    ['P/E (TTM)',     fmtN(sd.trailingPE?.raw,  { maximumFractionDigits: 1 })],
    ['Fwd P/E',      fmtN(sd.forwardPE?.raw,   { maximumFractionDigits: 1 })],
    ['EPS (TTM)',    ks.trailingEps?.raw != null ? `$${ks.trailingEps.raw.toFixed(2)}` : '—'],
    ['52W High',     fmtN(sd.fiftyTwoWeekHigh?.raw, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ['52W Low',      fmtN(sd.fiftyTwoWeekLow?.raw,  { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ['Div Yield',    fmtPct(sd.dividendYield?.raw)],
    ['Beta',         fmtN(sd.beta?.raw, { maximumFractionDigits: 2 })],
    ['Revenue TTM',  fmtBig(fd.totalRevenue?.raw)],
    ['Gross Margin', fmtPct(fd.grossMargins?.raw)],
    ['Op Margin',    fmtPct(fd.operatingMargins?.raw)],
    ['ROE',          fmtPct(fd.returnOnEquity?.raw)],
    ['P/B Ratio',    fmtN(ks.priceToBook?.raw, { maximumFractionDigits: 2 })],
    ['Avg Volume',   fmtN(sd.averageVolume?.raw)],
    ['Employees',    fmtN(ap.fullTimeEmployees)],
    ['Free Cash Flow', fmtBig(fd.freeCashflow?.raw)],
  ];

  const cards = metrics.map(([label, value]) => `
    <div class="sa-fund-card">
      <div class="sa-fund-label">${label}</div>
      <div class="sa-fund-val">${value}</div>
    </div>`).join('');

  const badges = [ap.sector, ap.industry].filter(Boolean)
    .map(s => `<span class="sa-badge">${s}</span>`).join('');

  el.innerHTML = `
    <div class="sa-section-label">Key Metrics</div>
    <div class="sa-fund-grid">${cards}</div>
    ${ap.longBusinessSummary ? `
      <div class="sa-about">
        <div class="sa-section-label">About ${badges}</div>
        <p class="sa-about-text">${ap.longBusinessSummary}</p>
      </div>` : ''}
  `;
}

// ── Header ────────────────────────────────────────────────────────────────────

function renderHeader(el, meta, f) {
  const p       = f?.price ?? {};
  const name    = p.longName || p.shortName || meta?.symbol || '';
  const price   = p.regularMarketPrice?.raw ?? meta?.regularMarketPrice ?? 0;
  const chgPct  = (p.regularMarketChangePercent?.raw ?? 0) * 100;
  const chgAbs  = p.regularMarketChange?.raw ?? 0;
  const exch    = p.exchangeName || meta?.exchangeName || '';
  const up      = chgPct >= 0;

  el.innerHTML = `
    <div class="sa-hdr-left">
      <div class="sa-hdr-name">${name} <span class="sa-hdr-sym">${meta?.symbol ?? ''}</span></div>
      <div class="sa-hdr-exch">${exch}</div>
    </div>
    <div class="sa-hdr-right">
      <div class="sa-hdr-price">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="sa-hdr-chg ${up ? 'up' : 'dn'}">${up ? '+' : ''}${chgAbs.toFixed(2)} (${up ? '+' : ''}${chgPct.toFixed(2)}%)</div>
    </div>
  `;
}

// ── Lazy chart library ────────────────────────────────────────────────────────

let _lwc = null;
async function getLWC() {
  if (!_lwc) _lwc = await import('lightweight-charts');
  return _lwc;
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function renderStockTab(container) {
  const marketOpts = MARKETS.map((m, i) => `<option value="${i}">${m.label}</option>`).join('');
  const rangeBtns  = RANGES.map((r, i) =>
    `<button class="sa-range-btn${i === 4 ? ' active' : ''}" data-ri="${i}">${r.label}</button>`
  ).join('');

  container.innerHTML = `
    <div class="sa-layout">
      <div class="sa-search-bar">
        <select class="sa-market-sel" id="sa-mkt">${marketOpts}</select>
        <input class="sa-ticker-inp" id="sa-ticker" type="text" placeholder="Ticker (e.g. AAPL)" spellcheck="false" autocomplete="off" />
        <button class="ghost-btn sa-go-btn" id="sa-go">Search</button>
      </div>

      <div class="sa-placeholder" id="sa-ph">
        <div class="sa-ph-icon">📈</div>
        <div class="sa-ph-title">Enter a ticker to get started</div>
        <div class="sa-ph-hint">e.g. AAPL · CBA.AX · HSBA.L · 7203.T</div>
      </div>

      <div class="sa-main" id="sa-main" style="display:none">
        <div class="sa-hdr" id="sa-hdr"></div>

        <div class="sa-controls">
          <div class="sa-ranges">${rangeBtns}</div>
          <div class="sa-opts">
            <div class="sa-type-group">
              <button class="sa-opt active" data-type="candle">Candle</button>
              <button class="sa-opt" data-type="line">Line</button>
            </div>
            <div class="sa-ind-group">
              <button class="sa-opt" data-ind="ma20">MA 20</button>
              <button class="sa-opt" data-ind="ma50">MA 50</button>
              <button class="sa-opt" data-ind="ma200">MA 200</button>
              <button class="sa-opt" data-ind="bb">BB</button>
              <button class="sa-opt active" data-ind="vol">Vol</button>
              <button class="sa-opt" id="sa-annot-btn">+ Line</button>
            </div>
          </div>
        </div>

        <div class="sa-chart-wrap" id="sa-chart-wrap">
          <div id="sa-chart"></div>
          <div class="sa-tt" id="sa-tt"></div>
          <div class="sa-overlay" id="sa-overlay" style="display:none">
            <div class="sa-spinner"></div>
          </div>
        </div>

        <div class="sa-annot-list" id="sa-annot-list"></div>
        <div class="sa-funds" id="sa-funds"></div>
      </div>
    </div>
  `;

  // ── State ───────────────────────────────────────────────────────────────────
  let chart        = null;
  let sm           = {};           // series map
  let annotLines   = [];
  let annotMode    = false;
  let activeInds   = new Set(['vol']);
  let chartType    = 'candle';
  let rawCandles   = [];
  let rawVolumes   = [];
  let rangeIdx     = 4;            // 1Y default
  let curSymbol    = null;
  let resizeObs    = null;

  // ── Element refs ────────────────────────────────────────────────────────────
  const elPh      = container.querySelector('#sa-ph');
  const elMain    = container.querySelector('#sa-main');
  const elHdr     = container.querySelector('#sa-hdr');
  const elChartEl = container.querySelector('#sa-chart');
  const elOverlay = container.querySelector('#sa-overlay');
  const elTT      = container.querySelector('#sa-tt');
  const elAnnot   = container.querySelector('#sa-annot-list');
  const elFunds   = container.querySelector('#sa-funds');
  const elMkt     = container.querySelector('#sa-mkt');
  const elTicker  = container.querySelector('#sa-ticker');
  const elGo      = container.querySelector('#sa-go');
  const elAnnotBtn = container.querySelector('#sa-annot-btn');

  // ── Chart init ──────────────────────────────────────────────────────────────
  async function ensureChart() {
    if (chart) return;
    const { createChart, CrosshairMode } = await getLWC();

    chart = createChart(elChartEl, {
      width:  elChartEl.clientWidth || 900,
      height: 480,
      layout: {
        background: { color: '#0b0d14' },
        textColor:  '#8892a4',
        fontSize:   11,
        fontFamily: "'DM Mono', monospace",
      },
      grid: {
        vertLines: { color: '#1a1d26' },
        horzLines: { color: '#1a1d26' },
      },
      crosshair:       { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#2a2d3e' },
      timeScale:       { borderColor: '#2a2d3e', timeVisible: true, secondsVisible: false },
    });

    resizeObs = new ResizeObserver(() => {
      if (chart && elChartEl.clientWidth) chart.resize(elChartEl.clientWidth, 480);
    });
    resizeObs.observe(elChartEl);

    // Crosshair tooltip
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.point || !sm.main) { elTT.style.display = 'none'; return; }
      const d = param.seriesData.get(sm.main);
      if (!d) { elTT.style.display = 'none'; return; }
      const isCandle = 'open' in d;
      const priceHtml = isCandle
        ? `O <b>${d.open}</b>  H <b>${d.high}</b>  L <b>${d.low}</b>  C <b>${d.close}</b>`
        : `<b>${d.value?.toFixed(4)}</b>`;
      const vol = param.seriesData.get(sm.vol);
      const volHtml = vol ? `  Vol <b>${fmtN(vol.value)}</b>` : '';
      elTT.innerHTML = `<span class="sa-tt-date">${param.time}</span>  ${priceHtml}${volHtml}`;
      elTT.style.display = 'block';
    });

    // Click → add price line when in annotation mode
    chart.subscribeClick(param => {
      if (!annotMode || !param.point || !sm.main) return;
      const price = sm.main.coordinateToPrice(param.point.y);
      if (price == null) return;
      const { LineStyle } = _lwc;
      const pl = sm.main.createPriceLine({
        price, color: '#7c6af7', lineWidth: 1,
        lineStyle: LineStyle.Dashed, axisLabelVisible: true,
        title: price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      });
      annotLines.push({ pl, price });
      renderAnnotList();
    });
  }

  // ── Series rebuild ──────────────────────────────────────────────────────────
  async function applyData() {
    const { LineStyle } = await getLWC();

    Object.values(sm).forEach(s => { try { chart.removeSeries(s); } catch {} });
    sm = {};
    annotLines = [];
    renderAnnotList();

    // Volume (behind main, separate price scale)
    if (activeInds.has('vol')) {
      sm.vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol' });
      chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
      sm.vol.setData(rawVolumes);
    }

    // Main price series
    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.06, bottom: activeInds.has('vol') ? 0.22 : 0.04 },
    });

    if (chartType === 'candle') {
      sm.main = chart.addCandlestickSeries({
        upColor: '#34d399', downColor: '#f87171', borderVisible: false,
        wickUpColor: '#34d399', wickDownColor: '#f87171',
      });
      sm.main.setData(rawCandles);
    } else {
      sm.main = chart.addLineSeries({ color: '#7c6af7', lineWidth: 2 });
      sm.main.setData(rawCandles.map(c => ({ time: c.time, value: c.close })));
    }

    // Moving averages
    for (const [key, cfg] of Object.entries(MA_DEFS)) {
      if (!activeInds.has(key) || rawCandles.length < cfg.period) continue;
      sm[key] = chart.addLineSeries({ color: cfg.color, lineWidth: 1, title: cfg.label });
      sm[key].setData(sma(rawCandles, cfg.period));
    }

    // Bollinger Bands
    if (activeInds.has('bb') && rawCandles.length >= 20) {
      const { upper, mid, lower } = bollinger(rawCandles);
      sm.bbU = chart.addLineSeries({ color: 'rgba(124,106,247,0.8)', lineWidth: 1, lineStyle: LineStyle.Dashed });
      sm.bbM = chart.addLineSeries({ color: 'rgba(124,106,247,0.4)', lineWidth: 1 });
      sm.bbL = chart.addLineSeries({ color: 'rgba(124,106,247,0.8)', lineWidth: 1, lineStyle: LineStyle.Dashed });
      sm.bbU.setData(upper); sm.bbM.setData(mid); sm.bbL.setData(lower);
    }

    chart.timeScale().fitContent();
  }

  // ── Annotation list ─────────────────────────────────────────────────────────
  function renderAnnotList() {
    if (!annotLines.length) { elAnnot.innerHTML = ''; return; }
    elAnnot.innerHTML = `
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${annotLines.map((a, i) => `
            <span class="sa-annot-pill">
              ${a.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <button class="sa-annot-x" data-i="${i}">×</button>
            </span>`).join('')}
        </div>
      </div>`;
    elAnnot.querySelectorAll('.sa-annot-x').forEach(b => {
      b.addEventListener('click', () => {
        const i = +b.dataset.i;
        try { sm.main.removePriceLine(annotLines[i].pl); } catch {}
        annotLines.splice(i, 1);
        renderAnnotList();
      });
    });
  }

  // ── Load stock ──────────────────────────────────────────────────────────────
  async function loadStock(symbol) {
    curSymbol = symbol;
    const { range, interval } = RANGES[rangeIdx];
    elOverlay.style.display = 'flex';
    elPh.style.display      = 'none';
    elMain.style.display    = 'block';
    elHdr.innerHTML         = `<div class="sa-hdr-loading">Loading ${symbol}…</div>`;
    elFunds.innerHTML       = '';

    try {
      await ensureChart();
      const [priceData, funds] = await Promise.all([
        fetchPriceData(symbol, range, interval),
        fetchFundamentals(symbol),
      ]);
      rawCandles = priceData.candles;
      rawVolumes = priceData.volumes;
      renderHeader(elHdr, priceData.meta, funds);
      await applyData();
      renderFundamentals(elFunds, funds);
    } catch {
      elHdr.innerHTML  = `<div class="sa-error">Symbol <b>${symbol}</b> not found or no data available.</div>`;
      elFunds.innerHTML = '';
    } finally {
      elOverlay.style.display = 'none';
    }
  }

  async function changeRange(idx) {
    if (!curSymbol) return;
    rangeIdx = idx;
    container.querySelectorAll('.sa-range-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
    const { range, interval } = RANGES[idx];
    elOverlay.style.display = 'flex';
    try {
      const d = await fetchPriceData(curSymbol, range, interval);
      rawCandles = d.candles; rawVolumes = d.volumes;
      await applyData();
    } finally {
      elOverlay.style.display = 'none';
    }
  }

  // ── Event wiring ────────────────────────────────────────────────────────────
  container.querySelectorAll('.sa-range-btn').forEach((b, i) =>
    b.addEventListener('click', () => changeRange(i))
  );

  elMkt.addEventListener('change', () => {
    elTicker.placeholder = `Ticker (e.g. ${MARKETS[+elMkt.value].example})`;
  });

  async function doSearch() {
    const raw    = elTicker.value.trim().toUpperCase();
    const market = MARKETS[+elMkt.value];
    if (!raw) return;
    const sym = market.suffix && !raw.endsWith(market.suffix) ? `${raw}${market.suffix}` : raw;
    await loadStock(sym);
  }
  elGo.addEventListener('click', doSearch);
  elTicker.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  container.querySelectorAll('[data-type]').forEach(btn =>
    btn.addEventListener('click', async () => {
      chartType = btn.dataset.type;
      container.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (rawCandles.length) await applyData();
    })
  );

  container.querySelectorAll('[data-ind]').forEach(btn =>
    btn.addEventListener('click', async () => {
      const ind = btn.dataset.ind;
      activeInds.has(ind) ? activeInds.delete(ind) : activeInds.add(ind);
      btn.classList.toggle('active', activeInds.has(ind));
      if (rawCandles.length) await applyData();
    })
  );

  elAnnotBtn.addEventListener('click', () => {
    annotMode = !annotMode;
    elAnnotBtn.classList.toggle('active', annotMode);
    container.querySelector('#sa-chart-wrap').classList.toggle('sa-annotating', annotMode);
  });

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  return () => {
    resizeObs?.disconnect();
    if (chart) { chart.remove(); chart = null; }
    sm = {}; annotLines = [];
  };
}
