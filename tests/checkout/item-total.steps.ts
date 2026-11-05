import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { moneyToCents } from '../../src/helpers/money.js';
import { byName } from '../shared/scenario-support.js';

const { Then } = createBdd(test);

// #region Then

Then('the item total matches the calculated cart total', async ({ checkout, cart, basket }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.itemTotal).toBeVisible();
    await expect(cart.items).toHaveCount(basket.products.length);
    expect((await cart.readProducts()).slice().sort(byName)).toEqual(basket.products.slice().sort(byName));
    const itemTotal = moneyToCents(await checkout.itemTotal.innerText());
    expect(itemTotal).toBe(basket.total);
});

// #endregion
