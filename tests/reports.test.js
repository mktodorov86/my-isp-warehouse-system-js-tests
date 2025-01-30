const Driver = require('../utils/driver');
const LoginPage = require('../pages/LoginPage');
const ReportsPage = require('../pages/ReportsPage');
const config = require('../utils/config');

describe('Reports Management Tests', () => {
    let driver;
    let loginPage;
    let reportsPage;

    beforeAll(async () => {
        driver = new Driver();
        await driver.init();
        loginPage = new LoginPage(driver);
        reportsPage = new ReportsPage(driver);

        // Логин преди тестовете
        await loginPage.navigate();
        await loginPage.login(
            config.credentials.admin.username,
            config.credentials.admin.password
        );
    });

    beforeEach(async () => {
        await reportsPage.navigate();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('generate inventory report', async () => {
        await reportsPage.selectReportType('inventory');
        const today = new Date().toISOString().split('T')[0];
        await reportsPage.setDateRange(today, today);
        
        await reportsPage.generateReport();
        
        const rowCount = await reportsPage.getReportRowsCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('generate sales report with date range', async () => {
        await reportsPage.selectReportType('sales');
        
        // Задаване на дата от преди месец до днес
        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
        
        await reportsPage.setDateRange(
            lastMonth.toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );
        
        await reportsPage.generateReport();
        
        const totalAmount = await reportsPage.getTotalAmount();
        expect(totalAmount).toBeGreaterThanOrEqual(0);
    });

    test('generate suppliers report and filter results', async () => {
        await reportsPage.selectReportType('suppliers');
        await reportsPage.generateReport();
        
        const initialRowCount = await reportsPage.getReportRowsCount();
        
        // Филтриране на резултатите
        await reportsPage.filterReport('Test');
        
        const filteredRowCount = await reportsPage.getReportRowsCount();
        expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
    });

    test('export report to PDF', async () => {
        await reportsPage.selectReportType('inventory');
        await reportsPage.generateReport();
        
        // Тест за експорт в PDF
        await reportsPage.downloadReport('pdf');
        // Note: Actual file download verification would need additional system-level checks
    });

    test('export report to Excel', async () => {
        await reportsPage.selectReportType('inventory');
        await reportsPage.generateReport();
        
        // Тест за експорт в Excel
        await reportsPage.downloadReport('excel');
        // Note: Actual file download verification would need additional system-level checks
    });

    test('validate report with invalid date range', async () => {
        await reportsPage.selectReportType('sales');
        
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);
        
        await reportsPage.setDateRange(
            futureDate.toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );
        
        await reportsPage.generateReport();
        
        const errorMessage = await reportsPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid date range');
    });

    test('verify empty report results', async () => {
        await reportsPage.selectReportType('sales');
        
        // Задаване на дата от много отдавна
        const oldDate = '2000-01-01';
        await reportsPage.setDateRange(oldDate, oldDate);
        
        await reportsPage.generateReport();
        
        const isEmpty = await reportsPage.isReportEmpty();
        expect(isEmpty).toBe(true);
    });

    test('verify report data structure', async () => {
        await reportsPage.selectReportType('inventory');
        await reportsPage.generateReport();
        
        const reportData = await reportsPage.getReportData();
        
        // Проверка на структурата на данните
        expect(reportData.length).toBeGreaterThan(0);
        expect(reportData[0]).toHaveProperty('name');
        expect(reportData[0]).toHaveProperty('quantity');
        expect(reportData[0]).toHaveProperty('price');
    });
});