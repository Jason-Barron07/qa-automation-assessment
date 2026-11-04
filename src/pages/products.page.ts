import type { Locator, Page } from '@playwright/test';
import type { IProduct } from './shop.types.js';
import { moneyToCents } from '../helpers/money.js';

export class ProductsPage
{
    public readonly title: Locator;
    public readonly items: Locator;
    public readonly sort: Locator;
    public readonly names: Locator;
    public readonly prices: Locator;

    /**
     * Creates inventory controls.
     * @param page Isolated browser page.
     */
    public constructor(page: Page)
    {
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.sort = page.getByTestId('product-sort-container');
        this.names = page.getByTestId('inventory-item-name');
        this.prices = page.getByTestId('inventory-item-price');
    }

    /**
     * Reads the complete displayed inventory with prices in cents.
     * @returns Product names and prices.
     */
    public async readProducts(): Promise<IProduct[]>
    {
        await this.items.first().waitFor();
        const rows = await this.items.all();
        return await Promise.all(rows.map(async (row: Locator): Promise<IProduct> => ({
            name: await row.getByTestId('inventory-item-name').innerText(),
            price: moneyToCents(await row.getByTestId('inventory-item-price').innerText())
        })));
    }

    /**
     * Selects a supported sort option.
     * @param option Select option value.
     */
    public async sortBy(option: string): Promise<void>
    {
        await this.sort.selectOption(option);
    }

    /** Adds each displayed product through its own button. */
    public async addAll(): Promise<void>
    {
        const rows = await this.items.all();
        for (const row of rows)
        {
            await row.getByRole('button', { name: 'Add to cart', exact: true }).click();
        }
    }
}
