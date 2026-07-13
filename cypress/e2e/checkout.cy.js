// SauceDemo purchase flow: login -> sort -> cart -> checkout -> complete,
// plus checkout validation and skipped regression guards (see docs/bug-*.md).
// Not covered by choice: multi-item cart, every sort order, cart removal,
// other demo users, non-functional checks, order PDF/receipt content.

describe("SauceDemo purchase flow", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.standard.username, users.standard.password);
    });
  });

  // TC-01. Single linear journey, each step depends on the last; cy.task("log", ...)
  // marks phases and prints to CI stdout for triage (cy.log() alone only
  // shows in the Cypress GUI, not in a headless run - see docs/debugging-notes.md).
  it("logs in, sorts, adds an item, checks out, and completes the order", () => {
    cy.task("log", "Sort by price low -> high");
    cy.get('[data-test="product-sort-container"]').select("lohi");
    // Check the actual prices on screen, not just the dropdown value.
    // .should() retries the whole read+compare until it passes (or times
    // out), instead of trusting one snapshot that could land mid-re-render.
    cy.get('[data-test="inventory-item-price"]').should(($els) => {
      const prices = [...$els].map((el) => parseFloat(el.innerText.split("$")[1]));
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).to.be.at.least(prices[i - 1]);
      }
    });

    // Alias top item's name/price instead of hardcoding, so later steps
    // verify the same item follows through regardless of which sorts first.
    cy.get('[data-test="inventory-item"]')
      .first()
      .within(() => {
        cy.get('[data-test="inventory-item-name"]').invoke("text").as("itemName");
        cy.get('[data-test="inventory-item-price"]').invoke("text").as("itemPrice");
        cy.task("log", "Add item to cart");
        cy.get('[data-test^="add-to-cart"]').click();
      });
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");

    cy.task("log", "Open cart and confirm the item added is the one there");
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="inventory-item"]').should("have.length", 1);
    cy.get("@itemName").then((name) => {
      cy.get('[data-test="inventory-item-name"]').should("have.text", name);
    });
    cy.get("@itemPrice").then((price) => {
      cy.get('[data-test="inventory-item-price"]').should("have.text", price);
    });

    cy.task("log", "Checkout: fill in buyer info from fixture data");
    cy.get('[data-test="checkout"]').click();
    cy.fixture("checkout").then((buyer) => {
      cy.get('[data-test="firstName"]').type(buyer.firstName);
      cy.get('[data-test="lastName"]').type(buyer.lastName);
      cy.get('[data-test="postalCode"]').type(buyer.postalCode);
    });
    cy.get('[data-test="continue"]').click();

    cy.task("log", "Review order: same item carried through to the overview page");
    cy.get("@itemName").then((name) => {
      cy.get('[data-test="inventory-item-name"]').should("have.text", name);
    });
    cy.get("@itemPrice").then((price) => {
      cy.get('[data-test="inventory-item-price"]').should("have.text", price);
    });

    cy.task("log", "Totals: subtotal is the price shown at selection; total = subtotal + tax");
    // Subtotal charged must equal the price seen on the Products page.
    // Label reads e.g. "Item total: $29.99", hence the split on "$".
    cy.get("@itemPrice").then((price) => {
      cy.get('[data-test="subtotal-label"]')
        .invoke("text")
        .then((label) => parseFloat(label.split("$")[1]))
        .should("eq", parseFloat(price.split("$")[1]));
    });
    // Total must equal subtotal + tax; compare at 2 decimals to dodge float noise.
    cy.get('[data-test="subtotal-label"]').invoke("text").then((subtotalLabel) => {
      cy.get('[data-test="tax-label"]').invoke("text").then((taxLabel) => {
        const expectedTotal =
          parseFloat(subtotalLabel.split("$")[1]) + parseFloat(taxLabel.split("$")[1]);
        cy.get('[data-test="total-label"]')
          .invoke("text")
          .then((totalLabel) => parseFloat(totalLabel.split("$")[1]).toFixed(2))
          .should("eq", expectedTotal.toFixed(2));
      });
    });

    cy.task("log", "Finish and assert order success, not just 'some page loaded'");
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should("have.text", "Thank you for your order!");
    cy.get('[data-test="back-to-products"]').should("be.visible");
    cy.get('[data-test="shopping-cart-badge"]').should("not.exist");
  });
});

describe("SauceDemo sorting", () => {
  // TC-02. Regression guard for docs/bug-1-sort-not-persisted.md; skipped
  // since it fails against the live app.
  it.skip("keeps the selected sort order after a cart round-trip", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.standard.username, users.standard.password);
    });

    cy.get('[data-test="product-sort-container"]').select("lohi");
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="continue-shopping"]').click();

    // Actual: resets to Name (A to Z) (see BUG-001).
    cy.get('[data-test="product-sort-container"]').should("have.value", "lohi");
    cy.get('[data-test="inventory-item-price"]')
      .then(($prices) => [...$prices].map((el) => parseFloat(el.innerText.split("$")[1])))
      .then((prices) => {
        for (let i = 1; i < prices.length; i++) {
          expect(prices[i]).to.be.at.least(prices[i - 1]);
        }
      });
  });
});

describe("SauceDemo reset app state", () => {
  // TC-03. Regression guard for docs/bug-2-reset-state-button-desync.md;
  // skipped since it fails against the live app.
  it.skip("reverts item buttons to 'Add to cart' after resetting app state", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.standard.username, users.standard.password);
    });

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').should("be.visible");

    // Burger icon's <img> is decorative, layered under the real <button> -
    // force click.
    cy.get('[data-test="open-menu"]').click({ force: true });
    cy.get('[data-test="reset-sidebar-link"]').click({ force: true });
    
    // Actual: badge clears, button still reads "Remove" (see BUG-002).
    cy.get('[data-test="shopping-cart-badge"]').should("not.exist");
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should("be.visible");
  });
});

describe("Checkout form validation", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.standard.username, users.standard.password);
    });
  });

  // TC-04.
  it("blocks checkout when a required field is missing", () => {
    // Direct cy.visit() to checkout-step-one.html 404s (see commands.js) -
    // drive the 3 UI clicks instead.
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();

    // Leave firstName blank - fill only the rest of the form.
    cy.fixture("checkout").then((buyer) => {
      cy.get('[data-test="lastName"]').type(buyer.lastName);
      cy.get('[data-test="postalCode"]').type(buyer.postalCode);
    });
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should("contain.text", "Error: First Name is required");
  });

  // TC-05. Regression guard for docs/bug-3-checkout-no-format-validation.md;
  // skipped since it fails against the live app.
  it.skip("rejects a postal code that isn't a plausible postal code", () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type("Jane");
    cy.get('[data-test="lastName"]').type("Doe");
    cy.get('[data-test="postalCode"]').type("abcXYZ!!");
    cy.get('[data-test="continue"]').click();

    // Actual: no error, advances to overview (see BUG-003).
    cy.get('[data-test="error"]').should("be.visible");
    cy.location("pathname").should("eq", "/checkout-step-one.html");
  });
});