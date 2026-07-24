import { test, loginAsStandardUser } from './fixtures';

test.describe('US-4: Checkout validation', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginAsStandardUser(loginPage);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();
  });

  test('TC-US4-01: missing First Name blocks checkout with an error', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();
    await checkoutStepOnePage.expectError('First Name is required');
  });

  test('TC-US4-02: missing Last Name blocks checkout with an error', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('John', '', '12345');
    await checkoutStepOnePage.continueToOverview();
    await checkoutStepOnePage.expectError('Last Name is required');
  });

  test('TC-US4-03: missing Zip/Postal Code blocks checkout with an error', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('John', 'Doe', '');
    await checkoutStepOnePage.continueToOverview();
    await checkoutStepOnePage.expectError('Postal Code is required');
  });

  test('TC-US4-04: all required fields present proceeds to the overview step', async ({
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();
    await checkoutStepTwoPage.expectLoaded();
  });

  test('TC-US4-05: whitespace-only First Name should block checkout with an error (known app gap)', async ({
    checkoutStepOnePage,
  }) => {
    // SauceDemo only checks for a literal empty string, not whitespace-only input — verified
    // against the live app for all three fields. This test documents that gap against the
    // requirement's intent rather than silently asserting the app's (non-conforming) behavior.
    test.fail(true, 'Known app gap: SauceDemo does not treat whitespace-only input as missing');

    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('   ', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();
    await checkoutStepOnePage.expectError('First Name is required');
  });
});

test.describe('US-5: Order completion', () => {
  test('TC-US5-01: completing checkout shows the order-confirmation message', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await loginAsStandardUser(loginPage);
    await inventoryPage.expectLoaded();
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutStepOnePage.expectLoaded();
    await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();

    await checkoutStepTwoPage.expectLoaded();
    await checkoutStepTwoPage.finish();

    await checkoutCompletePage.expectOrderConfirmed();
  });
});
