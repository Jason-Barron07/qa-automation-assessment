# Task 4 execution summary

- Date: 2026-11-04 22:01:11 SAST, after moving shared fixtures into src/fixtures and removing unused scaffolding.
- Target: live https://www.saucedemo.com.
- Command: `npm run test:ui`; desktop Chromium, headless.
- One worker, zero retries: **20 passed, 0 failed, 0 skipped**.
- Suite duration recorded in JUnit: 36.199982 seconds.
- TypeScript checking, lint, BDD generation, and discovery passed.
- Structural check: 20 plain scenarios, each with exactly one Given, one When, and one Then; no tags or Examples tables.

| Scenario | Result |
| --- | --- |
| Reject login with an unknown user | PASS |
| Reject login with an incorrect password | PASS |
| Reject login with a locked account | PASS |
| Reject login without a username | PASS |
| Reject login without a password | PASS |
| Sort all products by name from A to Z | PASS |
| Sort all products by name from Z to A | PASS |
| Sort all products by price from low to high | PASS |
| Sort all products by price from high to low | PASS |
| Reject checkout without a first name | PASS |
| Reject checkout without a last name | PASS |
| Reject checkout without a postal code | PASS |
| Sign in with a valid account | PASS |
| Add the complete inventory to the cart | PASS |
| Review the cart before checkout | PASS |
| Review the checkout charges | PASS |
| Complete a purchase | PASS |
| Return to the catalogue after a purchase | PASS |
| Review the empty cart after returning to the catalogue | PASS |
| Sign out after reviewing the completed purchase | PASS |

The increase from 13 to 20 comes from separating the former multi-action journey into independent behaviours, not adding assessment scope. Then steps are read-only. See [BDD alignment](task-4-bdd-alignment.md) and [coverage](task-4-test-plan.md).

Open the HTML report with `npm run report`. JUnit results are in `junit-report/results.xml`. The cart-review scenario attaches its products and calculated total. Generated reports are ignored by Git and replaced by later runs. Changes remain local and uncommitted.

Cleanup validation: TypeScript unused-local and unused-parameter checks pass, lint passes, and VS Code was verified to show No Problems after closing the obsolete fixture tab.
