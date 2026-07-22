import { defineConfig } from 'vite';

export default defineConfig({
  base: '/investment-dash/',
  server: {
    proxy: {
      // In dev, /yf/* is proxied to Yahoo Finance to avoid CORS.
      // The browser User-Agent header is required — without it Yahoo Finance returns 429.
      '/yf': {
        target: 'https://query2.finance.yahoo.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/yf/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      },
    },
  },
});
