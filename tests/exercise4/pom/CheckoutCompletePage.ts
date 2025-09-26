import { Page } from '@playwright/test';

export class CheckoutCompletePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getSuccessMessage() {
        return await this.page.locator('.complete-header').textContent();
    }

    async backToProducts() {
        await this.page.click('[data-test="back-to-products"]');
    }
}