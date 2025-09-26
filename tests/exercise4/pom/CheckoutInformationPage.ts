import { Page } from '@playwright/test';

export class CheckoutInformationPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill('[data-test="firstName"]', firstName);
        await this.page.fill('[data-test="lastName"]', lastName);
        await this.page.fill('[data-test="postalCode"]', postalCode);
        await this.page.click('[data-test="continue"]');
    }

    async getErrorMessage() {
        const errorElement = await this.page.locator('[data-test="error"]');
        return errorElement.textContent();
    }

    async clickContinue() {
        await this.page.click('[data-test="continue"]');
    }
}