import {expect, test} from "@playwright/test";

test.describe.serial('S1 Exercise - @Exe3', () => {
    let page;

    test('Login successfully', async ({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory.html/);
    });

    test('Check product list page', async () => {
        const items = await page.locator('.inventory_item');
        await expect(items).toHaveCount(6);
        for (let i = 0; i < 6; ++i) {
            const item = items.nth(i);
            await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-price"]')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
            await expect(item.locator('img.inventory_item_img')).toBeVisible();
            await expect(item.locator('button[data-test^="add-to-cart"]')).toBeVisible();

            const price = await item.locator('[data-test="inventory-item-price"]').innerText();
            expect(price.startsWith('$')).toBeTruthy();
            expect(parseFloat(price.replace('$', '').trim())).toBeGreaterThan(0);

            const productNameEle = item.locator('[data-test="inventory-item-name"]');
            await expect(productNameEle).toHaveCSS('color', /(rgb\(24,\s?88,\s?58\)|#18583a)/i);
            await expect(productNameEle).toHaveCSS('font-size', '20px');
            await expect(productNameEle).toHaveCSS('font-family', /DM Mono/);
        }
    })
})