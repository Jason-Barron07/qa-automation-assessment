import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { data, prepareOverview, prepareCompletedPurchase, prepareReturnedCatalogue, preparePostPurchaseCart } from '../shared/scenario-support.js';

const { Given, When, Then } = createBdd(test);

// #region Given

Given('my order is ready for confirmation', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareOverview({ login, products, cart, checkout, menu, credentials, basket });
});

Given('I have completed a purchase', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareCompletedPurchase({ login, products, cart, checkout, menu, credentials, basket });
});

Given('I have returned to the product catalogue after a purchase', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareReturnedCatalogue({ login, products, cart, checkout, menu, credentials, basket });
});

Given('I am viewing my empty cart after a purchase', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await preparePostPurchaseCart({ login, products, cart, checkout, menu, credentials, basket });
});

// #endregion

// #region When

When('I attempt to confirm my purchase', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await checkout.finish();
});

When('I attempt to return to the product catalogue', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.allItems();
});

When('I attempt to sign out', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.logout();
});

// #endregion

// #region Then

Then('the purchase is confirmed and the cart badge is cleared', async ({ checkout, menu }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.title).toHaveText(data.completePageTitle);
    await expect(checkout.completeTitle).toHaveText(data.successTitle);
    await expect(checkout.completeMessage).toHaveText(data.successMessage);
    await expect(menu.badge).toHaveCount(0);
});

Then('the cart is empty', async ({ cart, menu }: IUiFixtures): Promise<void> =>
{
    await expect(cart.items).toHaveCount(0);
    await expect(menu.badge).toHaveCount(0);
});

Then('the Login page is displayed', async ({ login, products }: IUiFixtures): Promise<void> =>
{
    await expect(login.username).toBeVisible();
    await expect(login.password).toBeVisible();
    await expect(login.submit).toBeVisible();
    await expect(products.title).toHaveCount(0);
});

// #endregion
