import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { moneyToCents } from '../../src/helpers/money.js';

const { Then } = createBdd(test);

// #region Then

Then('tax is displayed and included in the final total', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.itemTotal).toBeVisible();
    const itemTotal = moneyToCents(await checkout.itemTotal.innerText());
    await expect(checkout.tax).toBeVisible();
    await expect(checkout.tax).toHaveText(/^Tax: \$\d+\.\d{2}$/);
    const tax = moneyToCents(await checkout.tax.innerText());
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(moneyToCents(await checkout.total.innerText())).toBe(itemTotal + tax);
});

// #endregion
