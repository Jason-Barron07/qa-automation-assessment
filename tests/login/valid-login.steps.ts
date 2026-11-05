import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';

const { When } = createBdd(test);

// #region When

When('I attempt to sign in with valid credentials', async ({ login, credentials }: IUiFixtures): Promise<void> =>
{
    await login.login(credentials.username, credentials.password);
});

// #endregion
