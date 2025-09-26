import { Page } from '@playwright/test';

export class CheckoutOverviewPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getSummaryDetails() {
        const subtotal = await this.page.locator('.summary_subtotal_label').textContent() || '';
        const tax = await this.page.locator('.summary_tax_label').textContent() || '';
        const total = await this.page.locator('.summary_total_label').textContent() || '';

        return {
            subtotal: subtotal.replace('Item total: $', ''),
            tax: tax.replace('Tax: $', ''),
            total: total.replace('Total: $', '')
        };
    }

    async finishCheckout() {
        await this.page.click('[data-test="finish"]');
    }

    async cancelCheckout() {
        await this.page.click('[data-test="cancel"]');
    }
}