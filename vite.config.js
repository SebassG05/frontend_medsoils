import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  server: {
    port: 3017,
    proxy: {
      '/api': {
        target: 'http://localhost:5116', // Puerto backend Express
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      // ✅ AÑADIR: Estrategia de generación del SW
      strategies: 'generateSW', // Genera automáticamente el Service Worker
      // Disabled in development to prevent stale SW from reloading the page on first load
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg}'],
        globIgnores: ['**/arrow-left*.js'],
        navigateFallback: null,
        skipWaiting: false,
        clientsClaim: false,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/translate\.google\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-translate',
            },
          },
        ]
      },
      includeAssets: ['Corporatives/Images/Logo/Logo.png', 'Corporatives/Typography/Rondana Regular.otf'],
      manifest: {
        name: 'Campus Evenor - Soluciones Tecnológicas',
        short_name: 'Campus Evenor - Soluciones Tecnológicas',
        description: 'Soluciones tecnológicas innovadoras para el uso sostenible y la protección de suelos',
        theme_color: '#a1db87',
        background_color: '#222222',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['technology', 'science', 'environment'],
        icons: [
          // PWA icons temporarily disabled - add icons to /public/pwa-icons/ to enable
        ],
        shortcuts: []
      }
    })
  ],
})