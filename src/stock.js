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
  ma20:  { period: 20,  color: '#fbbf24', label: 'MA 20D'  },
  ma50:  { period: 50,  color: '#60a5fa', label: 'MA 50D'  },
  ma200: { period: 200, color: '#f87171', label: 'MA 200D' },
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

// Calculate a daily indicator and sample it onto the chart's display dates.
// This keeps MA 200 meaning 200 trading sessions even on weekly/monthly views.
function smaAtDisplayDates(candles, period, displayCandles) {
  const values = sma(candles, period);
  let valueIndex = 0;
  let latest = null;
  return displayCandles.map(candle => {
    while (valueIndex < values.length && values[valueIndex].time <= candle.time) {
      latest = values[valueIndex].value;
      valueIndex += 1;
    }
    return latest == null ? null : { time: candle.time, value: latest };
  }).filter(Boolean);
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

async function fetchIndicatorData(symbol) {
  const key = `${symbol}:indicator-history`;
  const hit = priceCache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;
  const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=10y&interval=1d&includePrePost=false`;
  const r = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const result = (await r.json())?.chart?.result?.[0];
  if (!result) throw new Error('Indicator history unavailable');
  const times = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const candles = times.map((timestamp, i) => closes[i] == null ? null : ({
    time: toDateStr(timestamp), close: +closes[i].toFixed(4),
  })).filter(Boolean);
  priceCache.set(key, { ts: Date.now(), data: candles });
  return candles;
}

async function fetchFundamentals(symbol) {
  const hit = fundsCache.get(symbol);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  // quoteSummary now requires an authenticated Yahoo crumb. The public
  // fundamentals-timeseries endpoint still exposes a useful, transparent
  // subset without pretending unavailable fields are current.
  const types = ['annualTotalRevenue', 'annualGrossProfit', 'annualOperatingIncome', 'annualNetIncome', 'annualDilutedEPS'];
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - 370 * 24 * 60 * 60;
  const path = `/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(symbol)}?type=${types.join(',')}&period1=${period1}&period2=${period2}`;
  try {
    const r = await fetch(buildYfUrl(path), { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    const rows = (await r.json())?.timeseries?.result ?? [];
    const latest = (type) => rows.find(row => row.meta?.symbol?.includes?.(symbol) && row[type]?.length)?.[type]?.at(-1)?.reportedValue?.raw ?? null;
    const revenue = latest('annualTotalRevenue');
    const grossProfit = latest('annualGrossProfit');
    const operatingIncome = latest('annualOperatingIncome');
    const data = { financialData: {
      totalRevenue: { raw: revenue },
      grossMargins: { raw: revenue && grossProfit ? grossProfit / revenue : null },
      operatingMargins: { raw: revenue && operatingIncome ? operatingIncome / revenue : null },
    }, defaultKeyStatistics: { trailingEps: { raw: latest('annualDilutedEPS') } } };
    fundsCache.set(symbol, { ts: Date.now(), data });
    return data;
  } catch { return null; }
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
        <button class="ghost-btn sa-go-btn" id="sa-go">Add to chart</button>
      </div>

      <div class="sa-placeholder" id="sa-ph">
        <div class="sa-ph-icon">📈</div>
        <div class="sa-ph-title">Enter a ticker to get started</div>
        <div class="sa-ph-hint">e.g. AAPL · CBA.AX · HSBA.L · 7203.T</div>
      </div>

      <div class="sa-main" id="sa-main" style="display:none">
        <div class="sa-hdr" id="sa-hdr"></div>
        <div class="sa-instruments" id="sa-instruments" aria-label="Chart instruments"></div>

        <div class="sa-controls">
          <div class="sa-ranges">${rangeBtns}</div>
          <div class="sa-opts">
            <div class="sa-type-group">
              <button class="sa-opt" data-type="candle">Candle</button>
              <button class="sa-opt active" data-type="line">Line</button>
            </div>
            <div class="sa-ind-group">
              <button class="sa-opt" data-ind="ma20">MA 20D</button>
              <button class="sa-opt" data-ind="ma50">MA 50D</button>
              <button class="sa-opt" data-ind="ma200">MA 200D</button>
              <button class="sa-opt" data-ind="bb">BB</button>
              <button class="sa-opt active" data-ind="vol">Vol</button>
            </div>
          </div>
        </div>

        <div class="sa-level-tools" role="group" aria-label="Price level tools">
          <span class="sa-tool-label">PRICE LEVELS</span>
          <input class="sa-level-input" id="sa-level-input" type="number" inputmode="decimal" step="any" placeholder="Enter price" aria-label="Price level" />
          <button class="sa-opt" id="sa-level-add">Add level</button>
          <button class="sa-opt" id="sa-annot-btn" type="button" aria-pressed="false" title="Click the chart repeatedly to add horizontal levels">Place on chart</button>
          <span class="sa-tool-hint">Or click the chart to place multiple levels</span>
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
  let sm           = {};
  let instruments  = new Map();
  let activeSymbol  = null;
  let annotLines   = [];
  let nextAnnotId  = 1;
  let annotMode    = false;
  let activeInds   = new Set(['vol']);
  let chartType    = 'line';
  let rangeIdx     = 4;            // 1Y default
  let resizeObs    = null;
  let chartThemeListener = null;

  // ── Element refs ────────────────────────────────────────────────────────────
  const elPh      = container.querySelector('#sa-ph');
  const elMain    = container.querySelector('#sa-main');
  const elHdr     = container.querySelector('#sa-hdr');
  const elInstrumentList = container.querySelector('#sa-instruments');
  const elChartEl = container.querySelector('#sa-chart');
  const elOverlay = container.querySelector('#sa-overlay');
  const elTT      = container.querySelector('#sa-tt');
  const elAnnot   = container.querySelector('#sa-annot-list');
  const elFunds   = container.querySelector('#sa-funds');
  const elMkt     = container.querySelector('#sa-mkt');
  const elTicker  = container.querySelector('#sa-ticker');
  const elGo      = container.querySelector('#sa-go');
  const elAnnotBtn = container.querySelector('#sa-annot-btn');
  const elLevelInput = container.querySelector('#sa-level-input');
  const elLevelAdd = container.querySelector('#sa-level-add');

  function chartThemeValues() {
    const theme = document.documentElement.dataset.theme;
    if (theme === 'more-visible') return { background: '#fffdf7', text: '#101820', grid: '#c3d0d9', border: '#293c4a', level: '#005a9c', fontSize: 15, lineWidth: 3, colors: ['#005a9c', '#9b3d00', '#006b3c', '#7b2f83', '#8a4b00', '#005b70', '#a51d37', '#34495e'], volumeUp: 'rgba(0,107,60,0.45)', volumeDown: 'rgba(180,35,24,0.45)' };
    if (theme === 'light') return { background: '#f3f0e8', text: '#5e665e', grid: '#ded8cc', border: '#b7ad9d', level: '#9b641d', fontSize: 11, lineWidth: 2, colors: ['#9b641d', '#3575a8', '#b34f43', '#37845b', '#805b96', '#86751a', '#34817d', '#a34f73'], volumeUp: 'rgba(55,132,91,0.36)', volumeDown: 'rgba(179,79,67,0.36)' };
    return { background: '#111413', text: '#99a49b', grid: '#303a33', border: '#47564b', level: '#e3a857', fontSize: 11, lineWidth: 2, colors: ['#e3a857', '#63a7d8', '#d77d72', '#72b58a', '#bc91cf', '#d9ca68', '#55b9b3', '#e28dab'], volumeUp: 'rgba(101,193,140,0.4)', volumeDown: 'rgba(223,124,112,0.4)' };
  }

  // ── Chart init ──────────────────────────────────────────────────────────────
  async function ensureChart() {
    if (chart) return;
    const { createChart, CrosshairMode } = await getLWC();
    const initialTheme = chartThemeValues();

    chart = createChart(elChartEl, {
      width:  elChartEl.clientWidth || 900,
      height: 480,
      layout: {
        background: { color: initialTheme.background },
        textColor:  initialTheme.text,
        fontSize:   initialTheme.fontSize,
        fontFamily: "'DM Mono', monospace",
      },
      grid: {
        vertLines: { color: initialTheme.grid },
        horzLines: { color: initialTheme.grid },
      },
      crosshair:       { mode: CrosshairMode.Normal },
      leftPriceScale:  { visible: true, borderColor: initialTheme.border },
      rightPriceScale: { borderColor: initialTheme.border },
      timeScale:       { borderColor: initialTheme.border, timeVisible: true, secondsVisible: false },
    });

    chartThemeListener = () => {
      if (!chart) return;
      const theme = chartThemeValues();
      chart.applyOptions({
        layout: { background: { color: theme.background }, textColor: theme.text, fontSize: theme.fontSize },
        grid: { vertLines: { color: theme.grid }, horzLines: { color: theme.grid } },
        leftPriceScale: { borderColor: theme.border },
        rightPriceScale: { borderColor: theme.border },
        timeScale: { borderColor: theme.border },
      });
      [...instruments.values()].forEach((instrument, index) => {
        instrument.color = theme.colors[index % theme.colors.length];
        const series = sm[instrument.symbol] ?? {};
        series.main?.applyOptions({ color: instrument.color, lineWidth: theme.lineWidth });
        series.vol?.setData(instrument.priceData.volumes.map(volume => ({
          ...volume,
          color: volume.color.includes('52,211,153') || volume.color.includes('101,193,140')
            ? theme.volumeUp
            : theme.volumeDown,
        })));
      });
      annotLines.forEach(level => {
        if (!level.line) return;
        try { sm[level.symbol]?.main.removePriceLine(level.line); } catch {}
        level.line = createPriceLine(level.price, level.symbol);
      });
    };
    document.addEventListener('macro-theme-change', chartThemeListener);

    resizeObs = new ResizeObserver(() => {
      if (chart && elChartEl.clientWidth) chart.resize(elChartEl.clientWidth, 480);
    });
    resizeObs.observe(elChartEl);

    // Crosshair tooltip
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.point) { elTT.style.display = 'none'; return; }
      const rows = [...instruments.values()].map(instrument => {
        const series = sm[instrument.symbol]?.main;
        const point = series && param.seriesData.get(series);
        if (!point) return '';
        const value = 'close' in point ? point.close : point.value;
        return `<span class="sa-tt-instrument"><i style="background:${instrument.color}"></i>${instrument.symbol} <b>${Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 })}</b></span>`;
      }).filter(Boolean).join('');
      if (!rows) { elTT.style.display = 'none'; return; }
      elTT.innerHTML = `<span class="sa-tt-date">${param.time}</span>${rows}`;
      elTT.style.display = 'block';
    });

    // Click → add price line when in annotation mode
    chart.subscribeClick(param => {
      const main = activeSymbol && sm[activeSymbol]?.main;
      if (!annotMode || !param.point || !main) return;
      const price = main.coordinateToPrice(param.point.y);
      if (price == null) return;
      addPriceLevel(price, activeSymbol);
    });
  }

  // ── Series rebuild ──────────────────────────────────────────────────────────
  async function applyData() {
    const { LineStyle } = await getLWC();

    Object.values(sm).flatMap(series => Object.values(series)).forEach(series => {
      try { chart.removeSeries(series); } catch {}
    });
    sm = {};
    annotLines.forEach(level => { level.line = null; });
    renderAnnotList();

    const theme = chartThemeValues();
    chart.priceScale('left').applyOptions({ visible: true, borderColor: theme.border, scaleMargins: { top: 0.06, bottom: activeInds.has('vol') ? 0.22 : 0.04 } });
    chart.priceScale('right').applyOptions({ visible: true, borderColor: theme.border, scaleMargins: { top: 0.06, bottom: activeInds.has('vol') ? 0.22 : 0.04 } });

    for (const [index, instrument] of [...instruments.values()].entries()) {
      instrument.color = theme.colors[index % theme.colors.length];
      const priceScaleId = instrument.axis;
      sm[instrument.symbol] = {};
      if (chartType === 'candle') {
        sm[instrument.symbol].main = chart.addCandlestickSeries({
          priceScaleId,
          upColor: '#65c18c', downColor: '#df7c70', borderVisible: false,
          wickUpColor: '#65c18c', wickDownColor: '#df7c70',
        });
        sm[instrument.symbol].main.setData(instrument.priceData.candles);
      } else {
        sm[instrument.symbol].main = chart.addLineSeries({ color: instrument.color, lineWidth: theme.lineWidth, priceScaleId, title: instrument.symbol });
        sm[instrument.symbol].main.setData(instrument.priceData.candles.map(c => ({ time: c.time, value: c.close })));
      }

      for (const [key, cfg] of Object.entries(MA_DEFS)) {
        if (!activeInds.has(key) || instrument.indicatorCandles.length < cfg.period) continue;
        sm[instrument.symbol][key] = chart.addLineSeries({ color: cfg.color, lineWidth: 1, title: `${instrument.symbol} ${cfg.label}`, priceScaleId });
        sm[instrument.symbol][key].setData(smaAtDisplayDates(instrument.indicatorCandles, cfg.period, instrument.priceData.candles));
      }

      if (activeInds.has('bb') && instrument.priceData.candles.length >= 20) {
        const { upper, mid, lower } = bollinger(instrument.priceData.candles);
        sm[instrument.symbol].bbU = chart.addLineSeries({ color: 'rgba(124,106,247,0.8)', lineWidth: 1, lineStyle: LineStyle.Dashed, priceScaleId });
        sm[instrument.symbol].bbM = chart.addLineSeries({ color: 'rgba(124,106,247,0.4)', lineWidth: 1, priceScaleId });
        sm[instrument.symbol].bbL = chart.addLineSeries({ color: 'rgba(124,106,247,0.8)', lineWidth: 1, lineStyle: LineStyle.Dashed, priceScaleId });
        sm[instrument.symbol].bbU.setData(upper); sm[instrument.symbol].bbM.setData(mid); sm[instrument.symbol].bbL.setData(lower);
      }
    }

    const volumeInstrument = instruments.values().next().value;
    if (activeInds.has('vol') && volumeInstrument) {
      sm[volumeInstrument.symbol].vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol' });
      chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
      sm[volumeInstrument.symbol].vol.setData(volumeInstrument.priceData.volumes.map(volume => ({
        ...volume,
        color: volume.color.includes('52,211,153') || volume.color.includes('101,193,140') ? theme.volumeUp : theme.volumeDown,
      })));
    }

    annotLines.forEach(level => {
      const series = sm[level.symbol]?.main;
      level.line = series ? createPriceLine(level.price, level.symbol) : null;
    });

    chart.timeScale().fitContent();
  }

  function createPriceLine(price, symbol) {
    const { LineStyle } = _lwc;
    const levelColor = chartThemeValues().level;
    return sm[symbol].main.createPriceLine({
      price, color: levelColor, lineWidth: 1,
      lineStyle: LineStyle.Dashed, axisLabelVisible: true,
      title: `${symbol} ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }

  function addPriceLevel(price, symbol = activeSymbol) {
    if (!Number.isFinite(price) || !sm[symbol]?.main) return;
    annotLines.push({ id: nextAnnotId++, price, symbol, line: createPriceLine(price, symbol) });
    renderAnnotList();
  }

  // ── Annotation list ─────────────────────────────────────────────────────────
  function renderAnnotList() {
    if (!annotLines.length) { elAnnot.innerHTML = ''; return; }
    elAnnot.innerHTML = `
      <div class="sa-annot-wrap">
        <span class="sa-section-label">Price Levels</span>
        <div class="sa-annot-pills">
          ${annotLines.map(a => `
            <span class="sa-annot-pill">
              ${a.symbol} · ${a.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <button class="sa-annot-x" data-id="${a.id}" aria-label="Remove price level ${a.price}" title="Remove level">×</button>
            </span>`).join('')}
          ${annotLines.length > 1 ? '<button class="sa-clear-levels" type="button">Clear all</button>' : ''}
        </div>
      </div>`;
    elAnnot.querySelectorAll('.sa-annot-x').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.id);
        const index = annotLines.findIndex(level => level.id === id);
        if (index < 0) return;
        try { if (annotLines[index].line) sm[annotLines[index].symbol]?.main.removePriceLine(annotLines[index].line); } catch {}
        annotLines.splice(index, 1);
        renderAnnotList();
      });
    });
    elAnnot.querySelector('.sa-clear-levels')?.addEventListener('click', () => {
      annotLines.forEach(level => {
        try { if (level.line) sm[level.symbol]?.main.removePriceLine(level.line); } catch {}
      });
      annotLines = [];
      renderAnnotList();
    });
  }

  function renderInstrumentControls() {
    elInstrumentList.innerHTML = [...instruments.values()].map(instrument => `
      <div class="sa-instrument-row${instrument.symbol === activeSymbol ? ' active' : ''}" data-symbol="${instrument.symbol}">
        <span class="sa-instrument-swatch" style="--instrument-color:${instrument.color}"></span>
        <button class="sa-instrument-focus" type="button" data-focus="${instrument.symbol}" title="Focus ${instrument.symbol}">${instrument.symbol}</button>
        <span class="sa-instrument-name">${instrument.name}</span>
        <label class="sa-axis-label" for="axis-${encodeURIComponent(instrument.symbol)}">Axis</label>
        <select class="sa-axis-select" id="axis-${encodeURIComponent(instrument.symbol)}" data-axis="${instrument.symbol}" aria-label="Price axis for ${instrument.symbol}">
          <option value="left"${instrument.axis === 'left' ? ' selected' : ''}>Left</option>
          <option value="right"${instrument.axis === 'right' ? ' selected' : ''}>Right</option>
        </select>
        <button class="sa-instrument-remove" type="button" data-remove="${instrument.symbol}" aria-label="Remove ${instrument.symbol}" title="Remove ${instrument.symbol}">×</button>
      </div>`).join('');

    elInstrumentList.querySelectorAll('[data-focus]').forEach(button => {
      button.addEventListener('click', () => focusInstrument(button.dataset.focus));
    });
    elInstrumentList.querySelectorAll('[data-axis]').forEach(select => {
      select.addEventListener('change', async () => {
        const instrument = instruments.get(select.dataset.axis);
        if (!instrument) return;
        instrument.axis = select.value;
        await applyData();
      });
    });
    elInstrumentList.querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => removeInstrument(button.dataset.remove));
    });
  }

  function focusInstrument(symbol) {
    const instrument = instruments.get(symbol);
    if (!instrument) return;
    activeSymbol = symbol;
    renderInstrumentControls();
    renderHeader(elHdr, instrument.priceData.meta, instrument.funds);
    renderFundamentals(elFunds, instrument.funds);
  }

  async function removeInstrument(symbol) {
    if (!instruments.has(symbol)) return;
    instruments.delete(symbol);
    annotLines = annotLines.filter(level => level.symbol !== symbol);
    if (activeSymbol === symbol) activeSymbol = [...instruments.keys()].at(-1) ?? null;
    if (!instruments.size) {
      elMain.style.display = 'none';
      elPh.style.display = 'flex';
      elHdr.innerHTML = '';
      elFunds.innerHTML = '';
      renderAnnotList();
      renderInstrumentControls();
      await applyData();
      return;
    }
    const active = instruments.get(activeSymbol);
    renderHeader(elHdr, active.priceData.meta, active.funds);
    renderFundamentals(elFunds, active.funds);
    renderInstrumentControls();
    renderAnnotList();
    await applyData();
  }

  // ── Load stock ──────────────────────────────────────────────────────────────
  async function loadStock(symbol) {
    if (instruments.has(symbol)) {
      focusInstrument(symbol);
      return;
    }
    const { range, interval } = RANGES[rangeIdx];
    elOverlay.style.display = 'flex';
    elPh.style.display      = 'none';
    elMain.style.display    = 'block';
    elHdr.innerHTML         = `<div class="sa-hdr-loading">Loading ${symbol}…</div>`;
    elFunds.innerHTML       = '';

    try {
      await ensureChart();
      const [priceData, indicatorData, funds] = await Promise.all([
        fetchPriceData(symbol, range, interval),
        fetchIndicatorData(symbol),
        fetchFundamentals(symbol),
      ]);
      const instrument = {
        symbol,
        name: priceData.meta.longName || priceData.meta.shortName || symbol,
        priceData,
        indicatorCandles: indicatorData,
        funds,
        axis: instruments.size === 0 ? 'right' : (instruments.size % 2 ? 'left' : 'right'),
        color: '#e3a857',
      };
      instruments.set(symbol, instrument);
      activeSymbol = symbol;
      renderHeader(elHdr, priceData.meta, funds);
      renderInstrumentControls();
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
    if (!instruments.size) return;
    rangeIdx = idx;
    container.querySelectorAll('.sa-range-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
    const { range, interval } = RANGES[idx];
    elOverlay.style.display = 'flex';
    try {
      const updated = await Promise.all([...instruments.values()].map(async instrument => ({
        symbol: instrument.symbol,
        data: await fetchPriceData(instrument.symbol, range, interval),
      })));
      updated.forEach(({ symbol, data }) => { instruments.get(symbol).priceData = data; });
      const focused = instruments.get(activeSymbol);
      renderHeader(elHdr, focused.priceData.meta, focused.funds);
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
      if (instruments.size) await applyData();
    })
  );

  container.querySelectorAll('[data-ind]').forEach(btn =>
    btn.addEventListener('click', async () => {
      const ind = btn.dataset.ind;
      activeInds.has(ind) ? activeInds.delete(ind) : activeInds.add(ind);
      btn.classList.toggle('active', activeInds.has(ind));
      if (instruments.size) await applyData();
    })
  );

  elAnnotBtn.addEventListener('click', () => {
    annotMode = !annotMode;
    elAnnotBtn.classList.toggle('active', annotMode);
    elAnnotBtn.setAttribute('aria-pressed', String(annotMode));
    elAnnotBtn.textContent = annotMode ? 'Click to place' : 'Place on chart';
    container.querySelector('#sa-chart-wrap').classList.toggle('sa-annotating', annotMode);
  });

  function addLevelFromInput() {
    const price = Number(elLevelInput.value);
    if (!elLevelInput.value.trim() || !Number.isFinite(price)) {
      elLevelInput.focus();
      return;
    }
    addPriceLevel(price);
    elLevelInput.value = '';
    elLevelInput.focus();
  }
  elLevelAdd.addEventListener('click', addLevelFromInput);
  elLevelInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') addLevelFromInput();
  });

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  return () => {
    resizeObs?.disconnect();
    if (chartThemeListener) document.removeEventListener('macro-theme-change', chartThemeListener);
    if (chart) { chart.remove(); chart = null; }
    sm = {}; annotLines = [];
  };
}
