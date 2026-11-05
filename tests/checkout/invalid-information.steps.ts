import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { data, requiredCase } from '../shared/scenario-support.js';

const { When, Then } = createBdd(test);

// #region When

When(/^I attempt to continue checkout (?:without a first name|without a last name|without a postal code)$/, async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await checkout.continueWith(requiredCase(data.checkoutCases, test.info().title));
});

// #endregion

// #region Then

Then('checkout is rejected with the expected message', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.error).toHaveText(requiredCase(data.checkoutCases, test.info().title).error);
    await expect(checkout.firstName).toBeVisible();
    await expect(checkout.itemTotal).toHaveCount(0);
});

// #endregion
