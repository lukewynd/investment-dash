// ── Single Stock Analysis Tab ─────────────────────────────────────────────────

export function renderStockTab(container) {
  container.innerHTML = `
    <div class="placeholder-view">
      <div class="placeholder-icon">📈</div>
      <div class="placeholder-title">Single Stock Analysis</div>
      <p class="placeholder-body">
        Search for any stock to see price history, key metrics, financials,
        analyst estimates, and more. Coming soon.
      </p>
    </div>
  `;
}
