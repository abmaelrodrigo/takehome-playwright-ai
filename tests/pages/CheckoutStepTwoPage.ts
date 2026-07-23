import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly summaryTotalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryTotalLabel = page.locator('[data-test="total-label"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/checkout-step-two\.html/);
    await expect(this.summaryTotalLabel).toBeVisible();
  }

  async finish() {
    await this.finishButton.click();
  }
}
