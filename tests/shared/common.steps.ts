import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import { data, prepareCheckout } from './scenario-support.js';

const { Given, When, Then } = createBdd(test);

// #region Given

Given('the login page is open', async ({ login }: IUiFixtures): Promise<void> =>
{
    await login.open();
});

Given('I am logged in as a valid user', async ({ login, products, credentials }: IUiFixtures): Promise<void> =>
{
    await login.open();
    await login.login(credentials.username, credentials.password);
    await expect(products.title).toHaveText(data.productsTitle);
    await expect(products.sort).toBeVisible();
});

Given('checkout information is required for a cart containing all products', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareCheckout({ login, products, cart, checkout, menu, credentials, basket });
});

// #endregion

// #region When

When('I attempt to view my cart', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.openCart();
});

When('I attempt to continue checkout with valid information', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await checkout.continueWith(data.checkout);
});

// #endregion

// #region Then

Then('the Products page is displayed', async ({ products }: IUiFixtures): Promise<void> =>
{
    await expect(products.title).toHaveText(data.productsTitle);
    await expect(products.sort).toBeVisible();
});

// #endregion
