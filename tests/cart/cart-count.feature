Feature: Add all products and validate cart count

  Scenario: Add the complete inventory to the cart
    Given I am logged in as a valid user
    When I attempt to add all products to the cart
    Then the cart badge counts all products
