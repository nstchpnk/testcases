import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * Page Object for sorting functionality
 */
class SortingPage extends Page {
    /**
     * Selectors
     */
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

    /**
     * Select sorting option from dropdown
     * @param {string} option - Sorting option: 'az', 'za', 'lohi', 'hilo'
     */
    async selectSortOption(option) {
        await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
        await this.sortDropdown.waitForClickable({ timeout: 10000 });
        await browser.pause(500);
        await this.sortDropdown.selectByAttribute('value', option);
        await browser.pause(1000);
        
        // Wait for products to be sorted
        await browser.waitUntil(async () => {
            const items = await this.inventoryItems;
            return items.length > 0;
        }, { timeout: 10000, timeoutMsg: 'Products did not load after sorting' });
    }

    /**
     * Get all product names from the page
     * @returns {Promise<string[]>} Array of product names
     */
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

    /**
     * Get all product prices from the page
     * @returns {Promise<number[]>} Array of product prices as numbers
     */
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

    /**
     * Check if names are sorted A to Z
     * @param {string[]} names - Array of product names
     * @returns {boolean} True if sorted correctly
     */
    isNamesSortedAZ(names) {
        for (let i = 0; i < names.length - 1; i++) {
            if (names[i].toLowerCase() > names[i + 1].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if names are sorted Z to A
     * @param {string[]} names - Array of product names
     * @returns {boolean} True if sorted correctly
     */
    isNamesSortedZA(names) {
        for (let i = 0; i < names.length - 1; i++) {
            if (names[i].toLowerCase() < names[i + 1].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if prices are sorted low to high
     * @param {number[]} prices - Array of product prices
     * @returns {boolean} True if sorted correctly
     */
    isPricesSortedLowToHigh(prices) {
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] > prices[i + 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if prices are sorted high to low
     * @param {number[]} prices - Array of product prices
     * @returns {boolean} True if sorted correctly
     */
    isPricesSortedHighToLow(prices) {
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] < prices[i + 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get current selected sorting option
     * @returns {Promise<string>} Currently selected sorting option
     */
    async getCurrentSortOption() {
        await this.sortDropdown.waitForDisplayed({ timeout: 10000 });
        return await this.sortDropdown.getValue();
    }

    /**
     * Get all available sorting options
     * @returns {Promise<string[]>} Array of all available sorting options
     */
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

    /**
     * Open inventory page
     */
    open() {
        return super.open('inventory.html');
    }
}

export default new SortingPage();