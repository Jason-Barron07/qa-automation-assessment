Feature: Validate the displayed item total

  Scenario: Validate the checkout item total
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout with valid information
    Then the item total matches the calculated cart total
