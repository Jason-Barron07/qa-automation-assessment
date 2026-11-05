Feature:Reject missing checkout information

  Scenario: Reject checkout without a first name
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout without a first name
    Then checkout is rejected with the expected message

  Scenario: Reject checkout without a last name
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout without a last name
    Then checkout is rejected with the expected message

  Scenario: Reject checkout without a postal code
    Given checkout information is required for a cart containing all products
    When I attempt to continue checkout without a postal code
    Then checkout is rejected with the expected message
