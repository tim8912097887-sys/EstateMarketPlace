import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Standard vite port
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Save CI resources
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
