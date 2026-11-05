Feature: Sort and validate all products

  Scenario: Sort all products by name from A to Z
    Given I am logged in as a valid user
    When I attempt to sort all products by name from A to Z
    Then all products follow the requested sort order

  Scenario: Sort all products by name from Z to A
    Given I am logged in as a valid user
    When I attempt to sort all products by name from Z to A
    Then all products follow the requested sort order

  Scenario: Sort all products by price from low to high
    Given I am logged in as a valid user
    When I attempt to sort all products by price from low to high
    Then all products follow the requested sort order

  Scenario: Sort all products by price from high to low
    Given I am logged in as a valid user
    When I attempt to sort all products by price from high to low
    Then all products follow the requested sort order
