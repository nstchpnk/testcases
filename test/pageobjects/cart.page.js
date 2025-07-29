import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * Simplified CartPage with reliable methods
 */
class CartPage extends Page {

    get btnAddToCart() {
        return $('.btn_inventory');
    }

    get cartBadge() {
        return $('.shopping_cart_badge');
    }

    get btnCart() {
        return $('.shopping_cart_link');
    }

    get cartItems() {
        return $$('.cart_item');
    }

    async addToCart() {
        
        await this.btnAddToCart.waitForDisplayed({ timeout: 10000 });
        await this.btnAddToCart.waitForClickable({ timeout: 10000 });
        await this.btnAddToCart.click();
        
        await this.cartBadge.waitForDisplayed({ timeout: 10000 });        
    }

    async openCart() {
        
        await this.btnCart.waitForDisplayed({ timeout: 10000 });
        await this.btnCart.waitForClickable({ timeout: 10000 });
        await this.btnCart.click();

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('cart.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to cart page' });
        
    }

    async isProductInCart(productName) {
        await this.openCart();
        const items = await this.cartItems;
        
        for (let item of items) {
            const nameElement = await item.$('.inventory_item_name');
            if (await nameElement.isDisplayed()) {
                const name = await nameElement.getText();
                if (name === productName) {
                    return true;
                }
            }
        }
        return false;
    }

    async getCartCount() {
        try {
            await this.cartBadge.waitForDisplayed({ timeout: 5000 });
            const count = await this.cartBadge.getText();
            return parseInt(count) || 0;
        } catch (error) {
            return 0;
        }
    }

    open() {
        return super.open('inventory.html');
    }
}

export default new CartPage();