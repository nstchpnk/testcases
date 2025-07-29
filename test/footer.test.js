import LoginPage from './pageobjects/login.page.js';
import FooterPage from './pageobjects/footer.page.js';

describe('Footer Links Tests', () => {
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

    it('TC10.1: Verify Twitter link opens in new tab', async () => {
        await FooterPage.clickTwitterLink();
        await browser.pause(2000);
        
        const isTwitterTabOpened = await FooterPage.verifyTwitterTabOpened();
        expect(isTwitterTabOpened).toBe(true);
        await browser.pause(2000);
        
        await FooterPage.switchToMainTab();
        await browser.pause(1000);
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not return to inventory page' });
        await browser.pause(1000);
    });

    it('TC10.2: Verify Facebook link opens in new tab', async () => {
        await FooterPage.clickFacebookLink();
        await browser.pause(2000);
        
        const isFacebookTabOpened = await FooterPage.verifyFacebookTabOpened();
        expect(isFacebookTabOpened).toBe(true);
        await browser.pause(2000);
        
        await FooterPage.switchToMainTab();
        await browser.pause(1000);
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not return to inventory page' });
        await browser.pause(1000);
    });

    it('TC10.3: Verify LinkedIn link opens in new tab', async () => {
        await FooterPage.clickLinkedInLink();
        await browser.pause(2000);
        
        const isLinkedInTabOpened = await FooterPage.verifyLinkedInTabOpened();
        expect(isLinkedInTabOpened).toBe(true);
        await browser.pause(2000);
        
        await FooterPage.switchToMainTab();
        await browser.pause(1000);
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 10000, timeoutMsg: 'Did not return to inventory page' });
        await browser.pause(3000);
    });
});