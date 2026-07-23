import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutStepOnePage } from './pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from './pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from './pages/CheckoutCompletePage';
import { ProductDetailPage } from './pages/ProductDetailPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutStepOnePage: async ({ page }, use) => use(new CheckoutStepOnePage(page)),
  checkoutStepTwoPage: async ({ page }, use) => use(new CheckoutStepTwoPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
});

export { expect } from '@playwright/test';

export const STANDARD_USER = 'standard_user';
export const LOCKED_OUT_USER = 'locked_out_user';
export const PASSWORD = 'secret_sauce';

/** Logs in as the given user and leaves the page on /inventory.html. */
export async function loginAsStandardUser(loginPage: LoginPage) {
  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);
}
