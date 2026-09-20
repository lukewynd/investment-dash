// ── App Shell ─────────────────────────────────────────────────────────────────

import { renderMarketTab }    from './market.js';
import { renderStockTab }     from './stock.js';
import { renderPortfolioTab } from './portfolio.js';

const TABS = ['market', 'stock', 'portfolio'];
const TAB_LABELS = { market: 'Macro monitor', stock: 'Single name', portfolio: 'Portfolio lab' };
const TAB_KICKERS = { market: '01', stock: '02', portfolio: '03' };

let _activeTab   = 'market';
let _teardown    = null;   // cleanup fn returned by active tab
const THEME_KEY = 'macro-monitor-theme';

function getTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function renderApp(root) {
  const initialTheme = getTheme();
  applyTheme(initialTheme);
  root.innerHTML = `
    <div class="app-frame">
      <header class="topbar">
        <div class="brand-lockup"><div class="logo">MACRO MONITOR</div><div class="brand-sub">GLOBAL MULTI-ASSET RESEARCH</div></div>
        <div class="topbar-center"><nav class="tabs" id="main-tabs">
          ${TABS.map(t => `<button class="tab ${t === _activeTab ? 'active' : ''}" data-tab="${t}"><span class="tab-num">${TAB_KICKERS[t]}</span>${TAB_LABELS[t]}</button>`).join('')}
        </nav></div>
        <div class="topbar-right"><span class="market-status"><i></i> DATA LINKED</span><span class="topbar-date">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme" aria-pressed="${initialTheme === 'light'}"><span class="theme-icon" aria-hidden="true">${initialTheme === 'light' ? 'D' : 'L'}</span><span class="theme-label">${initialTheme === 'light' ? 'Dark' : 'Light'}</span></button></div>
      </header>
      <main class="main-content" id="tab-content"></main>
      <footer class="app-footer"><span>NSM / TERMINAL</span><span>MARKET DATA: YAHOO FINANCE · DELAYED / INDICATIVE</span><span>LOCAL SESSION</span></footer>
    </div>
  `;

  const tabsEl   = root.querySelector('#main-tabs');
  const contentEl = root.querySelector('#tab-content');
  const themeToggle = root.querySelector('#theme-toggle');

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme === 'light' ? 'dark' : 'light'} theme`);
    themeToggle.querySelector('.theme-icon').textContent = nextTheme === 'light' ? 'D' : 'L';
    themeToggle.querySelector('.theme-label').textContent = nextTheme === 'light' ? 'Dark' : 'Light';
    try { localStorage.setItem(THEME_KEY, nextTheme); } catch {}
  });

  function switchTab(tab) {
    if (tab === _activeTab) return;
    _activeTab = tab;

    tabsEl.querySelectorAll('.tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    activateTab(contentEl, tab);
  }

  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (btn) switchTab(btn.dataset.tab);
  });

  activateTab(contentEl, _activeTab);
}

function activateTab(contentEl, tab) {
  // Run any cleanup from previous tab (e.g. clear refresh intervals)
  if (_teardown) { _teardown(); _teardown = null; }

  contentEl.innerHTML = '';

  if (tab === 'market') {
    renderMarketTab(contentEl).then(teardown => { _teardown = teardown ?? null; });
  } else if (tab === 'stock') {
    renderStockTab(contentEl).then(teardown => { _teardown = teardown ?? null; });
  } else if (tab === 'portfolio') {
    const td = renderPortfolioTab(contentEl);
    _teardown = td ?? null;
  }
}
