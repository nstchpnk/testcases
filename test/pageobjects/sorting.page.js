import { $ } from '@wdio/globals'
import Page from './page.js';

class SortingPage extends Page {

    get sortDropdown() {
        return $('.product_sort_container');
    }

    get productNames() {
        return $$('.inventory_item_name');
    }

    get productPrices() {
        return $$('.inventory_item_price');
    }

    get inventoryItems() {
        return $$('.inventory_item');
    }

    async selectSortOption(option) {
        await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
        await this.sortDropdown.waitForClickable({ timeout: 10000 });
        await browser.pause(500);
        await this.sortDropdown.selectByAttribute('value', option);
        await browser.pause(1000);
        
        await browser.waitUntil(async () => {
            const items = await this.inventoryItems;
            return items.length > 0;
        }, { timeout: 10000, timeoutMsg: 'Products did not load after sorting' });
    }


    async getProductNames() {
        await browser.waitUntil(async () => {
            const names = await this.productNames;
            return names.length > 0;
        }, { timeout: 10000, timeoutMsg: 'Product names did not load' });

        const names = await this.productNames;
        const productNames = [];
        
        for (let nameElement of names) {
            const name = await nameElement.getText();
            productNames.push(name);
        }
        
        return productNames;
    }

    async getProductPrices() {
        await browser.waitUntil(async () => {
            const prices = await this.productPrices;
            return prices.length > 0;
        }, { timeout: 10000, timeoutMsg: 'Product prices did not load' });

        const prices = await this.productPrices;
        const productPrices = [];
        
        for (let priceElement of prices) {
            const priceText = await priceElement.getText();
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
        await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
        return await this.sortDropdown.getValue();
    }


    async getAllSortOptions() {
        await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
        const options = await this.sortDropdown.$$('option');
        const optionValues = [];
        
        for (let option of options) {
            const value = await option.getAttribute('value');
            optionValues.push(value);
        }
        
        return optionValues;
    }


    open() {
        return super.open('inventory.html');
    }
}

export default new SortingPage();