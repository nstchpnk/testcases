import LoginPage from './pageobjects/login.page.js';

describe('Login Page Tests', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await browser.pause(2000);
    });

    it('TC1: Successful Login with accepted username', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        expect(await browser.getUrl()).toContain()
        await browser.pause(2000);
    });

    it('TC2: Successful Login with unaccepted username', async () => {
        await LoginPage.login('wrong_name', 'secret_sauce');
        await browser.pause(2000);
        await expect($('#login-button').isExisting()).toBe(true);
        await browser.pause(2000);
        await expect($('.error')).toHaveText('Username and password do not match any user in this service.');
        await browser.pause(2000);
    });

    it('TC3: Failed Login with wrong Password', async () => {
        await LoginPage.login('standard_user', 'wrong_password');
        await browser.pause(2000);
        await expect($('#login-button').isExisting()).toBe(true);
        await browser.pause(2000);
        await expect($('.error')).toHaveText('Username and password do not match any user in this service.');
        await browser.pause(2000);
    });

    it('TC4: Failed Login without Username', async () => {
        await LoginPage.login('', 'secret_sauce');
        await browser.pause(2000);
        await expect($('#login-button').isExisting()).toBe(true);
        await browser.pause(2000);
        await expect($('.error')).toHaveText('Username is required');
        await browser.pause(2000);
    });

    it('TC5: Failed Login without Password', async () => {
        await LoginPage.login('standard_user', '');
        await browser.pause(2000);
        await expect($('#login-button').isExisting()).toBe(true);
        await browser.pause(2000);
        await expect($('.error')).toHaveText('Password is required');
        await browser.pause(2000);
    });

    it('TC6: Failed Login with special characters', async () => {
        await LoginPage.login('@#$%user', 'secret_sauce');
        await browser.pause(2000);
        await expect($('#login-button').isExisting()).toBe(true);
        await browser.pause(2000);
        await expect($('.error')).toHaveText('Username and password do not match any user in this service.');
        await browser.pause(2000);
    });

    it('TC7: Logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);        
        
        const urlAfterLogin = await browser.getUrl();
        expect(urlAfterLogin).toContain('inventory.html');
        await browser.pause(2000);
        
        await LoginPage.logout(); 
        
        const urlAfterLogout = await browser.getUrl();
        expect(urlAfterLogout).toContain('saucedemo.com');
        expect(urlAfterLogout).not.toContain('inventory.html');
        await browser.pause(2000);
        
        await expect(LoginPage.inputUsername).toHaveValue('');
        await expect(LoginPage.inputPassword).toHaveValue('');
        await browser.pause(2000);
    });
});