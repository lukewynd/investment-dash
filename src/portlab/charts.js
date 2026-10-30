// ── Portfolio Lab charts ──────────────────────────────────────────────────────
// A small SVG renderer for time series (lines or stacked areas) and dated event
// bars, each with a hover tooltip, plus theme lookups shared with the
// lightweight-charts panels.

// Categorical slots validated for colour-vision deficiency on the app's surfaces.
// Assets keep the slot of their position in the portfolio; ninth and later fold into "Other".
const PALETTE = {
  dark:  ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'],
};
export const MAX_SERIES = PALETTE.dark.length;

export function chartTheme() {
  const theme = document.documentElement.dataset.theme || 'dark';
  const css = getComputedStyle(document.documentElement);
  const v = name => css.getPropertyValue(name).trim();
  const dark = theme === 'dark';
  return {
    dark,
    series: dark ? PALETTE.dark : PALETTE.light,
    text: v('--text-muted'), faint: v('--text-faint'), ink: v('--text-primary'),
    grid: v('--border'), border: v('--border-light'), accent: v('--accent'),
    up: v('--green'), down: v('--red'),
    other: dark ? '#7d867f' : '#8e8e86',
    fontSize: theme === 'more-visible' ? 14 : 11,
    lineWidth: theme === 'more-visible' ? 3 : 2,
    mono: v('--font-mono'),
  };
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = key => `${+key.slice(8, 10)} ${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(2, 4)}`;
const axisDate = key => `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(2, 4)}`;

function niceTicks(min, max, count = 5) {
  if (!(max > min)) { max = min + 1; min -= 1; }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  const ticks = [];
  for (let v = Math.floor(min / step + 1e-6) * step; v <= max + step * 1e-6; v += step) ticks.push(+v.toFixed(12));
  if (ticks[ticks.length - 1] < max - step * 1e-6) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

function legendHtml(series) {
  return `<div class="pl-legend">${series.map(s =>
    `<span class="pl-legend-item"><i class="${s.dash ? 'dash' : ''}" style="--c:${s.color}"></i>${esc(s.label)}</span>`).join('')}</div>`;
}

function placeTip(tip, host, x, y) {
  tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight, W = host.clientWidth;
  tip.style.left = `${Math.min(Math.max(4, x + 14 + w > W ? x - w - 14 : x + 14), W - w - 4)}px`;
  tip.style.top  = `${Math.max(4, y - h / 2)}px`;
}

function observe(el, draw) {
  let lastW = 0;
  const redraw = () => { if (el.clientWidth && el.clientWidth !== lastW) { lastW = el.clientWidth; draw(); } };
  const ro = new ResizeObserver(redraw);
  ro.observe(el);
  redraw();
  return () => ro.disconnect();
}

// series: [{ label, color, values, dash? }]. Stacked series put positives above zero
// and negatives below. `rules` draws dated vertical markers: [{ index, label }].
export function timeChart(el, { dates, series, stacked = false, height = 260, fmt = v => v.toFixed(2), rules = [], zero = true, total }) {
  el.innerHTML = `${legendHtml(series)}<div class="pl-tc-plot" style="height:${height}px"></div><div class="pl-tip" hidden></div>`;
  const plot = el.querySelector('.pl-tc-plot'), tip = el.querySelector('.pl-tip');
  const N = dates.length;
  const step = Math.max(1, Math.ceil(N / 700));
  const idx = [];
  for (let i = 0; i < N; i += step) idx.push(i);
  if (idx[idx.length - 1] !== N - 1) idx.push(N - 1);
  const P = idx.length;

  const lo = series.map(() => new Float64Array(P)), hi = series.map(() => new Float64Array(P));
  let yMin = zero ? 0 : Infinity, yMax = zero ? 0 : -Infinity;
  idx.forEach((i, p) => {
    let pos = 0, neg = 0;
    series.forEach((s, j) => {
      const v = s.values[i];
      if (!Number.isFinite(v)) { lo[j][p] = hi[j][p] = NaN; return; }
      if (stacked) {
        if (v >= 0) { lo[j][p] = pos; hi[j][p] = pos += v; } else { hi[j][p] = neg; lo[j][p] = neg += v; }
      } else lo[j][p] = hi[j][p] = v;
      yMin = Math.min(yMin, lo[j][p]); yMax = Math.max(yMax, hi[j][p]);
    });
  });
  if (!Number.isFinite(yMin)) { yMin = 0; yMax = 1; }

  const m = { l: 56, r: 12, t: 10, b: 26 };
  let W = 0, x = () => 0, y = () => 0;
  const pOf = i => { let lo2 = 0, hi2 = P - 1; while (lo2 < hi2) { const mid = (lo2 + hi2) >> 1; if (idx[mid] < i) lo2 = mid + 1; else hi2 = mid; } return lo2; };

  function draw() {
    W = Math.max(280, plot.clientWidth);
    const H = height;
    const ticks = niceTicks(yMin, yMax);
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    x = p => m.l + (P < 2 ? 0 : p / (P - 1) * (W - m.l - m.r));
    y = v => m.t + (1 - (v - y0) / (y1 - y0)) * (H - m.t - m.b);

    const grid = ticks.map(t => `<line class="pl-grid" x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}"/>
      <text class="pl-axis" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${esc(fmt(t))}</text>`).join('');
    const xCount = Math.max(2, Math.floor((W - m.l - m.r) / 96));
    const xLabels = Array.from({ length: xCount }, (_, q) => Math.round(q / (xCount - 1) * (P - 1)))
      .map((p, q) => `<text class="pl-axis" x="${x(p)}" y="${H - 8}" text-anchor="${q === 0 ? 'start' : q === xCount - 1 ? 'end' : 'middle'}">${axisDate(dates[idx[p]])}</text>`).join('');
    const ruleSvg = rules.map(r => `<line class="pl-rule" x1="${x(pOf(r.index))}" x2="${x(pOf(r.index))}" y1="${m.t}" y2="${H - m.b}"><title>${esc(r.label)}</title></line>`).join('');

    const pathOf = (arr, reverse = false) => {
      let d = '', pen = false;
      const order = reverse ? [...Array(P).keys()].reverse() : [...Array(P).keys()];
      order.forEach(p => {
        const v = arr[p];
        if (!Number.isFinite(v)) { pen = false; return; }
        d += `${pen ? 'L' : (reverse ? 'L' : 'M')}${x(p).toFixed(1)},${y(v).toFixed(1)}`;
        pen = true;
      });
      return d;
    };
    const shapes = series.map((s, j) => stacked
      ? `<path class="pl-area" d="${pathOf(hi[j])}${pathOf(lo[j], true)}Z" fill="${s.color}"/>`
      : `<path class="pl-line${s.dash ? ' dash' : ''}" d="${pathOf(hi[j])}" stroke="${s.color}"/>`).join('');
    const zeroLine = y0 < 0 && y1 > 0 ? `<line class="pl-zero" x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}"/>` : '';

    plot.innerHTML = `<svg width="${W}" height="${H}" role="img">
      ${grid}${xLabels}${shapes}${zeroLine}${ruleSvg}
      <line class="pl-cross" y1="${m.t}" y2="${H - m.b}" visibility="hidden"/>
      <g class="pl-dots"></g>
    </svg>`;
  }

  function hover(e) {
    const rect = plot.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const p = Math.max(0, Math.min(P - 1, Math.round((px - m.l) / (W - m.l - m.r) * (P - 1))));
    const i = idx[p], cx = x(p);
    const cross = plot.querySelector('.pl-cross');
    if (!cross) return;
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('visibility', 'visible');
    plot.querySelector('.pl-dots').innerHTML = stacked ? '' : series.map((s, j) =>
      Number.isFinite(hi[j][p]) ? `<circle cx="${cx}" cy="${y(hi[j][p])}" r="4" fill="${s.color}" class="pl-dot"/>` : '').join('');
    const rows = (stacked ? [...series].reverse() : series)
      .filter(s => Number.isFinite(s.values[i]) && (!stacked || Math.abs(s.values[i]) > 1e-6))
      .map(s => `<div class="pl-tip-row"><i style="background:${s.color}"></i><span>${esc(s.label)}</span><b>${esc(fmt(s.values[i]))}</b></div>`).join('');
    const totalRow = total ? `<div class="pl-tip-row pl-tip-total"><span>${esc(total.label)}</span><b>${esc(fmt(total.values[i]))}</b></div>` : '';
    tip.innerHTML = `<div class="pl-tip-date">${shortDate(dates[i])}</div>${rows}${totalRow}`;
    placeTip(tip, el, cx, e.clientY - el.getBoundingClientRect().top);
  }
  function leave() {
    tip.hidden = true;
    plot.querySelector('.pl-cross')?.setAttribute('visibility', 'hidden');
    const dots = plot.querySelector('.pl-dots');
    if (dots) dots.innerHTML = '';
  }

  plot.addEventListener('pointermove', hover);
  plot.addEventListener('pointerleave', leave);
  return observe(plot, draw);
}

// Dated bars on a continuous time axis: buys above zero, sells below.
// events: [{ index, up, down, html }] with up/down as positive magnitudes.
export function eventBars(el, { dates, events, height = 200, fmt = v => v.toFixed(2), upLabel = 'Buys', downLabel = 'Sells' }) {
  const th = chartTheme();
  el.innerHTML = `${legendHtml([{ label: upLabel, color: th.up }, { label: downLabel, color: th.down }])}
    <div class="pl-tc-plot" style="height:${height}px"></div><div class="pl-tip" hidden></div>`;
  const plot = el.querySelector('.pl-tc-plot'), tip = el.querySelector('.pl-tip');
  const N = dates.length;
  const ext = Math.max(1e-9, ...events.map(e => Math.max(e.up, e.down)));
  const m = { l: 56, r: 12, t: 10, b: 26 };

  function draw() {
    const W = Math.max(280, plot.clientWidth), H = height;
    const ticks = niceTicks(-ext, ext, 4);
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const x = i => m.l + (N < 2 ? 0 : i / (N - 1) * (W - m.l - m.r));
    const y = v => m.t + (1 - (v - y0) / (y1 - y0)) * (H - m.t - m.b);
    const bw = Math.max(3, Math.min(14, (W - m.l - m.r) / Math.max(events.length, 1) * 0.6));
    const grid = ticks.map(t => `<line class="pl-grid" x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}"/>
      <text class="pl-axis" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${esc(fmt(Math.abs(t)))}</text>`).join('');
    const xCount = Math.max(2, Math.floor((W - m.l - m.r) / 96));
    const xLabels = Array.from({ length: xCount }, (_, q) => Math.round(q / (xCount - 1) * (N - 1)))
      .map((i, q) => `<text class="pl-axis" x="${x(i)}" y="${H - 8}" text-anchor="${q === 0 ? 'start' : q === xCount - 1 ? 'end' : 'middle'}">${axisDate(dates[i])}</text>`).join('');
    const bars = events.map((e, j) => {
      const cx = x(e.index) - bw / 2;
      return `<g class="pl-evt" data-j="${j}">
        <rect class="pl-hit" x="${cx - 4}" y="${m.t}" width="${bw + 8}" height="${H - m.t - m.b}"/>
        ${e.up > 0 ? `<rect x="${cx}" y="${y(e.up)}" width="${bw}" height="${Math.max(1, y(0) - y(e.up) - 1)}" rx="2" fill="${th.up}"/>` : ''}
        ${e.down > 0 ? `<rect x="${cx}" y="${y(0) + 1}" width="${bw}" height="${Math.max(1, y(-e.down) - y(0) - 1)}" rx="2" fill="${th.down}"/>` : ''}
      </g>`;
    }).join('');
    plot.innerHTML = `<svg width="${W}" height="${H}" role="img">${grid}${xLabels}
      <line class="pl-zero" x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}"/>${bars}</svg>`;
  }

  plot.addEventListener('pointermove', e => {
    const g = e.target.closest?.('.pl-evt');
    if (!g) { tip.hidden = true; return; }
    tip.innerHTML = events[+g.dataset.j].html;
    const host = el.getBoundingClientRect();
    placeTip(tip, el, e.clientX - host.left, e.clientY - host.top);
  });
  plot.addEventListener('pointerleave', () => { tip.hidden = true; });
  return observe(plot, draw);
}
