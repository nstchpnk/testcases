import loginPage from './pageobjects/login.page.js';

describe('Login Page Tests', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.waitForDisplayed(loginPage.inputUsername);
        await loginPage.clearCredentials(); 
        await browser.execute(() => localStorage.clear()); 
    });

    it('TC1: Successful Login with accepted username', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
        
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toContain('inventory.html');
    });

    const invalidLoginTests = [
        { testId: 'TC2', username: 'wrong_name', password: 'secret_sauce', expectedError: 'Epic sadface: Username and password do not match any user in this service' },
        { testId: 'TC3', username: 'standard_user', password: 'wrong_password', expectedError: 'Epic sadface: Username and password do not match any user in this service' },
        { testId: 'TC4', username: '', password: 'secret_sauce', expectedError: 'Epic sadface: Username is required' },
        { testId: 'TC5', username: 'standard_user', password: '', expectedError: 'Epic sadface: Password is required' },
        { testId: 'TC6', username: '@#$%user', password: 'secret_sauce', expectedError: 'Epic sadface: Username and password do not match any user in this service' }
    ];

    invalidLoginTests.forEach(({ testId, username, password, expectedError }) => {
        it(`${testId}: Failed login with ${username || 'empty username'} and ${password || 'empty password'}`, async () => {
            await loginPage.login(username, password);
            const errorText = await loginPage.verifyFailedLogin();
            expect(errorText).toBe(expectedError);
        });
    });

    it('TC7: Logout', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.waitForInventoryPage();
        
        const urlAfterLogin = await loginPage.getCurrentUrl();
        expect(urlAfterLogin).toContain('inventory.html');
        
        await loginPage.logout(); 
        await loginPage.waitForLoginPage();
        
        const urlAfterLogout = await loginPage.getCurrentUrl();
        expect(urlAfterLogout).not.toContain('inventory.html');
        
        await loginPage.waitForDisplayed(loginPage.inputUsername);
        expect(await loginPage.inputUsername).toHaveValue('');
        expect(await loginPage.inputPassword).toHaveValue('');
    });
});