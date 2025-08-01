import loginPage from './pageobjects/login.page.js';
import sortingPage from './pageobjects/sorting.page.js';

describe('Sorting Tests', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
    });

    it('TC9: Verify all sorting options', async () => {
        const testCases = [
            { option: 'az', callback: sortingPage.isNamesSortedAZ, message: 'A to Z sorting failed' },
            { option: 'za', callback: sortingPage.isNamesSortedZA, message: 'Z to A sorting failed' },
            { option: 'lohi', callback: sortingPage.isPricesSortedLowToHigh, message: 'Low to high sorting failed' },
            { option: 'hilo', callback: sortingPage.isPricesSortedHighToLow, message: 'High to low sorting failed' }
        ];

        for (const testCase of testCases) {
            const isSorted = await sortingPage.verifySorting(testCase.option, testCase.callback);
            expect(isSorted).toBe(true, testCase.message);
        }
    });
});