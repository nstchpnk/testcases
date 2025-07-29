import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * Checkout Page Object with all necessary methods for checkout flow
 */
class CheckoutPage extends Page {

    get btnCheckout() {
        return $('#checkout');
    }

    get cartItems() {
        return $$('.cart_item');
    }

    get inputFirstName() {
        return $('#first-name');
    }

    get inputLastName() {
        return $('#last-name');
    }

    get inputPostalCode() {
        return $('#postal-code');
    }

    get btnContinue() {
        return $('#continue');
    }

    get overviewItems() {
        return $$('.cart_item');
    }

    get totalPrice() {
        return $('.summary_total_label');
    }

    get btnFinish() {
        return $('#finish');
    }

    get completeHeader() {
        return $('.complete-header');
    }

    get btnBackHome() {
        return $('#back-to-products');
    }

  
    async proceedToCheckout() {
        await this.btnCheckout.waitForDisplayed({ timeout: 10000 });
        await this.btnCheckout.waitForClickable({ timeout: 10000 });
        await this.btnCheckout.click();

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('checkout-step-one.html');
        }, { 
            timeout: 10000, 
            timeoutMsg: 'Did not navigate to checkout form page' 
        });
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.inputFirstName.waitForDisplayed({ timeout: 10000 });
        await this.inputFirstName.clearValue();
        await this.inputFirstName.setValue(firstName);

        await this.inputLastName.waitForDisplayed({ timeout: 10000 });
        await this.inputLastName.clearValue();
        await this.inputLastName.setValue(lastName);

        await this.inputPostalCode.waitForDisplayed({ timeout: 10000 });
        await this.inputPostalCode.clearValue();
        await this.inputPostalCode.setValue(postalCode);
    }

    async continueToOverview() {
        await this.btnContinue.waitForDisplayed({ timeout: 10000 });
        await this.btnContinue.waitForClickable({ timeout: 10000 });
        await this.btnContinue.click();

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('checkout-step-two.html');
        }, { 
            timeout: 10000, 
            timeoutMsg: 'Did not navigate to checkout overview page' 
        });
    }

    async finishCheckout() {
        await this.btnFinish.waitForDisplayed({ timeout: 10000 });
        await this.btnFinish.waitForClickable({ timeout: 10000 });
        await this.btnFinish.click();

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('checkout-complete.html');
        }, { 
            timeout: 10000, 
            timeoutMsg: 'Did not navigate to checkout complete page' 
        });
    }

    async backToHome() {
        await this.btnBackHome.waitForDisplayed({ timeout: 10000 });
        await this.btnBackHome.waitForClickable({ timeout: 10000 });
        await this.btnBackHome.click();

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { 
            timeout: 10000, 
            timeoutMsg: 'Did not navigate back to inventory page' 
        });
    }

    async getOverviewItemsCount() {
        const items = await this.overviewItems;
        return items.length;
    }

    async getTotalPriceText() {
        await this.totalPrice.waitForDisplayed({ timeout: 10000 });
        return await this.totalPrice.getText();
    }

    async getCompleteMessage() {
        await this.completeHeader.waitForDisplayed({ timeout: 10000 });
        return await this.completeHeader.getText();
    }

    async isCartEmpty() {
        try {
            const cartBadge = $('.shopping_cart_badge');
            await cartBadge.waitForDisplayed({ timeout: 5000 });
            return false; 
        } catch (error) {
            return true; 
        }
    }

    open() {
        return super.open('cart.html');
    }
}

export default new CheckoutPage();