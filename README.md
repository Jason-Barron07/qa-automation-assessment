# QA automation assessment

Playwright, TypeScript ES modules, and BDD for Catfact Ninja API testing and Swag Labs browser testing.

## Status

Framework configuration and folder structure are ready. Assessment scenarios, services, and page objects have not been implemented yet. An empty suite is not a passing assessment.

## Setup (PowerShell)

Install a Node.js version supported by the installed Playwright release, plus Git.

```powershell
git clone https://github.com/Jason-Barron07/qa-automation-assessment.git
Set-Location qa-automation-assessment
npm ci
npx playwright install chromium
Copy-Item .env.example .env
```

Fill in the public Swag Labs demo credentials in `.env` before implementing login coverage. `.env` is ignored by Git. Public target URLs have defaults and can be overridden through environment variables. Existing process environment variables take precedence over `.env`.

## Commands

```powershell
npm run typecheck
npm run bddgen
npm run test:list
npm run test:api
npm run test:ui
npm run test:ui -- --headed
npm test
npm run report
```

Each test command regenerates BDD specs first. Until scenarios are added, ordinary test commands report no tests; use `npm run test:list -- --pass-with-no-tests` only to check empty-framework discovery. Do not use that option as an assessment completion check.

## Structure

- `src/services/`: API clients, with HTTP implementation outside step definitions.
- `src/pages/`: browser Page Object Models.
- `src/components/`: UI components shared across pages.
- `src/helpers/`: helpers with demonstrated reuse.
- `tests/api/cat-facts/`: Catfact feature families.
- `tests/ui/login/`, `sorting/`, `cart/`, `checkout/`: Swag Labs feature families.
- `tests/api/api.fixture.ts` and `tests/ui/ui.fixture.ts`: separate BDD test entry points.
- `docs/`: test plan, traceability, assumptions, execution evidence, and final written answers.
- `.features-gen/api/` and `.features-gen/ui/`: generated specs; never edit or commit.

## Adding coverage

Keep each feature's `.feature`, `.steps.ts`, `.fixture.ts`, `.types.ts`, and `.data.json` together; API features also use `.schema.ts` for Zod response contracts. Use `createBdd(test)` with the matching suite fixture import. Extend the suite's test instance as services/page objects are introduced and retain that instance in its steps. Avoid mixing API and UI step discovery.

Use `.js` extensions in relative TypeScript imports, explicit parameter/return types, Allman braces, single quotes, and semicolons. Keep scenarios independent; use fresh browser contexts and condition-based waits. Tests may import `src`; `src` must not import tests.

## Reports

HTML: `playwright-report/`; JUnit: `junit-report/results.xml`; failure artifacts: `test-results/`. Traces are retained on failures and screenshots captured for browser failures. One worker limits traffic to public targets; CI permits one retry and forbids focused tests. Report retries/flaky outcomes honestly.

The assessment framework adopts relevant Treasury conventions without its Azure Key Vault, transaction preparation, or internal reporting integrations. ESLint rules and actual assessment coverage are future steps; this setup supplies a TypeScript check, not a lint command.
