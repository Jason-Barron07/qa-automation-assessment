import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import type { IProduct } from '../../src/pages/shop.types.js';

const { When, Then } = createBdd(test);

// #region When

When('I attempt to add all products to the cart', async ({ products, basket }: IUiFixtures): Promise<void> =>
{
    basket.products = await products.readProducts();
    expect(basket.products.length).toBeGreaterThan(0);
    basket.total = basket.products.reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await products.addAll();
});

// #endregion

// #region Then

Then('the cart badge counts all products', async ({ menu, basket }: IUiFixtures): Promise<void> =>
{
    await expect(menu.badge).toHaveText(String(basket.products.length));
});

// #endregion
