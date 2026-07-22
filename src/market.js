// ── Market Data Tab ───────────────────────────────────────────────────────────

import { fetchAll } from './api.js';

// ── Symbol definitions ────────────────────────────────────────────────────────

const EQUITIES = {
  Americas: [
    { symbol: '^GSPC',    name: 'S&P 500'       },
    { symbol: '^IXIC',    name: 'NASDAQ'         },
    { symbol: '^DJI',     name: 'Dow Jones'      },
    { symbol: '^RUT',     name: 'Russell 2000'   },
    { symbol: '^BVSP',    name: 'Bovespa'        },
    { symbol: '^MXX',     name: 'IPC Mexico'     },
  ],
  Europe: [
    { symbol: '^FTSE',     name: 'FTSE 100'      },
    { symbol: '^GDAXI',    name: 'DAX'           },
    { symbol: '^FCHI',     name: 'CAC 40'        },
    { symbol: '^STOXX50E', name: 'Euro Stoxx 50' },
    { symbol: '^SSMI',     name: 'SMI'           },
    { symbol: '^AEX',      name: 'AEX'           },
  ],
  'Asia-Pacific': [
    { symbol: '^N225',     name: 'Nikkei 225'    },
    { symbol: '^HSI',      name: 'Hang Seng'     },
    { symbol: '000001.SS', name: 'Shanghai'      },
    { symbol: '^AXJO',     name: 'ASX 200'       },
    { symbol: '^KS11',     name: 'KOSPI'         },
    { symbol: '^STI',      name: 'Straits Times' },
  ],
};

// International bond yield tickers (=RR Reuters codes) are no longer served
// by Yahoo Finance — US Treasuries via CBOE index symbols are reliable.
const BONDS = [
  { symbol: '^IRX', name: '3-Month', country: 'US', flag: '🇺🇸' },
  { symbol: '^FVX', name: '5-Year',  country: 'US', flag: '🇺🇸' },
  { symbol: '^TNX', name: '10-Year', country: 'US', flag: '🇺🇸' },
  { symbol: '^TYX', name: '30-Year', country: 'US', flag: '🇺🇸' },
];

const FX = [
  { symbol: 'EURUSD=X', name: 'EUR / USD' },
  { symbol: 'GBPUSD=X', name: 'GBP / USD' },
  { symbol: 'USDJPY=X', name: 'USD / JPY' },
  { symbol: 'AUDUSD=X', name: 'AUD / USD' },
  { symbol: 'USDCAD=X', name: 'USD / CAD' },
  { symbol: 'USDCHF=X', name: 'USD / CHF' },
  { symbol: 'USDCNY=X', name: 'USD / CNY' },
  { symbol: 'USDINR=X', name: 'USD / INR' },
];

const COMMODITIES = [
  { symbol: 'GC=F',  name: 'Gold',        unit: '/oz'    },
  { symbol: 'SI=F',  name: 'Silver',      unit: '/oz'    },
  { symbol: 'CL=F',  name: 'WTI Crude',   unit: '/bbl'   },
  { symbol: 'BZ=F',  name: 'Brent Crude', unit: '/bbl'   },
  { symbol: 'NG=F',  name: 'Natural Gas', unit: '/MMBtu' },
  { symbol: 'HG=F',  name: 'Copper',      unit: '/lb'    },
  { symbol: 'ZW=F',  name: 'Wheat',       unit: '/bu'    },
  { symbol: 'ZC=F',  name: 'Corn',        unit: '/bu'    },
];

const SECTORS = [
  { symbol: 'XLK',  name: 'Technology'          },
  { symbol: 'XLC',  name: 'Communication'        },
  { symbol: 'XLY',  name: 'Cons. Discretionary'  },
  { symbol: 'XLF',  name: 'Financials'           },
  { symbol: 'XLI',  name: 'Industrials'          },
  { symbol: 'XLV',  name: 'Healthcare'           },
  { symbol: 'XLE',  name: 'Energy'               },
  { symbol: 'XLB',  name: 'Materials'            },
  { symbol: 'XLRE', name: 'Real Estate'          },
  { symbol: 'XLU',  name: 'Utilities'            },
  { symbol: 'XLP',  name: 'Cons. Staples'        },
];

