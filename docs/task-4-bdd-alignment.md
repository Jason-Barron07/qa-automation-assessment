# Task 4 BDD alignment

## Source reviewed

The extracted Treasury folder was unavailable. The original `pw-treasury-eezi-reversal-isolation-fix.zip` in Downloads was read directly, including:

- `pw-treasury/README.md`
- `pw-treasury/docs/creating-a-test/1_bdd-gherkin-writing-clear-meaningful-scenarios.md`

The README points to the BDD guide. Its core model is state, action, outcome: Given establishes preconditions, When triggers one business behaviour, and Then verifies an observable outcome without changing application state. The guide explicitly recommends splitting scenarios with multiple actions. The additional requirement of exactly one Given, When, and Then comes from the user's instruction.

## Applied structure

Every scenario contains exactly three steps, in this order. No And, But, or Background adds hidden steps. Each input case has its own plain Scenario block. There are no tags, Scenario Outlines, or Examples tables; the input and expected values remain in JSON.

```gherkin
Scenario: Complete a purchase
  Given my order is ready for confirmation
  When I confirm my purchase
  Then the purchase is confirmed and the cart badge is cleared
```

The former long purchase-and-logout scenario is split into independent behaviour scenarios. Valid login, adding products, cart review, checkout information, purchase confirmation, returning to Products, empty-cart review, and logout each have one action and a focused outcome. There are now 20 individually named scenarios instead of 13, covering the same Task 4 requirements.

Given steps describe existing state, such as an order ready for confirmation. Their private setup helpers use the page objects to establish that state within a fresh browser context. They never depend on another scenario passing. Setup is allowed to interact with the UI; those interactions establish prerequisites rather than becoming extra business actions in the scenario text.

When steps express business intent. Burger-menu clicks and other UI mechanics stay inside page objects. Then steps only read the UI and assert outcomes; cart evidence attachments do not modify the application. Assertions remain in the steps file and use array comparisons rather than assertion loops.

The complete Task 4 path is still exercised through the setup of post-purchase scenarios. It is no longer represented as a single scenario with several action/outcome cycles. This makes each outcome independently reportable and keeps the feature aligned with the Treasury guide.

## Plain scenario examples reviewed

The Treasury archive examples `tests/one-voucher/buy-one-voucher.feature`, `tests/airtime/get-airtime-voucher.feature`, and `tests/airtime/complete-airtime-purchase.feature` use individually named Scenario blocks with one Given, When, and Then. The Swag Labs feature now follows this format. Filtering instructions use scenario names instead of tags.
