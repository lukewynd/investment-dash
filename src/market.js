// ── Market Overview Tab ────────────────────────────────────────────────────────

import { fetchAll } from './api.js';

// ── Symbol definitions ────────────────────────────────────────────────────────

const STAT_STRIP = [
  { symbol: '^GSPC',     name: 'S&P 500',      type: 'index'    },
  { symbol: '^VIX',      name: 'VIX',           type: 'vix'      },
  { symbol: '^TNX',      name: 'US 10Y',        type: 'yield'    },
  { symbol: 'DX-Y.NYB',  name: 'DXY',           type: 'index'    },
  { symbol: 'GC=F',      name: 'Gold',          type: 'commodity' },
  { symbol: 'BTC-USD',   name: 'Bitcoin',       type: 'crypto'   },
];

const EQUITIES = [
  // Americas
  { symbol: '^GSPC',     name: 'S&P 500',       region: 'Americas'    },
  { symbol: '^IXIC',     name: 'NASDAQ Comp.',  region: 'Americas'    },
  { symbol: '^DJI',      name: 'Dow Jones',     region: 'Americas'    },
  { symbol: '^RUT',      name: 'Russell 2000',  region: 'Americas'    },
  { symbol: '^BVSP',     name: 'Bovespa',       region: 'Americas'    },
  { symbol: '^MXX',      name: 'IPC Mexico',    region: 'Americas'    },
  // Europe
  { symbol: '^FTSE',     name: 'FTSE 100',      region: 'Europe'      },
  { symbol: '^GDAXI',    name: 'DAX',           region: 'Europe'      },
  { symbol: '^FCHI',     name: 'CAC 40',        region: 'Europe'      },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50', region: 'Europe'      },
  { symbol: '^SSMI',     name: 'SMI',           region: 'Europe'      },
  { symbol: '^AEX',      name: 'AEX',           region: 'Europe'      },
  // Asia-Pacific
  { symbol: '^N225',     name: 'Nikkei 225',    region: 'Asia-Pacific' },
  { symbol: '^HSI',      name: 'Hang Seng',     region: 'Asia-Pacific' },
  { symbol: '000001.SS', name: 'Shanghai Comp.',region: 'Asia-Pacific' },
  { symbol: '^AXJO',     name: 'ASX 200',       region: 'Asia-Pacific' },
  { symbol: '^KS11',     name: 'KOSPI',         region: 'Asia-Pacific' },
  { symbol: '^STI',      name: 'Straits Times', region: 'Asia-Pacific' },
];

const BONDS = [
  { symbol: '^IRX', name: '3-Month' },
  { symbol: '^FVX', name: '5-Year'  },
  { symbol: '^TNX', name: '10-Year' },
  { symbol: '^TYX', name: '30-Year' },
];

// FX currencies for the cross-rate matrix.
// invert=true: Yahoo quotes it as "USD per unit" → invert to get "USD per that currency".
// e.g. USDJPY=X = 150 JPY per USD → usdPerJPY = 1/150.
const FX_CURRENCIES = [
  { code: 'USD', name: 'US Dollar',   symbol: null,       invert: false },
  { code: 'EUR', name: 'Euro',        symbol: 'EURUSD=X', invert: false },
  { code: 'GBP', name: 'Sterling',    symbol: 'GBPUSD=X', invert: false },
  { code: 'JPY', name: 'Yen',         symbol: 'USDJPY=X', invert: true  },
  { code: 'AUD', name: 'Aus Dollar',  symbol: 'AUDUSD=X', invert: false },
  { code: 'CAD', name: 'Can Dollar',  symbol: 'USDCAD=X', invert: true  },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'USDCHF=X', invert: true  },
];
const FX_SYMBOLS = FX_CURRENCIES.filter(c => c.symbol).map(c => c.symbol);

