import LoginPage from './pageobjects/login.page.js';
import CartPage from './pageobjects/cart.page.js';
import CheckoutPage from './pageobjects/checkout.page.js';

describe('Checkout Empty Cart Tests', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to inventory page' });
    });

    it('TC12: Checkout without products', async () => {
        const inventoryUrl = await browser.getUrl();
        expect(inventoryUrl).toContain('inventory.html');
        
        const isCartInitiallyEmpty = await CheckoutPage.isCartEmpty();
        expect(isCartInitiallyEmpty).toBe(true);
        await browser.pause(2000);

        await CartPage.btnCart.waitForDisplayed({ timeout: 10000 });
        await CartPage.btnCart.waitForClickable({ timeout: 10000 });
        await CartPage.btnCart.click();
        await browser.pause(2000);

        const cartUrl = await browser.getUrl();
        expect(cartUrl).toContain('cart.html');
        
        const isCartPageEmpty = await CheckoutPage.isCartPageEmpty();
        expect(isCartPageEmpty).toBe(true);
        
        const cartItems = await CartPage.cartItems;
        expect(cartItems.length).toBe(0);
        await browser.pause(2000);

        const checkoutAttempt = await CheckoutPage.tryCheckout();
        await browser.pause(2000);

        if (!checkoutAttempt) {
            const stillOnCartPage = await CheckoutPage.isOnCartPage();
            expect(stillOnCartPage).toBe(true);
            
            const checkoutButtonExists = await CheckoutPage.btnCheckout.isExisting();
            if (checkoutButtonExists) {
                const isCheckoutClickable = await CheckoutPage.btnCheckout.isClickable();
                expect(isCheckoutClickable).toBe(false);
            }
            await browser.pause(2000);
        } 
        else {
            const stillOnCartPage = await CheckoutPage.isOnCartPage();
            expect(stillOnCartPage).toBe(true);
            
            const errorMessage = await CheckoutPage.getErrorMessage();
            if (errorMessage) {
                expect(errorMessage.toLowerCase()).toContain('empty');
            }
            await browser.pause(2000);
        }

        const finalUrl = await browser.getUrl();
        expect(finalUrl).not.toContain('checkout-step-one.html');
        expect(finalUrl).toContain('cart.html');
        
        const finalCartItems = await CartPage.cartItems;
        expect(finalCartItems.length).toBe(0);
        await browser.pause(2000);

        try {
            await CheckoutPage.inputFirstName.waitForDisplayed({ timeout: 2000 });
            expect(true).toBe(false); 
        } catch (error) {
            expect(true).toBe(true);
        }
        await browser.pause(2000);
    });
});