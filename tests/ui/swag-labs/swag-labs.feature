Feature: Swag Labs shopping journey

  Scenario: Reject login with an unknown user
    Given the login page is open
    When I submit the login case "unknown-user"
    Then login is rejected for "unknown-user"

  Scenario: Reject login with an incorrect password
    Given the login page is open
    When I submit the login case "wrong-password"
    Then login is rejected for "wrong-password"

  Scenario: Reject login with a locked account
    Given the login page is open
    When I submit the login case "locked-user"
    Then login is rejected for "locked-user"

  Scenario: Reject login without a username
    Given the login page is open
    When I submit the login case "missing-username"
    Then login is rejected for "missing-username"

  Scenario: Reject login without a password
    Given the login page is open
    When I submit the login case "missing-password"
    Then login is rejected for "missing-password"

  Scenario: Sort all products by name from A to Z
    Given I am logged in as a valid user
    When I sort products by "az"
    Then all products are correctly sorted by "az"

  Scenario: Sort all products by name from Z to A
    Given I am logged in as a valid user
    When I sort products by "za"
    Then all products are correctly sorted by "za"

  Scenario: Sort all products by price from low to high
    Given I am logged in as a valid user
    When I sort products by "lohi"
    Then all products are correctly sorted by "lohi"

  Scenario: Sort all products by price from high to low
    Given I am logged in as a valid user
    When I sort products by "hilo"
    Then all products are correctly sorted by "hilo"

  Scenario: Reject checkout without a first name
    Given checkout information is required for a cart containing all products
    When I submit checkout case "missing-first-name"
    Then checkout is rejected for "missing-first-name"

  Scenario: Reject checkout without a last name
    Given checkout information is required for a cart containing all products
    When I submit checkout case "missing-last-name"
    Then checkout is rejected for "missing-last-name"

  Scenario: Reject checkout without a postal code
    Given checkout information is required for a cart containing all products
    When I submit checkout case "missing-postal-code"
    Then checkout is rejected for "missing-postal-code"

  Scenario: Sign in with a valid account
    Given the login page is open
    When I sign in with valid credentials
    Then the Products page is displayed

  Scenario: Add the complete inventory to the cart
    Given I am logged in as a valid user
    When I add all products to the cart
    Then the cart badge counts all products

  Scenario: Review the cart before checkout
    Given my cart contains all available products
    When I view my cart
    Then the cart contains all products and the correct calculated total

  Scenario: Review the checkout charges
    Given checkout information is required for a cart containing all products
    When I submit valid checkout information
    Then the item total matches the calculated cart total and tax is displayed

  Scenario: Complete a purchase
    Given my order is ready for confirmation
    When I confirm my purchase
    Then the purchase is confirmed and the cart badge is cleared

  Scenario: Return to the catalogue after a purchase
    Given I have completed a purchase
    When I return to the product catalogue
    Then the Products page is displayed

  Scenario: Review the empty cart after returning to the catalogue
    Given I have returned to the product catalogue after a purchase
    When I view my cart
    Then the cart is empty

  Scenario: Sign out after reviewing the completed purchase
    Given I am viewing my empty cart after a purchase
    When I sign out
    Then the Login page is displayed
