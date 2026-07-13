const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      // cy.log() only writes to the Cypress GUI command log - it never
      // reaches stdout in a headless `cypress run`, so CI gives no phase
      // context on failure. cy.task() runs Node-side, so console.log here
      // does print to the CI terminal.
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
