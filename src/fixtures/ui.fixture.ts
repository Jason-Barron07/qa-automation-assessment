import { test as base } from 'playwright-bdd';
import { getCredentials } from '../config/environment.js';
import { LoginPage } from '../pages/login.page.js';
import { ProductsPage } from '../pages/products.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { ShopMenu } from '../components/shop-menu.js';
import type { ICredentials } from '../config/environment.types.js';
import type { IBasket, IPageDependencies, IUiFixtures } from './ui.types.js';

export const test = base.extend<IUiFixtures>({
    credentials: async ({}, use: (credentials: ICredentials) => Promise<void>): Promise<void> =>
    {
        await use(getCredentials());
    },
    basket: async ({}, use: (basket: IBasket) => Promise<void>): Promise<void> =>
    {
        await use({ products: [], total: 0 });
    },
    login: async ({ page }: IPageDependencies, use: (value: LoginPage) => Promise<void>): Promise<void> =>
    {
        await use(new LoginPage(page));
    },
    products: async ({ page }: IPageDependencies, use: (value: ProductsPage) => Promise<void>): Promise<void> =>
    {
        await use(new ProductsPage(page));
    },
    cart: async ({ page }: IPageDependencies, use: (value: CartPage) => Promise<void>): Promise<void> =>
    {
        await use(new CartPage(page));
    },
    checkout: async ({ page }: IPageDependencies, use: (value: CheckoutPage) => Promise<void>): Promise<void> =>
    {
        await use(new CheckoutPage(page));
    },
    menu: async ({ page }: IPageDependencies, use: (value: ShopMenu) => Promise<void>): Promise<void> =>
    {
        await use(new ShopMenu(page));
    },
});
