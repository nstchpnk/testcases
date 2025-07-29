import LoginPage from './pageobjects/login.page.js';
import SortingPage from './pageobjects/sorting.page.js';

describe('Sorting Tests', () => {
    before(async () => {
        await LoginPage.open();
        await browser.pause(2000);
        
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not navigate to inventory page' });
        
        await browser.pause(1000);
    });

    it('TC9.1: Verify Name sorting (A to Z)', async () => {
        await SortingPage.selectSortOption('az');
        await browser.pause(2000);
        
        const productNames = await SortingPage.getProductNames();
        expect(SortingPage.isNamesSortedAZ(productNames)).toBe(true);
        await browser.pause(2000);
    });

    it('TC9.2: Verify Name sorting (Z to A)', async () => {
        await SortingPage.selectSortOption('za');
        await browser.pause(2000);
        
        const productNames = await SortingPage.getProductNames();
        expect(SortingPage.isNamesSortedZA(productNames)).toBe(true);
        await browser.pause(2000);
    });

    it('TC9.3: Verify Price sorting (low to high)', async () => {
        await SortingPage.selectSortOption('lohi');
        await browser.pause(2000);
        
        const productPrices = await SortingPage.getProductPrices();
        expect(SortingPage.isPricesSortedLowToHigh(productPrices)).toBe(true);
        await browser.pause(2000);
    });

    it('TC9.4: Verify Price sorting (high to low)', async () => {
        await SortingPage.selectSortOption('hilo');
        await browser.pause(2000);
        
        const productPrices = await SortingPage.getProductPrices();
        expect(SortingPage.isPricesSortedHighToLow(productPrices)).toBe(true);
        await browser.pause(3000);
    });
});