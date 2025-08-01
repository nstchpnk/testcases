import Page from './page.js';

class SortingPage extends Page {
    get sortDropdown() {
        return $('.product_sort_container');
    }

    get inventoryItems() {
        return $$('.inventory_item');
    }

    async selectSortOption(option) {
        await this.waitForAndInteract(this.sortDropdown, (el) => el.selectByAttribute('value', option));

        await this.waitUntil(async () => {
            const itemsCount = await this.getElementsCount('.inventory_item');
            return itemsCount > 0;
        }, { 
            timeoutMsg: 'Products did not load after sorting' 
        });
    }

    async getProductNames() {
        await this.waitUntil(async () => {
            const count = await this.getElementsCount('.inventory_item_name');
            return count > 0;
        }, { 
            timeoutMsg: 'Product names did not load' 
        });

        const nameElements = await this.getElements('.inventory_item_name');
        const productNames = [];
        
        for (let nameElement of nameElements) {
            const name = await this.getText(nameElement);
            productNames.push(name);
        }
        
        return productNames;
    }

    async getProductPrices() {
        await this.waitUntil(async () => {
            const count = await this.getElementsCount('.inventory_item_price');
            return count > 0;
        }, { 
            timeoutMsg: 'Product prices did not load' 
        });

        const priceElements = await this.getElements('.inventory_item_price');
        const productPrices = [];
        
        for (let priceElement of priceElements) {
            const priceText = await this.getText(priceElement);
            const price = parseFloat(priceText.replace('$', ''));
            productPrices.push(price);
        }
        
        return productPrices;
    }

    isNamesSortedAZ(names) {
        for (let i = 0; i < names.length - 1; i++) {
            if (names[i].toLowerCase() > names[i + 1].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    isNamesSortedZA(names) {
        for (let i = 0; i < names.length - 1; i++) {
            if (names[i].toLowerCase() < names[i + 1].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    isPricesSortedLowToHigh(prices) {
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] > prices[i + 1]) {
                return false;
            }
        }
        return true;
    }

    isPricesSortedHighToLow(prices) {
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] < prices[i + 1]) {
                return false;
            }
        }
        return true;
    }

    async getCurrentSortOption() {
        await this.waitForDisplayed(this.sortDropdown);
        return await this.sortDropdown.getValue();
    }

    async getAllSortOptions() {
        await this.waitForDisplayed(this.sortDropdown);
        const options = await this.getElements('option');
        const optionValues = [];
        
        for (let option of options) {
            const value = await option.getAttribute('value');
            const text = await option.getText();
            optionValues.push({ value, text });
        }
        
        return optionValues;
    }

    async verifySorting(option, isSortedCallback) {
        
        await this.selectSortOption(option);
        
        const currentOption = await this.getCurrentSortOption();
        if (currentOption !== option) {
            throw new Error(`Failed to select sort option. Expected: ${option}, Actual: ${currentOption}`);
        }

        let result;
        if (['az', 'za'].includes(option)) {
            const productNames = await this.getProductNames();
            result = isSortedCallback(productNames);
        } else if (['lohi', 'hilo'].includes(option)) {
            const productPrices = await this.getProductPrices();
            result = isSortedCallback(productPrices);
        } else {
            throw new Error(`Unsupported sort option: ${option}`);
        }

        return result;
    }

    async getProductsCount() {
        return await this.getElementsCount('.inventory_item');
    }

    async waitForProductsToLoad() {
        await this.waitUntil(async () => {
            const count = await this.getProductsCount();
            return count > 0;
        }, {
            timeoutMsg: 'Products did not load'
        });
    }

    async isProductsSectionVisible() {
        const inventoryContainer = $('.inventory_container');
        return await this.isDisplayed(inventoryContainer);
    }

    open() {
        return super.open('inventory.html');
    }
}

export default new SortingPage();