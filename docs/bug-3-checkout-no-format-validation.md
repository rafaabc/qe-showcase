*Based on ISO-29119-3 and defect management tooling.*

| Field | Detail |
| :-- | :-- |
| **ID** | BUG-003 |
| **Title** | Users can complete an order with invalid name/shipping data |
| **Tester** | Rafael Albuquerque |
| **Date and Time** | 2026-07-11 |
| **Expected Result** | Required-field checks should also cover basic format (e.g. reject non-alphanumeric postal codes, reject pure-symbol names). |
| **Actual Result** | Checkout fields are validated only for presence (`required`), never for format. Entering First Name = `123456`, Last Name = `!@#$%^`, Postal Code = `abcXYZ!!` produces no validation error at any step and the order completes end-to-end ("Thank you for your order!") with digits in a name field, symbols in a name field, and letters/symbols in a postal code. |
| **Evidence** | <video src="https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-3-checkout-no-format-validation.mp4" controls width="400"></video><br>[▶ open recording](https://raw.githubusercontent.com/rafaabc/qe-showcase/submission/docs/evidence/bug-3-checkout-no-format-validation.mp4) (fallback if the player doesn't load) |
| **Priority** | Medium -> can be fixed during the sprint |
| **Severity** | High -> no workaround, invalid data is silently accepted, not blocked |
| **Software Info** | saucedemo.com, `standard_user`, Chrome (via Cypress) |
| **Traceability** | `cypress/e2e/checkout.cy.js` → "Checkout form validation" → `rejects a postal code that isn't a plausible postal code` (currently `.skip`ped regression guard) |
| **Status** | Open |

**Steps to Reproduce:**
1. Log in as `standard_user`, add an item to the cart, proceed to checkout.
2. Enter First Name = `123456`, Last Name = `!@#$%^`, Postal Code = `abcXYZ!!`.
3. Click **Continue**, then **Finish**.
