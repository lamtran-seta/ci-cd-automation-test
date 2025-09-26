import { Page } from '@playwright/test';

export class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isLoggedIn() {
        return await this.page.locator('.inventory_list').isVisible();
    }

    async logout() {
        await this.page.click('#react-burger-menu-btn');
        await this.page.click('#logout_sidebar_link');
    }

    async addProductToCart(productName: string) {
        const productElements = await this.page.locator('.inventory_item')
            .filter({
                has: this.page.locator('.inventory_item_name', {
                    hasText: new RegExp(productName, 'i')  // 'i' flag for case-insensitive
                })
            })
            .all();

        if (productElements.length === 0) {
            return; // Do nothing if no products found
        }

        if (productElements.length > 1) {
            console.warn(`Found ${productElements.length} products matching "${productName}". Adding the first one.`);
        }

        // Get the add to cart button for the first matching product
        const addButton = await productElements[0].locator('button:has-text("Add to cart")');

        // Check if add button exists before clicking
        if (await addButton.count() === 0) {
            return; // Do nothing if button not found
        }

        await addButton.click();
    }

    async goToCart() {
        await this.page.click('.shopping_cart_link');
    }
}
