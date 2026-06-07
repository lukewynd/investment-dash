// ── App Shell ─────────────────────────────────────────────────────────────────

import { renderMarketTab }    from './market.js';
import { renderStockTab }     from './stock.js';
import { renderPortfolioTab } from './portfolio.js';

const TABS = ['market', 'stock', 'portfolio'];
const TAB_LABELS = { market: 'Markets', stock: 'Stock Analysis', portfolio: 'Portfolio' };

let _activeTab   = 'market';
let _teardown    = null;   // cleanup fn returned by active tab

export function renderApp(root) {
  root.innerHTML = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="logo">invest<span>.</span>dash</div>
      </div>
      <div class="topbar-center">
        <div class="tabs" id="main-tabs">
          ${TABS.map(t => `
            <button class="tab ${t === _activeTab ? 'active' : ''}" data-tab="${t}">
              ${TAB_LABELS[t]}
            </button>`).join('')}
        </div>
      </div>
      <div class="topbar-right"></div>
    </div>

    <div class="main-content" id="tab-content"></div>
  `;

  const tabsEl   = root.querySelector('#main-tabs');
  const contentEl = root.querySelector('#tab-content');

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
    renderStockTab(contentEl);
  } else if (tab === 'portfolio') {
    renderPortfolioTab(contentEl);
  }
}
