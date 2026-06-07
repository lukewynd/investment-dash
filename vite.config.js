import { defineConfig } from 'vite';

export default defineConfig({
  base: '/investment-dash/',
  server: {
    proxy: {
      // In dev, /yf/* is proxied to Yahoo Finance to avoid CORS
      '/yf': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/yf/, ''),
      },
    },
  },
});
