Feature: Login using a valid user

  Scenario: Sign in with a valid account
    Given the login page is open
    When I attempt to sign in with valid credentials
    Then the Products page is displayed
