// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // Отключаем SSR для WebRTC
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },
  runtimeConfig: {
    public: {
      socketUrl: process.env.NODE_ENV === 'production' 
        ? 'wss://voiceover.evil-chan.ru' 
        : 'http://localhost:3001'
    }
  }
})
