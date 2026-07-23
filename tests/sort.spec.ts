import { test, expect, loginAsStandardUser } from './fixtures';

test.describe('US-6: Sorting', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginAsStandardUser(loginPage);
  });

  test('TC-US6-01: sort products by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    await inventoryPage.expectSortValue('lohi');
    await inventoryPage.expectPricesAscending();
  });

  test('TC-US6-02: sort products by price, high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    await inventoryPage.expectSortValue('hilo');
    await inventoryPage.expectPricesDescending();
  });

  test('TC-US6-03: sorting does not add, drop, or duplicate products', async ({ inventoryPage }) => {
    const originalNames = (await inventoryPage.getProductNames()).slice().sort();

    await inventoryPage.sortBy('lohi');
    expect((await inventoryPage.getProductNames()).slice().sort()).toEqual(originalNames);

    await inventoryPage.sortBy('hilo');
    expect((await inventoryPage.getProductNames()).slice().sort()).toEqual(originalNames);
  });

  test('TC-US6-04: switching directly between the two price sort orders re-sorts correctly', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    await inventoryPage.expectPricesAscending();

    await inventoryPage.sortBy('hilo');
    await inventoryPage.expectPricesDescending();
  });

  test('TC-US6-05: products with equal prices retain a stable relative order after sorting', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    const firstPass = await inventoryPage.getProductNames();

    await inventoryPage.sortBy('az');
    await inventoryPage.sortBy('lohi');
    const secondPass = await inventoryPage.getProductNames();

    expect(secondPass).toEqual(firstPass);
  });

  test('TC-US6-06: sort order resets to default after navigating to a product detail page and back', async ({
    inventoryPage,
    productDetailPage,
  }) => {
    await inventoryPage.sortBy('hilo');
    await inventoryPage.expectPricesDescending();

    await inventoryPage.openProductByIndex(0);
    await productDetailPage.expectLoaded();
    await productDetailPage.goBackToProducts();
    await inventoryPage.expectLoaded();

    await inventoryPage.expectSortValue('az');
  });
});