const COMMODITIES = [
  { symbol: 'GC=F',  name: 'Gold',        unit: '/oz',    group: 'Metals'  },
  { symbol: 'SI=F',  name: 'Silver',      unit: '/oz',    group: 'Metals'  },
  { symbol: 'HG=F',  name: 'Copper',      unit: '/lb',    group: 'Metals'  },
  { symbol: 'CL=F',  name: 'WTI Crude',   unit: '/bbl',   group: 'Energy'  },
  { symbol: 'BZ=F',  name: 'Brent Crude', unit: '/bbl',   group: 'Energy'  },
  { symbol: 'NG=F',  name: 'Nat. Gas',    unit: '/MMBtu', group: 'Energy'  },
  { symbol: 'ZW=F',  name: 'Wheat',       unit: '/bu',    group: 'Agri'    },
  { symbol: 'ZC=F',  name: 'Corn',        unit: '/bu',    group: 'Agri'    },
];

const SECTORS = [
  { symbol: 'XLK',  name: 'Technology'         },
  { symbol: 'XLC',  name: 'Communication'       },
  { symbol: 'XLY',  name: 'Cons. Discretionary' },
  { symbol: 'XLF',  name: 'Financials'          },
  { symbol: 'XLI',  name: 'Industrials'         },
  { symbol: 'XLV',  name: 'Healthcare'          },
  { symbol: 'XLE',  name: 'Energy'              },
  { symbol: 'XLB',  name: 'Materials'           },
  { symbol: 'XLRE', name: 'Real Estate'         },
  { symbol: 'XLU',  name: 'Utilities'           },
  { symbol: 'XLP',  name: 'Cons. Staples'       },
];

const CRYPTO = [
  { symbol: 'BTC-USD', name: 'Bitcoin',  abbr: 'BTC' },
  { symbol: 'ETH-USD', name: 'Ethereum', abbr: 'ETH' },
  { symbol: 'SOL-USD', name: 'Solana',   abbr: 'SOL' },
  { symbol: 'XRP-USD', name: 'XRP',      abbr: 'XRP' },
];

