const Driver = require('../utils/driver');
const LoginPage = require('../pages/LoginPage');
const config = require('../utils/config');

describe('Login Tests', () => {
    let driver;
    let loginPage;

    beforeAll(async () => {
        driver = new Driver();
        await driver.init();
        loginPage = new LoginPage(driver);
    });

    beforeEach(async () => {
        await loginPage.navigate();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('successful login with admin credentials', async () => {
        await loginPage.login(
            config.credentials.admin.username,
            config.credentials.admin.password
        );
        
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/dashboard');
    });

    test('successful login with user credentials', async () => {
        await loginPage.login(
            config.credentials.user.username,
            config.credentials.user.password
        );
        
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/dashboard');
    });

    test('failed login with invalid credentials', async () => {
        await loginPage.login('invalid', 'invalid');
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid credentials');
        expect(await loginPage.isAtLoginPage()).toBe(true);
    });

    test('empty credentials validation', async () => {
        await loginPage.login('', '');
        
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username and password are required');
        expect(await loginPage.isAtLoginPage()).toBe(true);
    });
});