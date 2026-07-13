*Based on ISO-29119-3 and defect management tooling.*

| Field | Detail |
| :-- | :-- |
| **ID** | BUG-001 |
| **Title** | Users lose their chosen product sort after visiting the cart |
| **Tester** | Rafael Albuquerque |
| **Date and Time** | 2026-07-11 |
| **Expected Result** | The chosen sort order persists when the user returns to the Products page within the same session (e.g. after a click on a return button). |
| **Actual Result** | Sort order is only kept in local component state, not restored when the Products page is revisited. After adding an item to the cart and navigating back, the sort dropdown resets to **Name (A to Z)** and the list re-renders in that order — the **Price (low to high)** selection is lost. |
| **Evidence** | <video src="https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-1-sort-not-persisted.mp4" controls width="400"></video><br>[▶ open recording](https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-1-sort-not-persisted.mp4) (fallback if the player doesn't load) |
| **Priority** | Low -> can be fixed in a future cycle |
| **Severity** | Low -> user has a workaround (re-select the sort) |
| **Software Info** | saucedemo.com, `standard_user`, Chrome (via Cypress) |
| **Traceability** | `cypress/e2e/checkout.cy.js` → "SauceDemo sorting" → `keeps the selected sort order after a cart round-trip` (currently `.skip`ped regression guard) |
| **Status** | Open |

**Steps to Reproduce:**
1. Log in as `standard_user`.
2. On the Products page, set sort to **Price (low to high)**.
3. Add any item to the cart.
4. Open the cart, then navigate back to the Products page.
