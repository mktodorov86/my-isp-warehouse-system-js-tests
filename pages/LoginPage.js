const { By } = require('selenium-webdriver');
const config = require('../utils/config');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.usernameInput = By.id('username');
        this.passwordInput = By.id('password');
        this.loginButton = By.css('button[type="submit"]');
        this.errorMessage = By.className('error-message');
    }

    async navigate() {
        await this.driver.get(`${config.baseUrl}/login`);
    }

    async login(username, password) {
        await this.driver.sendKeys(this.usernameInput, username);
        await this.driver.sendKeys(this.passwordInput, password);
        await this.driver.click(this.loginButton);
    }

    async getErrorMessage() {
        return await this.driver.getText(this.errorMessage);
    }

    async isAtLoginPage() {
        const currentUrl = await this.driver.getCurrentUrl();
        return currentUrl.includes('/login');
    }
}

module.exports = LoginPage;