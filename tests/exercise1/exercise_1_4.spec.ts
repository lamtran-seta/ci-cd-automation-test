import { test, expect } from '@playwright/test';

test('User can log in to saucedemo.com - @Exe1', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/');

    // Enter username and password
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');

    // Click the Login button
    await page.click('[data-test="login-button"]');

    // Verify successful login by checking the URL
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Optionally, verify the Products page is visible
    await expect(page.locator('.title')).toHaveText('Products');
});