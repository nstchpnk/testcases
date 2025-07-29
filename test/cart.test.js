import LoginPage from './pageobjects/login.page.js';
import CartPage from './pageobjects/cart.page.js';

describe('Cart Page Tests', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to inventory page' });
    });

    it('TC8: Saving the cart after logout', async () => {
        await CartPage.btnAddToCart.waitForDisplayed({ timeout: 10000 });
        await CartPage.btnAddToCart.click();
        
        await CartPage.cartBadge.waitForDisplayed({ timeout: 10000 });
        const cartCount = await CartPage.cartBadge.getText();
        expect(cartCount).toBe('1');
        await browser.pause(2000);

        await LoginPage.btnBurger.waitForDisplayed({ timeout: 10000 });
        await LoginPage.btnBurger.waitForClickable({ timeout: 10000 });
        await LoginPage.btnBurger.click();
        
        await LoginPage.btnLogout.waitForDisplayed({ timeout: 10000 });
        
        const menuItems = await $$('.bm-item');
        await browser.waitUntil(async () => {
            const items = await $$('.bm-item');
            return items.length === 4;
        }, { timeout: 10000, timeoutMsg: 'Menu items did not load properly' });
        
        expect(menuItems.length).toBe(4);
        await LoginPage.btnLogout.waitForClickable({ timeout: 10000 });
        await LoginPage.btnLogout.click();
        await browser.pause(2000);
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('login') || !url.includes('inventory');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to login page' });
        
        await LoginPage.inputUsername.waitForDisplayed({ timeout: 10000 });
        await LoginPage.inputPassword.waitForDisplayed({ timeout: 10000 });
        
        const usernameValue = await LoginPage.inputUsername.getValue();
        const passwordValue = await LoginPage.inputPassword.getValue();
        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');
        await LoginPage.login('standard_user', 'secret_sauce');
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate back to inventory page' });
        
        await CartPage.cartBadge.waitForDisplayed({ timeout: 10000 });
        const newCartCount = await CartPage.cartBadge.getText();
        expect(newCartCount).toBe('1');
        await browser.pause(2000);

        await CartPage.btnCart.waitForDisplayed({ timeout: 10000 });
        await CartPage.btnCart.waitForClickable({ timeout: 10000 });
        await CartPage.btnCart.click();
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('cart.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to cart page' });
        
        await browser.waitUntil(async () => {
            const items = await CartPage.cartItems;
            return items.length === 1;
        }, { timeout: 10000, timeoutMsg: 'Cart items did not load properly' });
        
        const cartItemsAfterReLogin = await CartPage.cartItems;
        expect(cartItemsAfterReLogin.length).toBe(1);
        await browser.pause(2000);
    });
});