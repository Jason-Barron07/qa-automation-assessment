Feature: Login using invalid users

  Scenario: Reject login with an unknown user
    Given the login page is open
    When I attempt to sign in with an unknown user
    Then login is rejected with the expected message

  Scenario: Reject login with an incorrect password
    Given the login page is open
    When I attempt to sign in with an incorrect password
    Then login is rejected with the expected message

  Scenario: Reject login with a locked account
    Given the login page is open
    When I attempt to sign in with a locked account
    Then login is rejected with the expected message

  Scenario: Reject login without a username
    Given the login page is open
    When I attempt to sign in without a username
    Then login is rejected with the expected message

  Scenario: Reject login without a password
    Given the login page is open
    When I attempt to sign in without a password
    Then login is rejected with the expected message
