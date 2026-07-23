import { test, expect, loginAsStandardUser, LOCKED_OUT_USER, PASSWORD } from './fixtures';

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
});

test.describe('US-2: Locked-out user', () => {
  test('TC-US2-01: locked-out user sees the lockout-specific error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USER, PASSWORD);
    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });
});
