import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import type { IProduct } from '../../src/pages/shop.types.js';
import testData from './swag-labs.data.json' with { type: 'json' };
import type { ISwagData } from './swag-labs.types.js';

export const data: ISwagData = testData;

/**
 * Gets JSON test data using the current scenario title.
 * @param cases Available cases.
 * @param name Exact scenario title from Playwright.
 * @returns Matching scenario data.
 */
export function requiredCase<T>(cases: Record<string, T>, name: string): T
{
    const entry = cases[name];
    if (!entry)
    {
        throw new Error(`Unknown test-data case: ${name}`);
    }
    return entry;
}

/**
 * Compares products by name for full-list checks.
 * @param left First product.
 * @param right Second product.
 * @returns Name comparison result.
 */
export function byName(left: IProduct, right: IProduct): number
{
    return left.name.localeCompare(right.name);
}


// Establish independent preconditions through the UI; no scenario depends on another.
/**
 * Establishes a cart containing every product.
 * @param context Isolated scenario fixtures.
 */
export async function prepareCart(context: IUiFixtures): Promise<void>
{
    await context.login.open();
    await context.login.login(context.credentials.username, context.credentials.password);
    await context.products.sort.waitFor();
    context.basket.products = await context.products.readProducts();
    context.basket.total = context.basket.products.reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await context.products.addAll();
}

/**
 * Establishes the checkout information page.
 * @param context Isolated scenario fixtures.
 */
export async function prepareCheckout(context: IUiFixtures): Promise<void>
{
    await prepareCart(context);
    await context.menu.openCart();
    // The expected amount comes from the cart before any checkout submission.
    context.basket.total = (await context.cart.readProducts()).reduce((sum: number, product: IProduct): number => sum + product.price, 0);
    await context.cart.checkout();
}

/**
 * Establishes an order ready for confirmation.
 * @param context Isolated scenario fixtures.
 */
export async function prepareOverview(context: IUiFixtures): Promise<void>
{
    await prepareCheckout(context);
    await context.checkout.continueWith(data.checkout);
    await context.checkout.itemTotal.waitFor();
}

/**
 * Establishes a completed purchase.
 * @param context Isolated scenario fixtures.
 */
export async function prepareCompletedPurchase(context: IUiFixtures): Promise<void>
{
    await prepareOverview(context);
    await context.checkout.finish();
}

/**
 * Establishes the catalogue after a purchase.
 * @param context Isolated scenario fixtures.
 */
export async function prepareReturnedCatalogue(context: IUiFixtures): Promise<void>
{
    await prepareCompletedPurchase(context);
    await context.menu.allItems();
}

/**
 * Establishes the cart after returning from a purchase.
 * @param context Isolated scenario fixtures.
 */
export async function preparePostPurchaseCart(context: IUiFixtures): Promise<void>
{
    await prepareReturnedCatalogue(context);
    await context.menu.openCart();
}
