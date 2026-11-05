Feature: Purchase completion, return to Products, and logout

  Scenario: Complete a purchase
    Given my order is ready for confirmation
    When I attempt to confirm my purchase
    Then the purchase is confirmed and the cart badge is cleared

  Scenario: Return to the catalogue after a purchase
    Given I have completed a purchase
    When I attempt to return to the product catalogue
    Then the Products page is displayed

  Scenario: Review the empty cart after returning to the catalogue
    Given I have returned to the product catalogue after a purchase
    When I attempt to view my cart
    Then the cart is empty

  Scenario: Sign out after reviewing the completed purchase
    Given I am viewing my empty cart after a purchase
    When I attempt to sign out
    Then the Login page is displayed
