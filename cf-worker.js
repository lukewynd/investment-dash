/**
 * Cloudflare Worker — Yahoo Finance CORS proxy
 *
 * Deploy steps (free Cloudflare account required):
 *   1. npx wrangler deploy cf-worker.js --name yf-proxy --compatibility-date 2024-01-01
 *      (or paste this into the Cloudflare dashboard Workers editor)
 *   2. Copy the worker URL (e.g. https://yf-proxy.yourname.workers.dev)
 *   3. Set CF_WORKER_BASE in src/api.js to that URL
 *
 * Free tier: 100,000 requests/day — more than enough for a personal dashboard.
 */

const YF_HOST = 'https://query2.finance.yahoo.com';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const targetUrl = YF_HOST + url.pathname + url.search;

    const yfResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    const body = await yfResponse.text();

    return new Response(body, {
      status: yfResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        ...corsHeaders(),
      },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
