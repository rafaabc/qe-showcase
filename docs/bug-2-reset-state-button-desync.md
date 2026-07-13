*Based on ISO-29119-3 and defect management tooling.*

| Field | Detail |
| :-- | :-- |
| **ID** | BUG-002 |
| **Title** | Users see a stale "Remove" button that misrepresents an emptied cart |
| **Tester** | Rafael Albuquerque |
| **Date and Time** | 2026-07-11 |
| **Expected Result** | **Reset App State** returns the page to a fully clean state in one action, cart badge cleared and all item buttons reverted to "Add to cart". |
| **Actual Result** | **Reset App State** clears the cart's underlying data but doesn't re-render the per-item button state. The cart badge clears, but the item's button still reads **"Remove"** instead of reverting to **"Add to cart"**. A manual page reload is required to fix it. |
| **Evidence** | <video src="https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-2-reset-state-button-desync.mp4" controls width="400"></video><br>[▶ open recording](https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-2-reset-state-button-desync.mp4) (fallback if the player doesn't load) |
| **Priority** | Medium -> can be fixed during the sprint |
| **Severity** | Medium -> user has a workaround (reload the page) |
| **Software Info** | saucedemo.com, `standard_user`, Chrome (via Cypress) |
| **Traceability** | `cypress/e2e/checkout.cy.js` → "SauceDemo reset app state" → `reverts item buttons to 'Add to cart' after resetting app state` (currently `.skip`ped regression guard) |
| **Status** | Open |

**Steps to Reproduce:**
1. Log in as `standard_user`.
2. Add an item to the cart (its button changes to "Remove").
3. Open the menu (☰) and click **Reset App State**.
