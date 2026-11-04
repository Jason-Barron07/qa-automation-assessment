import type { Page } from '@playwright/test';
import type { ICredentials } from '../config/environment.types.js';
import type { LoginPage } from '../pages/login.page.js';
import type { ProductsPage } from '../pages/products.page.js';
import type { CartPage } from '../pages/cart.page.js';
import type { CheckoutPage } from '../pages/checkout.page.js';
import type { ShopMenu } from '../components/shop-menu.js';
import type { IProduct } from '../pages/shop.types.js';

export interface IUiFixtures
{
    login: LoginPage;
    products: ProductsPage;
    cart: CartPage;
    checkout: CheckoutPage;
    menu: ShopMenu;
    credentials: ICredentials;
    basket: IBasket;
}

export interface IPageDependencies
{
    page: Page;
}

export interface IBasket
{
    products: IProduct[];
    total: number;
}
