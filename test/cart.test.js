import loginPage from './pageobjects/login.page.js';
import cartPage from './pageobjects/cart.page.js';

describe('Cart Page Tests', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
    });

    it('TC8: Saving the cart after logout', async () => {
        await cartPage.addToCart();
        const cartCount = await cartPage.getCartCount();
        expect(cartCount).toBe(1);

        await loginPage.logout();
        await loginPage.waitForLoginPage();

        const usernameValue = await loginPage.inputUsername.getValue();
        const passwordValue = await loginPage.inputPassword.getValue();
        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');

        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();

        await cartPage.verifyCartAfterLogin();
    });
});