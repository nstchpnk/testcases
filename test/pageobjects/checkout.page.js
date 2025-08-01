import Page from './page.js';

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

    get cartBadge() {
        return $('.shopping_cart_badge');
    }

    get errorMessage() {
        return $('.error-message-container');
    }

    async proceedToCheckout() {
        await this.waitForAndInteract(this.btnCheckout, (el) => el.click());

        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('checkout-step-one.html');
        }, { 
            timeoutMsg: 'Did not navigate to checkout form page' 
        });
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.setValue(this.inputFirstName, firstName);
        await this.setValue(this.inputLastName, lastName);
        await this.setValue(this.inputPostalCode, postalCode);
    }

    async continueToOverview() {
        await this.waitForAndInteract(this.btnContinue, (el) => el.click());
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('checkout-step-two.html');
        }, { 
            timeoutMsg: 'Did not navigate to checkout overview page' 
        });
    }

    async finishCheckout() {
        await this.waitForAndInteract(this.btnFinish, (el) => el.click());
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('checkout-complete.html');
        }, { 
            timeoutMsg: 'Did not navigate to checkout complete page' 
        });
    }

    async backToHome() {
        await this.waitForAndInteract(this.btnBackHome, (el) => el.click());
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('inventory.html');
        }, { 
            timeoutMsg: 'Did not navigate back to inventory page' 
        });
    }

    async getOverviewItemsCount() {
        const items = await this.overviewItems;
        return items.length;
    }

    async getTotalPriceText() {
        await this.waitForDisplayed(this.totalPrice);
        return await this.getText(this.totalPrice);
    }

    async getCompleteMessage() {
        await this.waitForDisplayed(this.completeHeader);
        return await this.getText(this.completeHeader);
    }

    async isCartEmpty() {
        try {
            await this.waitForDisplayed(this.cartBadge, 2000);
            return false; 
        } catch (error) {
            return true; 
        }
    }

    async isCartPageEmpty() {
        const url = await this.getCurrentUrl();
        if (!url.includes('cart.html')) {
            return false;
        }
        
        const items = await this.cartItems;
        return items.length === 0;
    }

    async isOnCartPage() {
        const url = await this.getCurrentUrl();
        return url.includes('cart.html');
    }

    async tryCheckout() {
        try {
            const isClickable = await this.isClickable(this.btnCheckout);
            if (!isClickable) {
                return false;
            }
            
            await this.click(this.btnCheckout);
            
            await this.waitUntil(async () => {
                const url = await this.getCurrentUrl();
                return !url.includes('cart.html') || url.includes('checkout-step-one.html');
            }, { 
                timeoutMsg: 'Checkout attempt timeout' 
            });
            
            return true;
        } catch (error) {
            return false;
        }
    }

    async getErrorMessage() {
        try {
            await this.waitForDisplayed(this.errorMessage, 2000);
            return await this.getText(this.errorMessage);
        } catch (error) {
            return null;
        }
    }

    async isClickable(element) {
        try {
            await this.waitForClickable(element, 2000);
            return true;
        } catch (error) {
            return false;
        }
    }

    async completeCheckoutFlow(customerData) {
        try {
            await this.proceedToCheckout();
            await this.fillCheckoutForm(
                customerData.firstName, 
                customerData.lastName, 
                customerData.postalCode
            );
            await this.continueToOverview();
            await this.finishCheckout();
            await this.backToHome();
            return true;
        } catch (error) {
            console.error('Checkout flow failed:', error.message);
            return false;
        }
    }

    async verifyOverviewData(expectedItemsCount) {
        const itemsCount = await this.getOverviewItemsCount();
        const totalPriceText = await this.getTotalPriceText();
        
        return {
            itemsCount,
            totalPriceText,
            isItemsCountCorrect: itemsCount === expectedItemsCount,
            hasTotalPrice: totalPriceText.includes('Total:')
        };
    }

    open() {
        return super.open('cart.html');
    }
}

export default new CheckoutPage();