import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { data } from '../shared/scenario-support.js';

const { Then } = createBdd(test);

// #region Then

Then('the checkout overview is displayed', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.title).toHaveText(data.overviewTitle);
    await expect(checkout.itemTotal).toBeVisible();
    await expect(checkout.firstName).toHaveCount(0);
});

// #endregion
