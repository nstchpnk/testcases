import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * Simplified LoginPage with reliable methods
 */
class LoginPage extends Page {
    /**
     * Selectors
     */
    get inputUsername() {
        return $('#user-name');
    }

    get inputPassword() {
        return $('#password');
    }

    get btnSubmit() {
        return $('#login-button');
    }

    get btnBurger() {
        return $('#react-burger-menu-btn'); 
    }

    get btnLogout() {
        return $('#logout_sidebar_link'); 
    }

    /**
     * Simple and reliable login method
     */
    async login(username, password) {        

        await this.inputUsername.waitForDisplayed({ timeout: 10000 });
        await this.inputUsername.clearValue();
        await this.inputUsername.setValue(username);
        
        await this.inputPassword.waitForDisplayed({ timeout: 10000 });
        await this.inputPassword.clearValue();
        await this.inputPassword.setValue(password);
        
        await this.btnSubmit.waitForDisplayed({ timeout: 10000 });
        await this.btnSubmit.waitForClickable({ timeout: 10000 });
        await this.btnSubmit.click();
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory') || !url.includes('login');
        }, { 
            timeout: 15000, 
            timeoutMsg: 'Login did not complete successfully' 
        });
        
    }

    async logout() {
        
        await this.btnBurger.waitForDisplayed({ timeout: 10000 });
        await this.btnBurger.waitForClickable({ timeout: 10000 });
        await this.btnBurger.click();
        
        await this.btnLogout.waitForDisplayed({ timeout: 10000 });
        await this.btnLogout.waitForClickable({ timeout: 10000 });
        
        await this.btnLogout.click();
        
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('login') || !url.includes('inventory');
        }, { 
            timeout: 10000, 
            timeoutMsg: 'Logout did not complete successfully' 
        });
        
    }

    open() {
        return super.open(''); 
    }
}

export default new LoginPage();