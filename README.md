# QA Automation Assessment

Task 4 automates Swag Labs at https://www.saucedemo.com using Playwright BDD, TypeScript, and Page Object Models. Task 3 is tested separately in Postman; its collection and screenshots are retained for submission.

## Prerequisites

- Node.js 24 or newer, with npm. The suite has been verified with Node.js 26.4.0 and npm 11.17.0.
- Git and internet access to Swag Labs.
- Chromium installed through Playwright, as shown below.

Run `node --version` and `npm --version` to check your installation.

## Setup

Run these commands in PowerShell:

```powershell
git clone https://github.com/Jason-Barron07/qa-automation-assessment.git
Set-Location qa-automation-assessment
npm ci
npx playwright install chromium
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `.env` and set `SWAG_USERNAME` to the standard demo account listed on the Swag Labs login page. Set `SWAG_PASSWORD` to the demo password displayed there. Do not use the locked or problem accounts for the successful journey. The negative scenarios supply their own deliberately invalid inputs.

`.env` is ignored by Git. Keep credentials there rather than in feature files or committed configuration. The existing local environment is preserved by the setup command.

Public defaults, including `UI_BASE_URL`, timeouts, and worker count, are in `.env.qa`. Configuration is loaded in this order: existing process variables, `.env`, then `.env.<TARGET_ENVIRONMENT>` (default: `qa`). Local runs use one worker with no retries; CI allows the configured retry count.

## Execute the tests

Run the checks and complete UI suite from the repository root:

```powershell
npm run typecheck
npm run lint
npm run test:ui
```

`npm test` also runs the complete UI suite. Both commands generate Playwright specs from the feature files before execution. A successful full run reports **22 passed**; failed assertions cause a nonzero exit code.

| Purpose | Command |
| --- | --- |
| List all scenarios without running them | `npm run test:list` |
| Run with the browser visible | `npm run test:ui -- --headed` |
| Run sorting scenarios | `npm run test:ui -- --grep "Sort all products"` |
| Run rejection scenarios | `npm run test:ui -- --grep "Reject"` |
| Run requirement 11 | `npm run test:ui -- --grep "11\. Purchase completion"` |
| Run purchase confirmation | `npm run test:ui -- --grep "Complete a purchase"` |
| Open the latest HTML report | `npm run report` |
| Regenerate BDD specs only | `npm run bddgen` |

## Coverage

The 22 independent scenarios cover valid login, five invalid-login cases, all four sort options, adding all products, cart count and total, valid checkout information, three missing-field cases, checkout item total and tax, purchase confirmation, return to Products, empty cart, and logout.

Every scenario has one Given, one When, and one Then. There are no tags or Examples tables. Each scenario starts in a fresh browser context and establishes its own prerequisites through page objects.

The cart does not display a subtotal. Its line-item sum is checked before checkout and compared with the item total on the checkout overview. Money calculations use integer cents, and the tests do not assume a tax rate or fixed inventory total.

See [requirement coverage](docs/task-4-test-plan.md), [BDD conventions](docs/task-4-bdd-alignment.md), and [recorded execution results](docs/task-4-execution-summary.md).

## Project structure

```text
src/
  components/       Shared cart and burger-menu controls
  config/           Environment loading and configuration types
  fixtures/         ui.fixture.ts and ui.types.ts
  helpers/          Money conversion
  pages/            Login, products, cart, and checkout page objects
tests/
  login/            Valid and invalid login features (1-2)
  sorting/          Sort and validate all products (3-4)
  cart/             Cart count and pre-checkout total (5-6)
  checkout/         Information, negative cases, item total, tax (7-10)
  E2E/              Purchase completion and post-purchase checks (11)
  shared/           Given/When/Then steps, JSON data, and feature types
docs/              Coverage, execution evidence, and Postman collection
.vscode/           TypeScript and Cucumber editor configuration
```

Shared fixtures create the page objects, load credentials, and isolate basket state. Each feature has a matching `.steps.ts` beside it. Reused steps are registered once in `tests/shared/common.steps.ts`, and setup helpers live in `tests/shared/scenario-support.ts`. Each step file keeps Given, When, Then order where applicable. Assertions live in the steps files; browser actions live in page objects. Test inputs and expected messages live in JSON. TypeScript checks unused variables and parameters, and ESLint enforces the project conventions.

Do not edit `.features-gen/` directly; it is regenerated and ignored by Git.

## Reports and evidence

- HTML report: `playwright-report/`, opened using `npm run report`.
- Failure screenshots and traces: `test-results/`.
- The cart-review scenario attaches its products and calculated total as `cart-total` evidence.

Reports are generated locally, ignored by Git, and replaced by later runs. Open a failure trace from the HTML report or use `npx playwright show-trace "path/to/trace.zip"`.

Task 3 material remains in `docs/reference/cat-facts.postman_collection.json` and `Postman collection - Cat API/`. No Cat Facts automation runs in this repository.

## Troubleshooting

- **Missing credentials:** set both Swag Labs variables in `.env`.
- **Browser executable missing:** run `npx playwright install chromium`.
- **Undefined Gherkin steps in VS Code:** open this repository as the workspace so `.vscode/settings.json` is loaded, then use **Developer: Reload Window** if needed.
- **Editor errors while the compiler passes:** check for unsaved old tabs. Shared fixtures now live in `src/fixtures/`; close obsolete `tests/ui/ui.fixture.ts` and `ui.types.ts` tabs without saving them back into the old location. Use the workspace TypeScript version.
- **Network or application failures:** inspect the HTML report and failure trace. Do not skip assertions to turn a failed run green.
