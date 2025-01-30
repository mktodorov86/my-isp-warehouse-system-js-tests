const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');

class Driver {
    constructor() {
        this.driver = null;
    }

    async init() {
        if (!this.driver) {
            const options = new chrome.Options();
            // Add options for headless mode if needed
            // options.addArguments('--headless');
            
            this.driver = await new Builder()
                .forBrowser(config.browser)
                .setChromeOptions(options)
                .build();

            await this.driver.manage().setTimeouts({
                implicit: config.implicitTimeout,
                pageLoad: config.explicitTimeout
            });
        }
        return this.driver;
    }

    async quit() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }

    // Helper methods
    async findElement(locator) {
        return await this.driver.findElement(locator);
    }

    async findElements(locator) {
        return await this.driver.findElements(locator);
    }

    async waitForElement(locator, timeout = config.explicitTimeout) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    async waitForElementVisible(locator, timeout = config.explicitTimeout) {
        const element = await this.waitForElement(locator, timeout);
        return await this.driver.wait(until.elementIsVisible(element), timeout);
    }

    async getText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }

    async click(locator) {
        const element = await this.waitForElementVisible(locator);
        await element.click();
    }

    async sendKeys(locator, text) {
        const element = await this.waitForElementVisible(locator);
        await element.sendKeys(text);
    }

    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    async get(url) {
        await this.driver.get(url);
    }

    async executeScript(script, ...args) {
        return await this.driver.executeScript(script, ...args);
    }
}

module.exports = Driver;