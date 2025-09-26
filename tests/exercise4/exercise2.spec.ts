import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';
import {CartPage} from "./pom/CartPage";
import productData from "./testData/products.json";

test.describe('Exercise 2 - Shopping Cart Tests - @Exe4', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    const products = productData.products;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.navigateToLoginPage();
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await inventoryPage.isLoggedIn()).toBeTruthy();
    });

    test('(a) Add two products and verify cart', async () => {
        // Add products from test data
        for (const product of products) {
            await inventoryPage.addProductToCart(product.name);
        }

        await inventoryPage.goToCart();
        const cartItems = await cartPage.getCartItems();
        expect(cartItems.length).toBe(products.length);

        // Verify product names and prices
        for (const item of cartItems) {
            const itemName = await item.locator('.inventory_item_name').textContent();
            const itemPrice = await item.locator('.inventory_item_price').textContent();

            const expectedProduct = products.find(p => p.name === itemName);
            expect(expectedProduct).toBeDefined();
            expect(itemPrice).toContain(expectedProduct!.price);
        }
    });

    test('(b) Remove one product and verify remaining', async () => {
        // Add all products first
        for (const product of products) {
            await inventoryPage.addProductToCart(product.name);
        }

        await inventoryPage.goToCart();

        // Remove first product
        await cartPage.removeProductFromCart(products[0].name);

        const cartItems = await cartPage.getCartItems();
        expect(cartItems.length).toBe(1);

        // Verify remaining product name and price
        const itemName = await cartItems[0].locator('.inventory_item_name').textContent();
        const itemPrice = await cartItems[0].locator('.inventory_item_price').textContent();
        expect(itemName).toBe(products[1].name);
        expect(itemPrice).toContain(products[1].price);
    });

    test('(c) Remove all products and verify empty cart', async () => {
        // Add all products
        for (const product of products) {
            await inventoryPage.addProductToCart(product.name);
        }

        await inventoryPage.goToCart();

        // Remove all products
        for (const product of products) {
            await cartPage.removeProductFromCart(product.name);
        }

        const cartItems = await cartPage.getCartItems();
        expect(cartItems.length).toBe(0);
    });
});