import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login Page - @Exe2', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
    });

    test('Login button is visible and enabled by default', async ({ page }) => {
        const loginButton = page.locator('[data-test="login-button"]');
        await expect(loginButton).toBeVisible();
        await expect(loginButton).toBeEnabled();
    });

    test('Logo image is visible on the login page', async ({ page }) => {
        const logo = page.locator('.login_logo');
        await expect(logo).toBeVisible();
    });

    test('Login with valid credentials lands on Products page', async ({ page }) => {
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await expect(page).toHaveURL(/.*inventory\.html/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('Login with invalid password shows error', async ({ page }) => {
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'wrong_password');
        await page.click('[data-test="login-button"]');
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Login with empty username shows "Username is required"', async ({ page }) => {
        await page.fill('[data-test="username"]', '');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    });

    test('Login with empty password shows "Password is required"', async ({ page }) => {
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', '');
        await page.click('[data-test="login-button"]');
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
    });

    test('Locked-out user shows locked out error', async ({ page }) => {
        await page.fill('[data-test="username"]', 'locked_out_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });
});