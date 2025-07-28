import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
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

    get menuWrap() {
        return $('.bm-menu-wrap');
    }

    get menu() {
        return $('.bm-menu');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login(username, password) {
        await this.inputUsername.waitForDisplayed({ timeout: 10000 });
        await this.inputUsername.setValue(username);
        await this.inputPassword.waitForDisplayed({ timeout: 10000 });
        await this.inputPassword.setValue(password);
        await this.btnSubmit.waitForDisplayed({ timeout: 10000 });
        await this.btnSubmit.click();
    }

    async logout() {
        await this.btnBurger.waitForDisplayed({ timeout: 10000 });
        await this.btnBurger.waitForClickable({ timeout: 10000 });
        
        await this.btnBurger.click();
        
        await browser.waitUntil(async () => {
            const menuWrap = await this.menuWrap;
            const isHidden = await menuWrap.getAttribute('hidden');
            const ariaHidden = await menuWrap.getAttribute('aria-hidden');
            return isHidden === null && ariaHidden === 'false';
        }, {
            timeout: 10000,
            timeoutMsg: 'Menu did not open within 10 seconds'
        });

        await browser.waitUntil(async () => {
            const menuWrap = await this.menuWrap;
            const transform = await menuWrap.getCSSProperty('transform');
            return !transform.value.includes('-100%');
        }, {
            timeout: 10000,
            timeoutMsg: 'Menu animation did not complete'
        });

        await browser.pause(1000);

        await this.btnLogout.waitForDisplayed({ timeout: 10000 });
        await this.btnLogout.waitForClickable({ timeout: 10000 });
        await this.btnLogout.click();
        
        await browser.pause(2000);
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open(''); 
    }
}

export default new LoginPage();