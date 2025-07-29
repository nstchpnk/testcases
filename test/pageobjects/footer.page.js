import { $ } from '@wdio/globals'
import Page from './page.js';

class FooterPage extends Page {
    /**
     * Selectors for footer social media links
     */
    get twitterLink() {
        return $('a[data-test="social-twitter"]');
    }

    get facebookLink() {
        return $('a[data-test="social-facebook"]');
    }

    get linkedInLink() {
        return $('a[data-test="social-linkedin"]');
    }

    get footer() {
        return $('.footer');
    }


    async clickTwitterLink() {
        await this.scrollToFooter();
        await this.twitterLink.waitForDisplayed({ timeout: 10000 });
        await this.twitterLink.waitForClickable({ timeout: 10000 });
        await browser.pause(500);
        await this.twitterLink.click();
        await browser.pause(1000);
    }


    async clickFacebookLink() {
        await this.scrollToFooter();
        await this.facebookLink.waitForDisplayed({ timeout: 10000 });
        await this.facebookLink.waitForClickable({ timeout: 10000 });
        await browser.pause(500);
        await this.facebookLink.click();
        await browser.pause(1000);
    }

    async clickLinkedInLink() {
        await this.scrollToFooter();
        await this.linkedInLink.waitForDisplayed({ timeout: 10000 });
        await this.linkedInLink.waitForClickable({ timeout: 10000 });
        await browser.pause(500);
        await this.linkedInLink.click();
        await browser.pause(1000);
    }


    async scrollToFooter() {
        await this.footer.waitForDisplayed({ timeout: 10000 });
        await this.footer.scrollIntoView();
        await browser.pause(500);
    }


    async verifyTwitterTabOpened() {
        await browser.waitUntil(async () => {
            const handles = await browser.getWindowHandles();
            return handles.length >= 2;
        }, { timeout: 10000, timeoutMsg: 'New tab did not open' });

        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);
        await browser.pause(2000);

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('twitter.com') || url.includes('x.com');
        }, { timeout: 15000, timeoutMsg: 'Twitter page did not load' });

        const currentUrl = await browser.getUrl();
        return currentUrl.includes('twitter.com') || currentUrl.includes('x.com');
    }


    async verifyFacebookTabOpened() {
        await browser.waitUntil(async () => {
            const handles = await browser.getWindowHandles();
            return handles.length >= 2;
        }, { timeout: 10000, timeoutMsg: 'New tab did not open' });

        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);
        await browser.pause(2000);

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('facebook.com');
        }, { timeout: 15000, timeoutMsg: 'Facebook page did not load' });

        const currentUrl = await browser.getUrl();
        return currentUrl.includes('facebook.com');
    }


    async verifyLinkedInTabOpened() {
        await browser.waitUntil(async () => {
            const handles = await browser.getWindowHandles();
            return handles.length >= 2;
        }, { timeout: 10000, timeoutMsg: 'New tab did not open' });

        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);
        await browser.pause(2000);

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('linkedin.com');
        }, { timeout: 15000, timeoutMsg: 'LinkedIn page did not load' });

        const currentUrl = await browser.getUrl();
        return currentUrl.includes('linkedin.com');
    }


    async switchToMainTab() {
        const handles = await browser.getWindowHandles();
        
        if (handles.length > 1) {
            await browser.closeWindow();
            await browser.pause(500);
        }
        
        const remainingHandles = await browser.getWindowHandles();
        await browser.switchToWindow(remainingHandles[0]);
        await browser.pause(1000);
    }


    async getWindowHandles() {
        return await browser.getWindowHandles();
    }


    async isFooterDisplayed() {
        await this.footer.waitForDisplayed({ timeout: 10000 });
        return await this.footer.isDisplayed();
    }


    async getAllSocialLinks() {
        await this.scrollToFooter();
        
        return {
            twitter: this.twitterLink,
            facebook: this.facebookLink,
            linkedin: this.linkedInLink
        };
    }

    open() {
        return super.open('inventory.html');
    }
}

export default new FooterPage();