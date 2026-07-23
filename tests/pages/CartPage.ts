import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/cart\.html/);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
