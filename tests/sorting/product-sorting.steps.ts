import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/ui.fixture.js';
import type { IUiFixtures } from '../../src/fixtures/ui.types.js';
import type { IProduct } from '../../src/pages/shop.types.js';
import { moneyToCents } from '../../src/helpers/money.js';
import { data, requiredCase, byName } from '../shared/scenario-support.js';

const { When, Then } = createBdd(test);

// #region When

When(/^I attempt to sort all products by (?:name from A to Z|name from Z to A|price from low to high|price from high to low)$/, async ({ products, basket }: IUiFixtures): Promise<void> =>
{
    basket.products = await products.readProducts();
    await products.sortBy(requiredCase(data.sorts, test.info().title).option);
});

// #endregion

// #region Then

Then('all products follow the requested sort order', async ({ products, basket }: IUiFixtures): Promise<void> =>
{
    await expect(products.sort.locator('option')).toHaveText(Object.values(data.sorts).map((entry): string => entry.label));
    const sort = requiredCase(data.sorts, test.info().title);
    const direction = sort.descending ? -1 : 1;
    await expect(products.sort).toHaveValue(sort.option);
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

// #endregion
