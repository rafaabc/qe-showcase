*Based on ISO-29119-3.*

# Adapted Test Plan and Strategy

**Overall estimate:** ~30 minutes, per the task brief.

## 1. Test Ideas

No formal user stories were provided for this task. The brief is a flat list of steps, so scope is tracked as test ideas instead of formal and structured user stories.

| Idea | Description |
| :-- | :-- |
| Purchase flow | Login, sort, add to cart, checkout, order completion |
| Checkout validation | Required-field blocking, format validation |
| Negative login | Locked-out user rejection |

## 2. Test Conditions and Automation Status

| ID | Condition | Expected Result | Status |
| :-: | :-- | :-- | :-: |
| TC-01 | Full purchase flow: login, sort by price, add item to cart, checkout, complete order | Order completes with the selected item carried through (subtotal equals the price shown at selection, total equals subtotal + tax), confirmation shown and cart badge cleared | Passing |
| TC-02 | Sort order persists after a cart round-trip | Stays sorted low→high after leaving and returning to Products | Skipped (`.skip`) — BUG-001 |
| TC-03 | Reset App State reverts item buttons | Cart badge clears and item buttons revert to "Add to cart" | Skipped (`.skip`) — BUG-002 |
| TC-04 | Submit checkout with a required field missing | Error message blocks progress to Overview | Passing |
| TC-05 | Submit checkout with non-alphanumeric postal code / symbol-only name | Should be rejected with a format error | Skipped (`.skip`) — BUG-003 |
| TC-06 | Log in as locked-out user | Exact lockout message shown, route stays off `/inventory.html` | Passing |

## 3. Exploratory Testing Strategy

Due to limited time, an ad hoc exploratory approach was used instead of a structured session-based approach with test missions (James Bach and Elizabeth Hendrickson's Session-Based Test Management). Testing was run on the `standard_user` path before automating the corresponding regression guards, applying general testing heuristics against cart state, sort behavior, and checkout validation.

Findings from this pass: BUG-001 (sort not persisted), BUG-002 (Reset App State button desync), BUG-003 (checkout accepts invalid formats).

## 4. Non-Functional Tests (ISO/IEC 25010)

| Characteristic | Test | Status |
| :-- | :-- | :-: |
| Functional Suitability | Purchase flow, checkout validation, login | Covered (E2E) |
| Performance Efficiency | — | Not covered |
| Usability | — | Not covered |
| Security | — | Not covered |
| Reliability | — | Not covered |
| Compatibility | — | Not covered |
| Maintainability | — | Not covered |
| Portability | — | Not covered |

Only Functional Suitability is in scope for this take-home; the rest are flagged as explicit gaps, not oversights.

## 5. Test Data Mapping

| Data | Type | Owner | Status |
| :-- | :-: | :-: | :-: |
| Valid credentials | Fixture | Rafael Albuquerque | Ready |
| Invalid/locked-out credentials | Fixture | Rafael Albuquerque | Ready |
| Checkout form data (name, postal code) | Fixture | Rafael Albuquerque | Ready |

## 6. Known Defects

| ID | Defect | Layer |
| :-: | :-- | :-: |
| BUG-001 | Sort order not persisted after cart round-trip | E2E |
| BUG-002 | Reset App State leaves stale "Remove" button label | E2E |
| BUG-003 | Checkout accepts invalid name/postal-code formats | E2E |