const ALL_EQUITY_SYMBOLS  = Object.values(EQUITIES).flat().map(e => e.symbol);
const ALL_SECTOR_SYMBOLS  = SECTORS.map(s => s.symbol);
const ALL_SYMBOLS = [
  ...ALL_EQUITY_SYMBOLS,
  ...BONDS.map(b => b.symbol),
  ...FX.map(f => f.symbol),
  ...COMMODITIES.map(c => c.symbol),
  ...ALL_SECTOR_SYMBOLS,
];

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmtPrice(q) {
  const p = q?.regularMarketPrice;
  if (p == null) return '—';
  // Bond yields are returned as a yield level (e.g. 4.82 = 4.82%)
  const isBond = q.symbol?.startsWith('^') && p < 30;
  if (isBond) return p.toFixed(2) + '%';
  return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(pct) {
  if (pct == null) return { text: '—', cls: '' };
  const sign = pct >= 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(2)}%`, cls: pct >= 0 ? 'up' : 'dn' };
}

function fmtChg(q) {
  return fmtPct(q?.regularMarketChangePercent ?? null);
}

function fmtBps(q) {
  const chg = q?.regularMarketChange;
  if (chg == null) return { text: '—', cls: '' };
  const bps  = Math.round(chg * 100);
  const sign = bps >= 0 ? '+' : '';
  return { text: `${sign}${bps}bps`, cls: bps >= 0 ? 'up' : 'dn' };
}

// ── HTML builders ─────────────────────────────────────────────────────────────

function chgCell(obj) {
  return `<td class="num ${obj.cls}">${obj.text}</td>`;
}

function skeletonRows(n, cols = 4) {
  return Array.from({ length: n }, () =>
    `<tr>${Array.from({ length: cols }, () => '<td><span class="skel"></span></td>').join('')}</tr>`
  ).join('');
}

function buildEquityTable(region, items, quotes) {
  const rows = items.map(({ symbol, name }) => {
    const q      = quotes.get(symbol);
    const chg    = fmtChg(q);
    const ytdFmt = fmtPct(q?.ytdPct ?? null);
    return `<tr>
      <td class="mkt-name">${name}</td>
      <td class="num">${fmtPrice(q)}</td>
      ${chgCell(chg)}
      <td class="num ${ytdFmt.cls}">${ytdFmt.text}</td>
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">${region}</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th><th class="num">Level</th>
          <th class="num">1D</th><th class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildBondsTable(quotes) {
  const rows = BONDS.map(({ symbol, name, flag, country }) => {
    const q   = quotes.get(symbol);
    const bps = fmtBps(q);
    const yld = q?.regularMarketPrice != null ? q.regularMarketPrice.toFixed(2) + '%' : '—';
    return `<tr>
      <td class="mkt-name"><span class="mkt-flag">${flag}</span>${country} ${name}</td>
      <td class="num">${yld}</td>
      ${chgCell(bps)}
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Bond Yields</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th><th class="num">Yield</th><th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildFXTable(quotes) {
  const rows = FX.map(({ symbol, name }) => {
    const q        = quotes.get(symbol);
    const chg      = fmtChg(q);
    const p        = q?.regularMarketPrice;
    const decimals = ['USDJPY=X', 'USDCNY=X', 'USDINR=X'].includes(symbol) ? 3 : 4;
    return `<tr>
      <td class="mkt-name">${name}</td>
      <td class="num">${p != null ? p.toFixed(decimals) : '—'}</td>
      ${chgCell(chg)}
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Rates</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Pair</th><th class="num">Rate</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildCommoditiesTable(quotes) {
  const rows = COMMODITIES.map(({ symbol, name, unit }) => {
    const q   = quotes.get(symbol);
    const chg = fmtChg(q);
    const p   = q?.regularMarketPrice;
    return `<tr>
      <td class="mkt-name">${name}</td>
      <td class="num">${p != null ? '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}<span class="mkt-unit">${unit}</span></td>
      ${chgCell(chg)}
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th><th class="num">Price</th><th class="num">1D</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildSectorsPanel(quotes) {
  const items = SECTORS.map(({ symbol, name }) => {
    const q = quotes.get(symbol);
    return { name, chg1d: q?.regularMarketChangePercent ?? null, ytd: q?.ytdPct ?? null };
  });

  const maxAbs1d  = Math.max(0.01, ...items.map(i => Math.abs(i.chg1d ?? 0)));
  const maxAbsYtd = Math.max(0.01, ...items.map(i => Math.abs(i.ytd  ?? 0)));

  const rows = items.map(({ name, chg1d, ytd }) => {
    const f1d      = fmtPct(chg1d);
    const fYtd     = fmtPct(ytd);
    const barW1d   = chg1d != null ? (Math.abs(chg1d) / maxAbs1d)  * 100 : 0;
    const barWYtd  = ytd   != null ? (Math.abs(ytd)   / maxAbsYtd) * 100 : 0;
    return `<tr>
      <td class="mkt-name sec-name">${name}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${f1d.cls}" style="width:${barW1d.toFixed(1)}%"></span></td>
      <td class="num ${f1d.cls}">${f1d.text}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${fYtd.cls}" style="width:${barWYtd.toFixed(1)}%"></span></td>
      <td class="num ${fYtd.cls}">${fYtd.text}</td>
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel mkt-panel-wide">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table sec-table">
        <thead><tr>
          <th>Sector</th>
          <th colspan="2" class="num">1-Day</th>
          <th colspan="2" class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function renderMarketTab(container) {
  container.innerHTML = `
    <div class="mkt-topbar">
      <h2 class="mkt-title">Market Overview</h2>
      <div class="mkt-topbar-right">
        <span class="mkt-timestamp" id="mkt-timestamp">Loading…</span>
        <button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">↺ Refresh</button>
      </div>
    </div>

    <section class="mkt-section">
      <div class="mkt-section-title">Equity Markets</div>
      <div class="mkt-equities-grid" id="mkt-equities">
        ${['Americas', 'Europe', 'Asia-Pacific'].map(r => `
          <div class="mkt-panel">
            <div class="mkt-panel-label">${r}</div>
            <table class="mkt-table"><tbody>${skeletonRows(6)}</tbody></table>
          </div>`).join('')}
      </div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds"><div class="mkt-panel"><div class="mkt-panel-label">Bond Yields</div><table class="mkt-table"><tbody>${skeletonRows(4, 3)}</tbody></table></div></div>
      <div id="mkt-fx"><div class="mkt-panel"><div class="mkt-panel-label">FX Rates</div><table class="mkt-table"><tbody>${skeletonRows(8, 3)}</tbody></table></div></div>
    </section>

    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities"><div class="mkt-panel"><div class="mkt-panel-label">Commodities</div><table class="mkt-table"><tbody>${skeletonRows(8, 3)}</tbody></table></div></div>
      <div id="mkt-sectors"><div class="mkt-panel"><div class="mkt-panel-label">US Equity Sectors</div><table class="mkt-table"><tbody>${skeletonRows(11, 5)}</tbody></table></div></div>
    </section>
  `;

  function sectionError(label) {
    return `<div class="mkt-panel"><div class="mkt-panel-label">${label}</div><div class="mkt-section-err">Unable to load — check console for details</div></div>`;
  }

  const refreshBtn = container.querySelector('#mkt-refresh');

  async function load() {
    const tsEl = container.querySelector('#mkt-timestamp');
    tsEl.textContent = 'Loading…';

    // Single pass: v8/chart per symbol gives price + 1D change + YTD all at once.
    const quotes = await fetchAll(ALL_SYMBOLS);

    if (!container.isConnected) return;

    const eqEl    = container.querySelector('#mkt-equities');
    const bondsEl = container.querySelector('#mkt-bonds');
    const fxEl    = container.querySelector('#mkt-fx');
    const commEl  = container.querySelector('#mkt-commodities');
    const secEl   = container.querySelector('#mkt-sectors');

    eqEl.innerHTML = Object.entries(EQUITIES)
      .map(([region, items]) => buildEquityTable(region, items, quotes))
      .join('');

    bondsEl.innerHTML = BONDS.some(b => quotes.has(b.symbol))
      ? buildBondsTable(quotes)
      : sectionError('Bond Yields');

    fxEl.innerHTML = FX.some(f => quotes.has(f.symbol))
      ? buildFXTable(quotes)
      : sectionError('FX Rates');

    commEl.innerHTML = COMMODITIES.some(c => quotes.has(c.symbol))
      ? buildCommoditiesTable(quotes)
      : sectionError('Commodities');

    secEl.innerHTML = SECTORS.some(s => quotes.has(s.symbol))
      ? buildSectorsPanel(quotes)
      : sectionError('US Equity Sectors');

    const ts = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    tsEl.textContent = `Updated ${ts}`;
  }

  refreshBtn.addEventListener('click', load);
  await load();

  const timer = setInterval(load, 30 * 60 * 1000); // 30 minutes
  return () => clearInterval(timer);
}
