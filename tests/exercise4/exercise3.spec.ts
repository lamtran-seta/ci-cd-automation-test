import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';
import { CartPage } from './pom/CartPage';
import { CheckoutInformationPage } from './pom/CheckoutInformationPage';
import { CheckoutOverviewPage } from './pom/CheckoutOverviewPage';
import { CheckoutCompletePage } from './pom/CheckoutCompletePage';
import productData from './testData/products.json';
import checkoutData from './testData/checkout-data.json';

test.describe('Exercise 3 - Checkout Flow Tests - @Exe4', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutInfoPage: CheckoutInformationPage;
    let checkoutOverviewPage: CheckoutOverviewPage;
    let checkoutCompletePage: CheckoutCompletePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutInfoPage = new CheckoutInformationPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);

        await loginPage.navigateToLoginPage();
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await inventoryPage.isLoggedIn()).toBeTruthy();
    });

    test('(a) Complete checkout with one product', async () => {
        // Add first product to cart
        await inventoryPage.addProductToCart(productData.products[0].name);
        await inventoryPage.goToCart();

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Fill checkout information
        const { firstName, lastName, postalCode } = checkoutData.validCheckout;
        await checkoutInfoPage.fillCheckoutInformation(firstName, lastName, postalCode);

        // Complete checkout
        await checkoutOverviewPage.finishCheckout();

        // Verify success message
        const successMessage = await checkoutCompletePage.getSuccessMessage();
        expect(successMessage).toBe(checkoutData.expectedMessages.success);
    });

    test('(b) Verify total calculation with multiple products', async () => {
        // Add all products to cart
        for (const product of productData.products) {
            await inventoryPage.addProductToCart(product.name);
        }
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();

        // Fill checkout information
        const { firstName, lastName, postalCode } = checkoutData.validCheckout;
        await checkoutInfoPage.fillCheckoutInformation(firstName, lastName, postalCode);

        // Verify order summary
        const summary = await checkoutOverviewPage.getSummaryDetails();

        // Calculate expected subtotal
        const expectedSubtotal = productData.products
            .reduce((sum, product) => sum + parseFloat(product.price), 0)
            .toFixed(2);

        // Convert values to numbers and fix to 2 decimal places
        const actualSubtotal = parseFloat(summary.subtotal).toFixed(2);
        const actualTax = parseFloat(summary.tax).toFixed(2);
        const actualTotal = parseFloat(summary.total).toFixed(2);

        // Calculate expected total with 2 decimal places
        const calculatedTotal = String(parseFloat(summary.subtotal) + parseFloat(summary.tax));

        expect(actualSubtotal).toBe(expectedSubtotal);
        expect(parseFloat(actualTax)).toBeGreaterThan(0);
        expect(actualTotal).toBe(calculatedTotal);
    });

    test('(c) Verify validation error for empty fields', async () => {
        // Add a product and go to checkout
        await inventoryPage.addProductToCart(productData.products[0].name);
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();

        // Try to continue without filling any information
        await checkoutInfoPage.clickContinue();

        // Verify error message
        const errorMessage = await checkoutInfoPage.getErrorMessage();
        expect(errorMessage).toBe(checkoutData.expectedMessages.error);
    });
});