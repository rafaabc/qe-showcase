// Custom command, not a page object: Cypress's best-practices docs list
// "sharing page objects" as an anti-pattern. Their fix there is
// programmatic/cached login (cy.session()); we skip that (see below)
// since auth state didn't restore reliably across cy.visit() in headless
// runs, and re-running the login UI is cheap enough for this suite size.
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/");
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password, { log: false });
  cy.get('[data-test="login-button"]').click();
  cy.url().should("include", "/inventory.html");
});

// Tried seeding session/cart state and jumping straight to
// /checkout-step-one.html via cy.visit() to skip re-driving login +
// add-to-cart per checkout test. Not possible: SauceDemo (GitHub Pages)
// routes non-root paths through a client-side script that only a real
// browser runs, so cy.visit() 404s before it fires. checkout.cy.js drives
// the full UI flow instead. In a real app, seeding data (or an API layer)
// would still beat doing it all through the UI.
