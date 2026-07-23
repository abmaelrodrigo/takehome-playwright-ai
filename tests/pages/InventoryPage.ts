import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  addToCartByName(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toBeVisible();
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeAbsent() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
