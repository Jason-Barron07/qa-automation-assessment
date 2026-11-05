import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import type { IProduct } from '../../src/pages/shop.types.js';
import { byName, prepareCart } from '../shared/scenario-support.js';

const { Given, Then } = createBdd(test);

// #region Given

Given('my cart contains all available products', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareCart({ login, products, cart, checkout, menu, credentials, basket });
});

// #endregion

// #region Then

Then('the cart contains all products and the correct calculated total', async ({ cart, basket }: IUiFixtures): Promise<void> =>
{
    await expect(cart.items).toHaveCount(basket.products.length);
    await expect(cart.quantities).toHaveText(basket.products.map((): string => '1'));
    const actual = await cart.readProducts();
    expect(actual.slice().sort(byName)).toEqual(basket.products.slice().sort(byName));
    const cartTotal = actual.reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    expect(cartTotal, 'Cart line-item sum must match the inventory sum before checkout').toBe(basket.total);
    await test.info().attach('cart-total', {
        body: JSON.stringify({ products: actual, calculatedTotalCents: cartTotal }, null, 2),
        contentType: 'application/json'
    });
});

// #endregion
