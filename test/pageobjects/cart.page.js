import Page from './page.js';

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
        await this.waitForAndInteract(this.btnAddToCart, (el) => el.click());
        await this.waitForDisplayed(this.cartBadge);
    }

    async openCart() {
        await this.waitForAndInteract(this.btnCart, (el) => el.click());
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('cart.html');
        }, { timeoutMsg: 'Did not navigate to cart page' });
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
            await this.waitForDisplayed(this.cartBadge);
            const count = await this.cartBadge.getText();
            return parseInt(count) || 0;
        } catch (error) {
            return 0;
        }
    }

    async verifyCartAfterLogin() {
        const cartCount = await this.getCartCount();
        expect(cartCount).toBe(1);
        await this.openCart();
        const cartItemsAfterReLogin = await this.cartItems;
        expect(cartItemsAfterReLogin.length).toBe(1);
    }

    open() {
        return super.open('inventory.html');
    }
}

export default new CartPage();