import loginPage from './pageobjects/login.page.js';
import cartPage from './pageobjects/cart.page.js';
import checkoutPage from './pageobjects/checkout.page.js';

describe('Checkout Tests', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
    });

    it('TC11: Valid Checkout', async () => {
        await cartPage.addToCart();
        const cartCount = await cartPage.getCartCount();
        expect(cartCount).toBe(1);

        await cartPage.openCart();
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('cart.html');
        
        const cartItemsCount = await cartPage.getElementsCount('.cart_item');
        expect(cartItemsCount).toBe(1);

        const customerData = {
            firstName: 'Anastasiia',
            lastName: 'Chep',
            postalCode: '111'
        };

        await checkoutPage.proceedToCheckout();
        
        const checkoutUrl = await checkoutPage.getCurrentUrl();
        expect(checkoutUrl).toContain('checkout-step-one.html');

        await checkoutPage.fillCheckoutForm(
            customerData.firstName, 
            customerData.lastName, 
            customerData.postalCode
        );

        const firstNameValue = await checkoutPage.inputFirstName.getValue();
        expect(firstNameValue).toBe('Anastasiia');
        
        const lastNameValue = await checkoutPage.inputLastName.getValue();
        expect(lastNameValue).toBe('Chep');
        
        const postalCodeValue = await checkoutPage.inputPostalCode.getValue();
        expect(postalCodeValue).toBe('111');

        await checkoutPage.continueToOverview();
        const overviewUrl = await checkoutPage.getCurrentUrl();
        expect(overviewUrl).toContain('checkout-step-two.html');
        
        const overviewData = await checkoutPage.verifyOverviewData(1);
        expect(overviewData.isItemsCountCorrect).toBe(true);
        expect(overviewData.hasTotalPrice).toBe(true);

        await checkoutPage.finishCheckout();
        const completeUrl = await checkoutPage.getCurrentUrl();
        expect(completeUrl).toContain('checkout-complete.html');
        
        const completeMessage = await checkoutPage.getCompleteMessage();
        expect(completeMessage).toContain('Thank you for your order!');

        await checkoutPage.backToHome();
        const finalUrl = await checkoutPage.getCurrentUrl();
        expect(finalUrl).toContain('inventory.html');
        
        const inventoryItemsCount = await checkoutPage.getElementsCount('.inventory_item');
        expect(inventoryItemsCount).toBeGreaterThan(0);
        
        const isCartEmpty = await checkoutPage.isCartEmpty();
        expect(isCartEmpty).toBe(true);
    });
});