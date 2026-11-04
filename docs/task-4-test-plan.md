# Task 4: Swag Labs UI coverage

Target: https://www.saucedemo.com. Implementation: Playwright BDD with TypeScript, Chromium, Page Object Models, a shared menu component, JSON inputs, and separate types.

## Requirements mapped to tests

| Requirement | Coverage |
| --- | --- |
| 1. Valid login | A dedicated valid-login scenario asserts the Products heading and sort control; other scenarios independently establish their login precondition. |
| 2. Invalid users | Unknown user, wrong password, locked account, missing username, and missing password. Each checks the error and confirms the login page remains visible. |
| 3–4. All four sorting options and all products | Four examples compare the entire ordered name or price array and confirm every product and its price remain present. Available options are also checked. |
| 5. Add all products and validate count | Focused scenarios reads the inventory, adds every product, and compares the badge with the inventory count. |
| 6. Cart total before checkout | Confirms all cart names, prices, and quantities; sums the cart line items and compares the result with the inventory total before starting checkout. |
| 7. Valid checkout information | Focused scenarios submits the first name, last name, and postal code from JSON. |
| 8. Negative checkout information | Three independent cases omit one required field at a time and confirm its exact error. Checkout remains on the information form. |
| 9. Item total | Checkout item total equals the previously calculated cart amount. Overview items also match the original inventory. |
| 10. Tax | Tax label is visible and contains a valid nonnegative monetary amount. Grand total equals item total plus displayed tax. |
| 11. Completion | Verifies Checkout: Complete!, the success title, and the full dispatch message. |
| 11. Empty badge and All Items | Confirms the badge is absent, opens the burger menu, selects All Items, and verifies Products. |
| 11. Empty cart and logout | Separate scenarios view the empty cart and log out through the burger menu. Each establishes its completed-purchase precondition independently. |

## Scenario count

13 scenarios: five login negatives, four sorts, three checkout negatives, and one focused scenarios. This count belongs to Task 4; Task 3 remains the three Postman examples.

## Structure

- `src/pages/`: login, products, cart, and checkout objects; browser controls and actions only.
- `src/components/shop-menu.ts`: shared cart badge and burger menu controls.
- `src/helpers/money.ts`: validated conversion of displayed dollar amounts to integer cents.
- `src/fixtures/ui.fixture.ts` and `ui.types.ts`: isolated page objects, credentials, and per-test basket state.
- `tests/ui/swag-labs/`: readable feature, step assertions, JSON inputs/expected messages, and feature types.

Assertions stay in the steps file; no separate assertions or settings file is used. Array matchers check complete lists without assertion loops. Adding all products uses sequential button actions in the page object, so UI updates complete before the next click.

## Assumptions and limits

- The cart page has no displayed subtotal. Requirement 6 is implemented by checking the line-item sum before Checkout and comparing it with the displayed Item total on the overview page.
- Monetary arithmetic uses cents, avoiding floating-point price addition. No tax percentage is assumed.
- The public standard demo account is used. Credentials are read from ignored local environment settings, not committed scenario data. Deliberately invalid values and the public locked-account name are test inputs.
- Negative checkout tests cover required fields. Postal-code format rules are not specified, so acceptance of unusual postal codes is not labelled a defect.
- Sort tests preserve the complete product set, including tied prices. They do not assume a fixed product count or inventory total.
- Live verification is on desktop Chromium. No cross-browser, mobile, load, or accessibility certification is claimed.
- Exact UI messages were confirmed by the live run. Future application changes may require reviewed updates to expected data.

## Execution

Follow the README setup, then run `npm run typecheck`, `npm run lint`, and `npm run test:ui`. Run `npm run report` to review results and the cart-total attachment. Failure traces and screenshots are enabled. Generated reports are not committed.

See [BDD alignment](task-4-bdd-alignment.md). Setup helpers establish prerequisites through page objects; Then steps never navigate, submit forms, or change application state.
