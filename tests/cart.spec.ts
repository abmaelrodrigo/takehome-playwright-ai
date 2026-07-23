import { test, loginAsStandardUser } from './fixtures';

test.describe('US-3: Cart badge', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginAsStandardUser(loginPage);
    await inventoryPage.expectLoaded();
  });

  test('TC-US3-01: cart badge is absent when the cart is empty', async ({ inventoryPage }) => {
    await inventoryPage.expectCartBadgeAbsent();
  });

  test('TC-US3-02: adding one product shows a badge count of 1', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeCount(1);
  });

  test('TC-US3-03: adding a second distinct product increments the badge to 2', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(2);
  });

  test('TC-US3-04: removing the only item in the cart clears the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeAbsent();
  });

  test('TC-US3-05: removing one of two items decrements the badge to 1', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeCount(1);
  });
});
