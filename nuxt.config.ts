// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // Отключаем SSR для WebRTC
  nitro: {
    experimental: {
      websocket: true
    }
  },
  runtimeConfig: {
    public: {
      socketUrl: process.env.NODE_ENV === 'production' ? '' : ''
    }
  }
})
