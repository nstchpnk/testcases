import loginPage from './pageobjects/login.page.js';
import cartPage from './pageobjects/cart.page.js';
import checkoutPage from './pageobjects/checkout.page.js';

describe('Checkout Empty Cart Tests', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
    });

    it('TC12: Checkout without products - BUG: Expected behavior not implemented', async () => {
        await cartPage.openCart();
        
        const cartUrl = await checkoutPage.getCurrentUrl();
        expect(cartUrl).toContain('cart.html');
        
        const cartItems = await cartPage.cartItems;
        expect(cartItems.length).toBe(0);

        await checkoutPage.proceedToCheckout();
        
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('cart.html'); 
        
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBeTruthy(); 
        expect(errorMessage.toLowerCase()).toContain('cart is empty'); 
        
        /* 
         * BUG REPORT:
         * Expected: User stays on cart.html with error "Cart is empty"
         * Actual: User is redirected to checkout-step-one.html, no error shown
         * 
         * The site currently allows users to proceed with empty cart checkout,
         * which may lead to poor UX and potential issues in the checkout flow.
         */
    });
});