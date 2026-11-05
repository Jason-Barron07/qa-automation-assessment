Feature: Validate that tax is displayed

  Scenario: Review the tax and final checkout total
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout with valid information
    Then tax is displayed and included in the final total
