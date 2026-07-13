// Negative login coverage; happy path is exercised in checkout.cy.js.
// Other demo personas (e.g. problem_user) simulate expected product bugs,
// so out of scope here.
describe("SauceDemo login", () => {
  // TC-06.
  it("locked-out user is rejected with an explicit lockout message and stays out", () => {
    cy.fixture("users").then((users) => {
      cy.visit("/");
      cy.get('[data-test="username"]').type(users.lockedOut.username);
      cy.get('[data-test="password"]').type(users.lockedOut.password, { log: false });
      cy.get('[data-test="login-button"]').click();
    });

    cy.get('[data-test="error"]').should(
      "have.text",
      "Epic sadface: Sorry, this user has been locked out."
    );
    cy.location("pathname").should("not.eq", "/inventory.html");
  });
});
