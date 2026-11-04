import type { Locator, Page } from '@playwright/test';

export class ShopMenu
{
    public readonly badge: Locator;
    private readonly page: Page;

    /**
     * Creates shared cart and menu controls.
     * @param page Isolated browser page.
     */
    public constructor(page: Page)
    {
        this.page = page;
        this.badge = page.getByTestId('shopping-cart-badge');
    }

    /** Opens the cart and waits for its checkout control. */
    public async openCart(): Promise<void>
    {
        await this.page.getByTestId('shopping-cart-link').click();
        await this.page.getByTestId('checkout').waitFor();
    }

    /** Opens the burger menu and returns to All Items. */
    public async allItems(): Promise<void>
    {
        await this.page.getByRole('button', { name: 'Open Menu', exact: true }).click();
        await this.page.getByTestId('inventory-sidebar-link').click();
        await this.page.getByTestId('product-sort-container').waitFor();
    }

    /** Opens the burger menu and logs out. */
    public async logout(): Promise<void>
    {
        await this.page.getByRole('button', { name: 'Open Menu', exact: true }).click();
        await this.page.getByTestId('logout-sidebar-link').click();
        await this.page.getByTestId('login-button').waitFor();
    }
}
