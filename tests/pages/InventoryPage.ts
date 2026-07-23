import { expect, type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  addToCartByName(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  removeFromCartByName(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="remove-${slug}"]`).click();
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

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async expectSortValue(option: SortOption) {
    await expect(this.sortDropdown).toHaveValue(option);
  }

  getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async expectPricesAscending() {
    const prices = await this.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }

  async expectPricesDescending() {
    const prices = await this.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  }

  openProductByIndex(index: number) {
    return this.productNames.nth(index).click();
  }
}
