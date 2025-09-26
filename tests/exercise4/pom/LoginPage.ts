import { Page } from '@playwright/test';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.page.fill('[data-test="username"]', username);
        await this.page.fill('[data-test="password"]', password);
        await this.page.click('[data-test="login-button"]');
    }

    async getErrorMessage() {
        const errorElement = await this.page.locator('[data-test="error"]');
        return errorElement.textContent();
    }

    async isLoginButtonVisible() {
        return await this.page.isVisible('[data-test="login-button"]');
    }
}
