import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';

test.describe('Exercise 1 - Login & Logout Tests - @Exe4', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.navigateToLoginPage();
    });

    test('(a) Successful login with standard_user', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await inventoryPage.isLoggedIn()).toBeTruthy();
    });

    test('(b) Failed login with wrong password', async () => {
        await loginPage.login('standard_user', 'wrong_password');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username and password do not match');
    });

    test('(c) Logout after successful login', async ({ page }) => {
        // Login first
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await inventoryPage.isLoggedIn()).toBeTruthy();

        // Perform logout using the page object method
        await inventoryPage.logout();

        // Verify we're back at login page
        expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
    });
});
