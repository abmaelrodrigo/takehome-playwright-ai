import { test, expect, loginAsStandardUser, STANDARD_USER, LOCKED_OUT_USER, PASSWORD } from './fixtures';

test.describe('US-1: Login', () => {
  test('TC-US1-01: valid credentials reach the products page', async ({ loginPage, inventoryPage }) => {
    await loginAsStandardUser(loginPage);
    await inventoryPage.expectLoaded();
  });

  test('TC-US1-02: wrong password shows a generic error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.expectError('Username and password do not match any user in this service');
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC-US1-03: empty username and password shows a required-fields error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.expectError('Username is required');
  });

  test('TC-US1-04: username with different casing is rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('Standard_User', PASSWORD);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('TC-US1-05: password with different casing is rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, 'Secret_Sauce');
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('TC-US1-06: blank username with a valid password shows a username-required error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', PASSWORD);
    await loginPage.expectError('Username is required');
  });

  test('TC-US1-07: blank password with a valid username shows a password-required error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, '');
    await loginPage.expectError('Password is required');
  });

  test('TC-US1-08: whitespace-only username is rejected as a non-matching credential', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('   ', PASSWORD);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('TC-US1-09: whitespace-only password is rejected as a non-matching credential', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, '   ');
    await loginPage.expectError('Username and password do not match any user in this service');
  });
});

test.describe('US-2: Locked-out user', () => {
  test('TC-US2-01: locked-out user sees the lockout-specific error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USER, PASSWORD);
    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC-US2-02: locked-out user with an incorrect password sees the generic error, not the lockout message', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USER, 'wrong_password');
    await loginPage.expectError('Username and password do not match any user in this service');
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });
});
