Feature:Validate cart total before checkout

  Scenario: Review the cart before checkout
    Given my cart contains all available products
    When I attempt to view my cart
    Then the cart contains all products and the correct calculated total
