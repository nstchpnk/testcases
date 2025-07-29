import LoginPage from './pageobjects/login.page.js';
import CartPage from './pageobjects/cart.page.js';
import CheckoutPage from './pageobjects/checkout.page.js';

describe('Checkout Tests', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to inventory page' });
    });

    it('TC11: Valid Checkout', async () => {
        await CartPage.btnAddToCart.waitForDisplayed({ timeout: 10000 });
        await CartPage.btnAddToCart.click();
        await browser.pause(2000);

        await CartPage.cartBadge.waitForDisplayed({ timeout: 10000 });
        const cartCount = await CartPage.cartBadge.getText();
        expect(cartCount).toBe('1');
        await browser.pause(2000);

        await CartPage.openCart();
        await browser.pause(2000);

        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain('cart.html');
        
        const cartItems = await CartPage.cartItems;
        expect(cartItems.length).toBe(1);
        await browser.pause(2000);

        await CheckoutPage.proceedToCheckout();
        await browser.pause(2000);

        const checkoutUrl = await browser.getUrl();
        expect(checkoutUrl).toContain('checkout-step-one.html');
        await browser.pause(2000);

        await CheckoutPage.inputFirstName.waitForDisplayed({ timeout: 10000 });
        await CheckoutPage.inputFirstName.setValue('Anastasiia');
        await browser.pause(2000);

        const firstNameValue = await CheckoutPage.inputFirstName.getValue();
        expect(firstNameValue).toBe('Anastasiia');
        await browser.pause(2000);

        await CheckoutPage.inputLastName.setValue('Chep');
        await browser.pause(2000);

        const lastNameValue = await CheckoutPage.inputLastName.getValue();
        expect(lastNameValue).toBe('Chep');
        await browser.pause(2000);

        await CheckoutPage.inputPostalCode.setValue('111');
        await browser.pause(2000);

        const postalCodeValue = await CheckoutPage.inputPostalCode.getValue();
        expect(postalCodeValue).toBe('111');
        await browser.pause(2000);

        await CheckoutPage.continueToOverview();
        await browser.pause(2000);

        const overviewUrl = await browser.getUrl();
        expect(overviewUrl).toContain('checkout-step-two.html');
        
        const overviewItemsCount = await CheckoutPage.getOverviewItemsCount();
        expect(overviewItemsCount).toBe(1);
        
        const totalPriceText = await CheckoutPage.getTotalPriceText();
        expect(totalPriceText).toContain('Total:');
        await browser.pause(2000);

        await CheckoutPage.finishCheckout();
        await browser.pause(2000);

        const completeUrl = await browser.getUrl();
        expect(completeUrl).toContain('checkout-complete.html');
        
        const completeMessage = await CheckoutPage.getCompleteMessage();
        expect(completeMessage).toContain('Thank you for your order!');
        await browser.pause(2000);

        await CheckoutPage.backToHome();
        await browser.pause(2000);

        const finalUrl = await browser.getUrl();
        expect(finalUrl).toContain('inventory.html');
        
        const inventoryItems = await $$('.inventory_item');
        expect(inventoryItems.length).toBeGreaterThan(0);
        
        const isCartEmpty = await CheckoutPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);
        await browser.pause(2000);
    });
});