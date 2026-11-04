import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../../src/fixtures/ui.types.js';
import type { IProduct } from '../../../src/pages/shop.types.js';
import { moneyToCents } from '../../../src/helpers/money.js';
import testData from './swag-labs.data.json' with { type: 'json' };
import type { ISwagData } from './swag-labs.types.js';

const data: ISwagData = testData;
const { Given, When, Then } = createBdd(test);

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

When('I submit the login case {string}', async ({ login, credentials }: IUiFixtures, name: string): Promise<void> =>
{
    const entry = requiredCase(data.loginCases, name);
    await login.login(
        entry.username === 'use-valid-user' ? credentials.username : entry.username,
        entry.password === 'use-valid-password' ? credentials.password : entry.password
    );
});

Then('login is rejected for {string}', async ({ login, products }: IUiFixtures, name: string): Promise<void> =>
{
    await expect(login.error).toHaveText(requiredCase(data.loginCases, name).error);
    await expect(login.submit).toBeVisible();
    await expect(products.sort).toHaveCount(0);
});

When('I sort products by {string}', async ({ products, basket }: IUiFixtures, option: string): Promise<void> =>
{
    basket.products = await products.readProducts();
    await products.sortBy(option);
});

Then('all products are correctly sorted by {string}', async ({ products, basket }: IUiFixtures, option: string): Promise<void> =>
{
    await expect(products.sort.locator('option')).toHaveText(Object.values(data.sorts).map((entry): string => entry.label));
    const sort = requiredCase(data.sorts, option);
    const direction = sort.descending ? -1 : 1;
    await expect(products.sort).toHaveValue(option);
    if (sort.field === 'name')
    {
        const expected = basket.products.map((product: IProduct): string => product.name)
            .sort((left: string, right: string): number => direction * left.localeCompare(right));
        await expect(products.names).toHaveText(expected);
    }
    else
    {
        const expected = basket.products.map((product: IProduct): number => product.price)
            .sort((left: number, right: number): number => direction * (left - right));
        await expect.poll(async (): Promise<number[]> => (await products.prices.allTextContents()).map(moneyToCents)).toEqual(expected);
    }
    const actual = await products.readProducts();
    expect(actual.slice().sort(byName), 'Sorting must retain every product and its price').toEqual(basket.products.slice().sort(byName));
});

When('I add all products to the cart', async ({ products, basket }: IUiFixtures): Promise<void> =>
{
    basket.products = await products.readProducts();
    expect(basket.products.length).toBeGreaterThan(0);
    basket.total = basket.products.reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await products.addAll();
});

Then('the cart badge counts all products', async ({ menu, basket }: IUiFixtures): Promise<void> =>
{
    await expect(menu.badge).toHaveText(String(basket.products.length));
});

When('I view my cart', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.openCart();
});

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

When('I submit valid checkout information', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await checkout.continueWith(data.checkout);
});

When('I submit checkout case {string}', async ({ checkout }: IUiFixtures, name: string): Promise<void> =>
{
    await checkout.continueWith(requiredCase(data.checkoutCases, name));
});

Then('checkout is rejected for {string}', async ({ checkout }: IUiFixtures, name: string): Promise<void> =>
{
    await expect(checkout.error).toHaveText(requiredCase(data.checkoutCases, name).error);
    await expect(checkout.firstName).toBeVisible();
    await expect(checkout.itemTotal).toHaveCount(0);
});

Then('the item total matches the calculated cart total and tax is displayed', async ({ checkout, cart, basket }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.itemTotal).toBeVisible();
    await expect(cart.items).toHaveCount(basket.products.length);
    expect((await cart.readProducts()).slice().sort(byName)).toEqual(basket.products.slice().sort(byName));
    const itemTotal = moneyToCents(await checkout.itemTotal.innerText());
    expect(itemTotal).toBe(basket.total);
    await expect(checkout.tax).toBeVisible();
    await expect(checkout.tax).toHaveText(/^Tax: \$\d+\.\d{2}$/);
    const tax = moneyToCents(await checkout.tax.innerText());
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(moneyToCents(await checkout.total.innerText())).toBe(itemTotal + tax);
});

When('I confirm my purchase', async ({ checkout }: IUiFixtures): Promise<void> =>
{
    await checkout.finish();
});

Then('the purchase is confirmed and the cart badge is cleared', async ({ checkout, menu }: IUiFixtures): Promise<void> =>
{
    await expect(checkout.title).toHaveText(data.completePageTitle);
    await expect(checkout.completeTitle).toHaveText(data.successTitle);
    await expect(checkout.completeMessage).toHaveText(data.successMessage);
    await expect(menu.badge).toHaveCount(0);
});

When('I return to the product catalogue', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.allItems();
});

Then('the Products page is displayed', async ({ products }: IUiFixtures): Promise<void> =>
{
    await expect(products.title).toHaveText(data.productsTitle);
    await expect(products.sort).toBeVisible();
});

Then('the cart is empty', async ({ cart, menu }: IUiFixtures): Promise<void> =>
{
    await expect(cart.items).toHaveCount(0);
    await expect(menu.badge).toHaveCount(0);
});

When('I sign out', async ({ menu }: IUiFixtures): Promise<void> =>
{
    await menu.logout();
});

Then('the Login page is displayed', async ({ login, products }: IUiFixtures): Promise<void> =>
{
    await expect(login.username).toBeVisible();
    await expect(login.password).toBeVisible();
    await expect(login.submit).toBeVisible();
    await expect(products.title).toHaveCount(0);
});

When('I sign in with valid credentials', async ({ login, credentials }: IUiFixtures): Promise<void> =>
{
    await login.login(credentials.username, credentials.password);
});

Given('my cart contains all available products', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareCart({ login, products, cart, checkout, menu, credentials, basket });
});

Given('checkout information is required for a cart containing all products', async ({ login, products, cart, checkout, menu, credentials, basket }: IUiFixtures): Promise<void> =>
{
    await prepareCheckout({ login, products, cart, checkout, menu, credentials, basket });
});

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

function requiredCase<T>(cases: Record<string, T>, name: string): T
{
    const entry = cases[name];
    if (!entry)
    {
        throw new Error(`Unknown test-data case: ${name}`);
    }
    return entry;
}

function byName(left: IProduct, right: IProduct): number
{
    return left.name.localeCompare(right.name);
}


// Establish independent preconditions through the UI; no scenario depends on another.
async function prepareCart(context: IUiFixtures): Promise<void>
{
    await context.login.open();
    await context.login.login(context.credentials.username, context.credentials.password);
    await context.products.sort.waitFor();
    context.basket.products = await context.products.readProducts();
    context.basket.total = context.basket.products.reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await context.products.addAll();
}

async function prepareCheckout(context: IUiFixtures): Promise<void>
{
    await prepareCart(context);
    await context.menu.openCart();
    // The expected amount comes from the cart before any checkout submission.
    context.basket.total = (await context.cart.readProducts()).reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await context.cart.checkout();
}

async function prepareOverview(context: IUiFixtures): Promise<void>
{
    await prepareCheckout(context);
    await context.checkout.continueWith(data.checkout);
    await context.checkout.itemTotal.waitFor();
}

async function prepareCompletedPurchase(context: IUiFixtures): Promise<void>
{
    await prepareOverview(context);
    await context.checkout.finish();
}

async function prepareReturnedCatalogue(context: IUiFixtures): Promise<void>
{
    await prepareCompletedPurchase(context);
    await context.menu.allItems();
}

async function preparePostPurchaseCart(context: IUiFixtures): Promise<void>
{
    await prepareReturnedCatalogue(context);
    await context.menu.openCart();
}
