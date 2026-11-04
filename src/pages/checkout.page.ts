import type { Locator, Page } from '@playwright/test';
import type { ICheckoutDetails } from './shop.types.js';

export class CheckoutPage
{
    public readonly error: Locator;
    public readonly firstName: Locator;
    public readonly itemTotal: Locator;
    public readonly tax: Locator;
    public readonly total: Locator;
    public readonly completeTitle: Locator;
    public readonly completeMessage: Locator;
    public readonly title: Locator;
    private readonly page: Page;

    /**
     * Creates checkout information, overview, and completion controls.
     * @param page Isolated browser page.
     */
    public constructor(page: Page)
    {
        this.page = page;
        this.error = page.getByTestId('error');
        this.firstName = page.getByTestId('firstName');
        this.itemTotal = page.getByTestId('subtotal-label');
        this.tax = page.getByTestId('tax-label');
        this.total = page.getByTestId('total-label');
        this.completeTitle = page.getByTestId('complete-header');
        this.completeMessage = page.getByTestId('complete-text');
        this.title = page.getByTestId('title');
    }

    /**
     * Submits checkout information, including intentional missing fields.
     * @param details Scenario input.
     */
    public async continueWith(details: ICheckoutDetails): Promise<void>
    {
        await this.firstName.fill(details.firstName);
        await this.page.getByTestId('lastName').fill(details.lastName);
        await this.page.getByTestId('postalCode').fill(details.postalCode);
        await this.page.getByTestId('continue').click();
    }

    /** Completes the demo order. */
    public async finish(): Promise<void>
    {
        await this.page.getByTestId('finish').click();
        await this.completeTitle.waitFor();
    }
}