const ALL_SYMBOLS = [
  ...new Set([
    ...STAT_STRIP.map(s => s.symbol),
    ...EQUITIES.map(e => e.symbol),
    ...BONDS.map(b => b.symbol),
    ...FX_SYMBOLS,
    ...COMMODITIES.map(c => c.symbol),
    ...SECTORS.map(s => s.symbol),
    ...CRYPTO.map(c => c.symbol),
  ])
];

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmtPrice(p, decimals = 2) {
  if (p == null) return '—';
  return p.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtPct(pct) {
  if (pct == null) return { text: '—', cls: '' };
  const sign = pct >= 0 ? '+' : '';
  const cls = pct >= 0 ? 'up' : 'dn';
  const intensity = Math.abs(pct) >= 3 ? ' strong' : '';
  return { text: `${sign}${pct.toFixed(2)}%`, cls: cls + intensity };
}

function fmtBps(chg) {
  if (chg == null) return { text: '—', cls: '' };
  const bps  = Math.round(chg * 100);
  const sign = bps >= 0 ? '+' : '';
  const cls  = bps >= 0 ? 'up' : 'dn';
  return { text: `${sign}${bps}bps`, cls };
}

function pctCell(pct) {
  const f = fmtPct(pct);
  return `<td class="num pct-cell ${f.cls}">${f.text}</td>`;
}

function skeletonRows(n, cols = 7) {
  return Array.from({ length: n }, () =>
    `<tr>${Array.from({ length: cols }, () => '<td><span class="skel"></span></td>').join('')}</tr>`
  ).join('');
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildStatStrip(quotes) {
  return STAT_STRIP.map(({ symbol, name, type }) => {
    const q    = quotes.get(symbol);
    const p    = q?.regularMarketPrice;
    const chg  = fmtPct(q?.pct1d ?? null);
    const ytd  = fmtPct(q?.pctYtd ?? null);

    let priceStr = '—';
    if (p != null) {
      if (type === 'yield') priceStr = p.toFixed(2) + '%';
      else if (type === 'crypto') priceStr = '$' + p.toLocaleString('en-US', { maximumFractionDigits: 0 });
      else if (type === 'commodity') priceStr = '$' + fmtPrice(p);
      else priceStr = fmtPrice(p);
    }

    return `
      <div class="mkt-stat-card">
        <div class="mkt-stat-name">${name}</div>
        <div class="mkt-stat-price">${priceStr}</div>
        <div class="mkt-stat-chg ${chg.cls}">${chg.text}</div>
        <div class="mkt-stat-ytd ${ytd.cls}">${ytd.text} YTD</div>
      </div>`;
  }).join('');
}

function buildEquitiesTable(quotes) {
  const regions = ['Americas', 'Europe', 'Asia-Pacific'];
  let rows = '';
  regions.forEach(region => {
    const items = EQUITIES.filter(e => e.region === region);
    rows += `<tr class="mkt-region-sep"><td colspan="7">${region}</td></tr>`;
    rows += items.map(({ symbol, name }) => {
      const q = quotes.get(symbol);
      const p = q?.regularMarketPrice;
      const priceStr = p != null ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
      return `<tr>
        <td class="mkt-name">${name}</td>
        <td class="num mono">${priceStr}</td>
        ${pctCell(q?.pct1d)}
        ${pctCell(q?.pct1w)}
        ${pctCell(q?.pct1m)}
        ${pctCell(q?.pct3m)}
        ${pctCell(q?.pctYtd)}
      </tr>`;
    }).join('');
  });

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Global Equities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Index</th>
          <th class="num">Level</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">3M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildBondsPanel(quotes) {
  const bondData = BONDS.map(({ symbol, name }) => {
    const q   = quotes.get(symbol);
    const yld = q?.regularMarketPrice ?? null;
    const chg = q?.regularMarketChange ?? null;
    return { name, yld, chg };
  });

  // Yield curve bars — normalize to max yield
  const maxYld = Math.max(0.01, ...bondData.map(b => b.yld ?? 0));

  const rows = bondData.map(({ name, yld, chg }) => {
    const bps    = fmtBps(chg);
    const yldStr = yld != null ? yld.toFixed(2) + '%' : '—';
    const barW   = yld != null ? (yld / maxYld) * 100 : 0;
    return `<tr>
      <td class="mkt-name">${name}</td>
      <td class="num mono">${yldStr}</td>
      <td class="yc-bar-cell"><span class="yc-bar" style="width:${barW.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${bps.cls}">${bps.text}</td>
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Treasuries</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Tenor</th>
          <th class="num">Yield</th>
          <th></th>
          <th class="num">1D Chg</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildFXMatrix(quotes) {
  // Build usdPer[code] = how many USD buy 1 unit of that currency
  const usdPer = { USD: 1 };
  FX_CURRENCIES.forEach(({ code, symbol, invert }) => {
    if (!symbol) return;
    const rate = quotes.get(symbol)?.regularMarketPrice;
    if (rate != null) usdPer[code] = invert ? 1 / rate : rate;
  });

  // Format a cross-rate value; use fewer decimals for large numbers (e.g. JPY pairs)
  const fmtRate = (v) => {
    if (v == null) return '—';
    if (v >= 100) return v.toFixed(2);
    if (v >= 10)  return v.toFixed(3);
    return v.toFixed(4);
  };

  const codes = FX_CURRENCIES.map(c => c.code);

  const headerCells = codes.map(c => `<th class="num fx-col-hdr">${c}</th>`).join('');

  const bodyRows = codes.map(rowCode => {
    const cells = codes.map(colCode => {
      if (rowCode === colCode) return `<td class="fx-diag">—</td>`;
      const uRow = usdPer[rowCode];
      const uCol = usdPer[colCode];
      const rate = (uRow != null && uCol != null && uCol !== 0) ? uRow / uCol : null;
      return `<td class="num fx-cell">${fmtRate(rate)}</td>`;
    }).join('');
    return `<tr><th class="fx-row-hdr">${rowCode}</th>${cells}</tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">FX Cross Rates <span class="mkt-panel-sub">1 row = X column</span></div>
      <div class="fx-matrix-wrap">
        <table class="fx-matrix">
          <thead><tr><th></th>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    </div>`;
}

function buildCommoditiesTable(quotes) {
  const groups = ['Metals', 'Energy', 'Agri'];
  let rows = '';
  groups.forEach(group => {
    const items = COMMODITIES.filter(c => c.group === group);
    rows += `<tr class="mkt-region-sep"><td colspan="7">${group}</td></tr>`;
    rows += items.map(({ symbol, name, unit }) => {
      const q = quotes.get(symbol);
      const p = q?.regularMarketPrice;
      const priceStr = p != null ? '$' + fmtPrice(p) : '—';
      return `<tr>
        <td class="mkt-name">${name}<span class="mkt-unit">${unit}</span></td>
        <td class="num mono">${priceStr}</td>
        ${pctCell(q?.pct1d)}
        ${pctCell(q?.pct1w)}
        ${pctCell(q?.pct1m)}
        ${pctCell(q?.pctYtd)}
      </tr>`;
    }).join('');
  });

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Commodities</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th>
          <th class="num">Price</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildSectorsPanel(quotes) {
  const items = SECTORS.map(({ symbol, name }) => {
    const q = quotes.get(symbol);
    return {
      name,
      pct1d:  q?.pct1d  ?? null,
      pct1m:  q?.pct1m  ?? null,
      pctYtd: q?.pctYtd ?? null,
    };
  });

  // Sort by 1D for visual ranking
  items.sort((a, b) => (b.pct1d ?? -999) - (a.pct1d ?? -999));

  const max1d  = Math.max(0.01, ...items.map(i => Math.abs(i.pct1d  ?? 0)));

  const rows = items.map(({ name, pct1d, pct1m, pctYtd }) => {
    const f1d   = fmtPct(pct1d);
    const f1m   = fmtPct(pct1m);
    const fYtd  = fmtPct(pctYtd);
    const barW  = pct1d != null ? (Math.abs(pct1d) / max1d) * 100 : 0;
    return `<tr>
      <td class="mkt-name sec-name">${name}</td>
      <td class="sec-bar-cell"><span class="sec-bar ${f1d.cls}" style="width:${barW.toFixed(1)}%"></span></td>
      <td class="num pct-cell ${f1d.cls}">${f1d.text}</td>
      <td class="num pct-cell ${f1m.cls}">${f1m.text}</td>
      <td class="num pct-cell ${fYtd.cls}">${fYtd.text}</td>
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">US Equity Sectors</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Sector</th>
          <th class="sec-bar-cell"></th>
          <th class="num">1D</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildCryptoPanel(quotes) {
  const rows = CRYPTO.map(({ symbol, name, abbr }) => {
    const q = quotes.get(symbol);
    const p = q?.regularMarketPrice;
    const priceStr = p != null
      ? '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: p >= 100 ? 2 : 4 })
      : '—';
    return `<tr>
      <td class="mkt-name">${name} <span class="mkt-abbr">${abbr}</span></td>
      <td class="num mono">${priceStr}</td>
      ${pctCell(q?.pct1d)}
      ${pctCell(q?.pct1w)}
      ${pctCell(q?.pct1m)}
      ${pctCell(q?.pctYtd)}
    </tr>`;
  }).join('');

  return `
    <div class="mkt-panel">
      <div class="mkt-panel-label">Crypto</div>
      <table class="mkt-table">
        <thead><tr>
          <th>Asset</th>
          <th class="num">Price (USD)</th>
          <th class="num">1D</th>
          <th class="num">1W</th>
          <th class="num">1M</th>
          <th class="num">YTD</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function renderMarketTab(container) {
  container.innerHTML = `
    <div class="mkt-topbar">
      <div class="mkt-topbar-left">
        <h2 class="mkt-title">Market Overview</h2>
        <span class="mkt-timestamp" id="mkt-timestamp">Loading…</span>
      </div>
      <button class="ghost-btn mkt-refresh-btn" id="mkt-refresh">↺ Refresh</button>
    </div>

    <!-- Quick Stats Strip -->
    <div class="mkt-stat-strip" id="mkt-stats">
      ${Array.from({ length: 6 }, () => `
        <div class="mkt-stat-card">
          <div class="mkt-stat-name"><span class="skel" style="width:60px"></span></div>
          <div class="mkt-stat-price"><span class="skel" style="width:90px;height:20px"></span></div>
          <div class="mkt-stat-chg"><span class="skel" style="width:55px"></span></div>
          <div class="mkt-stat-ytd"><span class="skel" style="width:70px"></span></div>
        </div>`).join('')}
    </div>

    <!-- Global Equities -->
    <section class="mkt-section" id="mkt-equities">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Global Equities</div>
        <table class="mkt-table"><tbody>${skeletonRows(18)}</tbody></table>
      </div>
    </section>

    <!-- Bonds + FX -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-bonds">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Treasuries</div>
          <table class="mkt-table"><tbody>${skeletonRows(4, 4)}</tbody></table>
        </div>
      </div>
      <div id="mkt-fx">
        <div class="mkt-panel">
          <div class="mkt-panel-label">FX Cross Rates</div>
          <div class="fx-matrix-wrap"><span class="skel" style="display:block;height:160px;margin:14px"></span></div>
        </div>
      </div>
    </section>

    <!-- Commodities + Sectors -->
    <section class="mkt-section mkt-two-col">
      <div id="mkt-commodities">
        <div class="mkt-panel">
          <div class="mkt-panel-label">Commodities</div>
          <table class="mkt-table"><tbody>${skeletonRows(8, 6)}</tbody></table>
        </div>
      </div>
      <div id="mkt-sectors">
        <div class="mkt-panel">
          <div class="mkt-panel-label">US Equity Sectors</div>
          <table class="mkt-table"><tbody>${skeletonRows(11, 5)}</tbody></table>
        </div>
      </div>
    </section>

    <!-- Crypto -->
    <section class="mkt-section" id="mkt-crypto">
      <div class="mkt-panel">
        <div class="mkt-panel-label">Crypto</div>
        <table class="mkt-table"><tbody>${skeletonRows(4, 6)}</tbody></table>
      </div>
    </section>
  `;

  const refreshBtn = container.querySelector('#mkt-refresh');

  async function load() {
    const tsEl = container.querySelector('#mkt-timestamp');
    tsEl.textContent = 'Loading…';

    const quotes = await fetchAll(ALL_SYMBOLS);
    if (!container.isConnected) return;

    container.querySelector('#mkt-stats').innerHTML     = buildStatStrip(quotes);
    container.querySelector('#mkt-equities').innerHTML  = buildEquitiesTable(quotes);
    container.querySelector('#mkt-bonds').innerHTML     = buildBondsPanel(quotes);
    container.querySelector('#mkt-fx').innerHTML        = buildFXMatrix(quotes);
    container.querySelector('#mkt-commodities').innerHTML = buildCommoditiesTable(quotes);
    container.querySelector('#mkt-sectors').innerHTML   = buildSectorsPanel(quotes);
    container.querySelector('#mkt-crypto').innerHTML    = buildCryptoPanel(quotes);

    const ts = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    tsEl.textContent = `Updated ${ts}`;
  }

  refreshBtn.addEventListener('click', load);
  await load();

  const timer = setInterval(load, 30 * 60 * 1000);
  return () => clearInterval(timer);
}
