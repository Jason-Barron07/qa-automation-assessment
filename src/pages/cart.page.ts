import type { Locator, Page } from '@playwright/test';
import type { IProduct } from './shop.types.js';
import { moneyToCents } from '../helpers/money.js';

export class CartPage
{
    public readonly items: Locator;
    public readonly quantities: Locator;
    private readonly page: Page;

    /**
     * Creates cart controls.
     * @param page Isolated browser page.
     */
    public constructor(page: Page)
    {
        this.page = page;
        this.items = page.getByTestId('inventory-item');
        this.quantities = page.getByTestId('item-quantity');
    }

    /**
     * Reads cart line items without assuming a displayed subtotal exists.
     * @returns Cart products with integer-cent prices.
     */
    public async readProducts(): Promise<IProduct[]>
    {
        const rows = await this.items.all();
        return await Promise.all(rows.map(async (row: Locator): Promise<IProduct> => ({
            name: await row.getByTestId('inventory-item-name').innerText(),
            price: moneyToCents(await row.getByTestId('inventory-item-price').innerText())
        })));
    }

    /** Starts checkout from the cart. */
    public async checkout(): Promise<void>
    {
        await this.page.getByTestId('checkout').click();
        await this.page.getByTestId('firstName').waitFor();
    }
}
