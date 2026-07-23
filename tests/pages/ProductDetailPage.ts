import { expect, type Locator, type Page } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/inventory-item\.html/);
  }

  async goBackToProducts() {
    await this.backButton.click();
  }
}
