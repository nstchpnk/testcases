import loginPage from './pageobjects/login.page.js';
import footerPage from './pageobjects/footer.page.js';

describe('Footer Links Tests', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
    });

    const socialPlatforms = [
        { name: 'Twitter', testId: 'TC10.1', platform: 'twitter' },
        { name: 'Facebook', testId: 'TC10.2', platform: 'facebook' },
        { name: 'LinkedIn', testId: 'TC10.3', platform: 'linkedin' }
    ];

    socialPlatforms.forEach(({ name, testId, platform }) => {
        it(`${testId}: Verify ${name} link opens in new tab`, async () => {
            const isTabOpened = await footerPage.testSocialLink(platform);
            expect(isTabOpened).toBe(true);
        });
    });

    // Alternative approach with individual tests (if parametrized tests are not preferred)
    /*
    it('TC10.1: Verify Twitter link opens in new tab', async () => {
        const isTabOpened = await footerPage.testSocialLink('twitter');
        expect(isTabOpened).toBe(true);
    });

    it('TC10.2: Verify Facebook link opens in new tab', async () => {
        const isTabOpened = await footerPage.testSocialLink('facebook');
        expect(isTabOpened).toBe(true);
    });

    it('TC10.3: Verify LinkedIn link opens in new tab', async () => {
        const isTabOpened = await footerPage.testSocialLink('linkedin');
        expect(isTabOpened).toBe(true);
    });
    */
});