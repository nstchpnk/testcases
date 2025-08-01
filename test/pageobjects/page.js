/**
 * Main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
    
    open(path) {
        return browser.url(`https://www.saucedemo.com/${path}`);
    }

    async waitForDisplayed(element) {
        await element.waitForDisplayed({
            timeoutMsg: 'Element not displayed' 
        });
    }

    async waitForClickable(element) {
        await element.waitForClickable({ 
            timeoutMsg: 'Element not clickable' 
        });
    }

    async waitForAndInteract(element, action) {
        await this.waitForDisplayed(element);
        await this.waitForClickable(element);
        await action(element);
    }
    
    async click(element) {
        await this.waitForClickable(element);
        await element.click();
    }

    async waitUntil(condition, options = {}) {
        const defaultOptions = {
            timeoutMsg: 'Condition not met'
        };
        await browser.waitUntil(condition, { ...defaultOptions, ...options });
    }

    async getCurrentUrl() {
        return await browser.getUrl();
    }

    async getWindowHandles() {
        return await browser.getWindowHandles();
    }

    async switchToWindow(handle) {
        await browser.switchToWindow(handle);
    }

    async closeWindow() {
        await browser.closeWindow();
    }

    async setValue(element, value) {
        await this.waitForDisplayed(element);
        await element.clearValue();
        await element.setValue(value);
    }

    async getText(element) {
        await this.waitForDisplayed(element);
        return await element.getText();
    }

    async isDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async isExisting(element) {
        try {
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    async scrollIntoView(element) {
        await element.scrollIntoView();
    }

    async getElements(selector) {
        return await $$(selector);
    }

    async getElementsCount(selector) {
        const elements = await this.getElements(selector);
        return elements.length;
    }

    async hasElements(selector) {
        const count = await this.getElementsCount(selector);
        return count > 0;
    }
}