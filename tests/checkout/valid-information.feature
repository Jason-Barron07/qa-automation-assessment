Feature: Fill in required checkout information

  Scenario: Continue checkout with valid information
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout with valid information
    Then the checkout overview is displayed
