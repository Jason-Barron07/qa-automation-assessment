import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { data, requiredCase } from '../shared/scenario-support.js';

const { When, Then } = createBdd(test);

// #region When

When(/^I attempt to sign in (?:with an unknown user|with an incorrect password|with a locked account|without a username|without a password)$/, async ({ login, credentials }: IUiFixtures): Promise<void> =>
{
    const entry = requiredCase(data.loginCases, test.info().title);
    await login.login(
        entry.username === 'use-valid-user' ? credentials.username : entry.username,
        entry.password === 'use-valid-password' ? credentials.password : entry.password
    );
});

// #endregion

// #region Then

Then('login is rejected with the expected message', async ({ login, products }: IUiFixtures): Promise<void> =>
{
    await expect(login.error).toHaveText(requiredCase(data.loginCases, test.info().title).error);
    await expect(login.submit).toBeVisible();
    await expect(products.sort).toHaveCount(0);
});

// #endregion
