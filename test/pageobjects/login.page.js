import Page from './page.js';

class LoginPage extends Page {

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

    get errorMessageContainer() {
        return $('.error-message-container.error');
    }

    get inventoryContainer() {
        return $('.inventory_container');
    }

    async login(username, password) {
        await this.waitForAndInteract(this.inputUsername, (el) => el.setValue(username));
        await this.waitForAndInteract(this.inputPassword, (el) => el.setValue(password));
        await this.waitForAndInteract(this.btnSubmit, (el) => el.click());
    }

    async waitForInventoryPage() {
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('inventory.html');
        }, {
            timeoutMsg: 'Did not navigate to inventory page after login'
        });
        
        await this.waitForDisplayed(this.inventoryContainer);
    }

    async verifyFailedLogin() {
        await this.waitForDisplayed(this.errorMessageContainer);
        const isOnLoginPage = await this.isOnLoginPage();
        expect(isOnLoginPage).toBe(true);
        return await this.getText(this.errorMessageContainer);
    }

    async logout() {
        await this.waitForAndInteract(this.btnBurger, (el) => el.click());
        await this.waitForAndInteract(this.btnLogout, (el) => el.click());
    }

    async waitForLoginPage() {
        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return !url.includes('inventory.html');
        }, {
            timeoutMsg: 'Did not navigate to login page after logout'
        });
        
        await this.waitForDisplayed(this.inputUsername);
    }

    async isOnLoginPage() {
        const url = await this.getCurrentUrl();
        return !url.includes('inventory.html') && await this.isDisplayed(this.inputUsername);
    }

    async clearCredentials() {
        await this.inputUsername.clearValue();
        await this.inputPassword.clearValue();
    }

    open() {
        return super.open('');
    }
}

export default new LoginPage();