import Page from './page.js';

class FooterPage extends Page {

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

    async scrollToFooter() {
        await this.waitForDisplayed(this.footer);
        await this.footer.scrollIntoView();
    }

    async clickSocialLink(linkType) {
        await this.scrollToFooter();
        
        let linkElement;
        switch(linkType.toLowerCase()) {
            case 'twitter':
                linkElement = this.twitterLink;
                break;
            case 'facebook':
                linkElement = this.facebookLink;
                break;
            case 'linkedin':
                linkElement = this.linkedInLink;
                break;
            default:
                throw new Error(`Unsupported link type: ${linkType}`);
        }
        
        await this.waitForAndInteract(linkElement, (el) => el.click());
    }

    async verifySocialTabOpened(platform) {
        await this.waitUntil(async () => {
            const handles = await this.getWindowHandles();
            return handles.length >= 2;
        }, { 
            timeoutMsg: 'New tab did not open' 
        });

        const handles = await this.getWindowHandles();
        await this.switchToWindow(handles[handles.length - 1]);

        const expectedUrls = {
            twitter: ['twitter.com', 'x.com'],
            facebook: ['facebook.com'],
            linkedin: ['linkedin.com']
        };

        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return expectedUrls[platform.toLowerCase()].some(domain => url.includes(domain));
        }, { 
            timeout: 15000, 
            timeoutMsg: `${platform} page did not load` 
        });

        const currentUrl = await this.getCurrentUrl();
        return expectedUrls[platform.toLowerCase()].some(domain => currentUrl.includes(domain));
    }

    async switchToMainTab() {
        const handles = await this.getWindowHandles();
        
        if (handles.length > 1) {
            await this.closeWindow();
        }
        
        const remainingHandles = await this.getWindowHandles();
        await this.switchToWindow(remainingHandles[0]);

        await this.waitUntil(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('inventory.html');
        }, { 
            timeoutMsg: 'Did not return to inventory page' 
        });
    }

    async testSocialLink(platform) {
        await this.clickSocialLink(platform);
        const isTabOpened = await this.verifySocialTabOpened(platform);
        await this.switchToMainTab();
        return isTabOpened;
    }

    async isFooterDisplayed() {
        await this.waitForDisplayed(this.footer);
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