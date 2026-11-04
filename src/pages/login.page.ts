import type { Locator, Page } from '@playwright/test';

export class LoginPage
{
    public readonly username: Locator;
    public readonly password: Locator;
    public readonly submit: Locator;
    public readonly error: Locator;
    private readonly page: Page;

    /**
     * Creates the login page object.
     * @param page Isolated browser page.
     */
    public constructor(page: Page)
    {
        this.page = page;
        this.username = page.getByTestId('username');
        this.password = page.getByTestId('password');
        this.submit = page.getByTestId('login-button');
        this.error = page.getByTestId('error');
    }

    /** Opens the configured login page. */
    public async open(): Promise<void>
    {
        await this.page.goto('/');
        await this.submit.waitFor();
    }

    /**
     * Submits credentials without assuming successful authentication.
     * @param username Account name.
     * @param password Account password.
     */
    public async login(username: string, password: string): Promise<void>
    {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.submit.click();
    }
}
