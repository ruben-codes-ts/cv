export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  // Nuxt 4.4.5 + unstorage 1.17.6 reject the payload cache key "/". No async data here, so skip payloads.
  experimental: { payloadExtraction: false },
  css: [
    '@fontsource-variable/inter',
    '@fontsource-variable/source-serif-4',
    '~/assets/cv.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  nitro: { prerender: { routes: ['/', '/nl'] } },
})
