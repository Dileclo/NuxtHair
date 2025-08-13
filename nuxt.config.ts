// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI, // серверу
    mongoDb: process.env.MONGO_DB, // серверу
    public: { apiBase: "/api" }, // клиенту
  },
  compatibilityDate: "2025-07-16",
});
