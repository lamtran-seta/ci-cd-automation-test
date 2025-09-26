import { Page } from '@playwright/test';

export class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getCartItems() {
        return await this.page
            .locator('.cart_item')
            .all();
    }

    async returnToInventory() {
        await this.page.click('#continue-shopping');
    }

    async removeProductFromCart(productName: string) {
        const cartItems = await this.page.locator('.cart_item')
            .filter({
                has: this.page.locator('.inventory_item_name', {
                    hasText: new RegExp(productName, 'i')
                })
            })
            .all();

        if (cartItems.length === 0) {
            return;
        }

        if (cartItems.length > 1) {
            console.warn(`Found ${cartItems.length} items matching "${productName}". Removing the first one.`);
        }

        const removeButton = await cartItems[0].locator('button:has-text("Remove")');
        if (await removeButton.count() === 0) {
            return;
        }

        await removeButton.click();
    }

    async proceedToCheckout() {
        await this.page.click('[data-test="checkout"]');
    }
}