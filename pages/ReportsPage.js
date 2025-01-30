const { By } = require('selenium-webdriver');
const config = require('../utils/config');

class ReportsPage {
    constructor(driver) {
        this.driver = driver;
        
        // Локатори
        this.reportTypeSelect = By.id('report-type');
        this.startDateInput = By.id('start-date');
        this.endDateInput = By.id('end-date');
        this.generateReportButton = By.id('generate-report');
        this.exportPdfButton = By.id('export-pdf');
        this.exportExcelButton = By.id('export-excel');
        this.reportTable = By.css('.report-table');
        this.reportRows = By.css('.report-row');
        this.totalAmount = By.id('total-amount');
        this.filterInput = By.id('filter-report');
        this.errorMessage = By.css('.error-message');
        
        // Локатори за различни видове справки
        this.inventoryReportOption = By.css('option[value="inventory"]');
        this.salesReportOption = By.css('option[value="sales"]');
        this.suppliersReportOption = By.css('option[value="suppliers"]');
    }

    async navigate() {
        await this.driver.get(`${config.baseUrl}/reports`);
    }

    async selectReportType(reportType) {
        await this.driver.click(this.reportTypeSelect);
        switch(reportType.toLowerCase()) {
            case 'inventory':
                await this.driver.click(this.inventoryReportOption);
                break;
            case 'sales':
                await this.driver.click(this.salesReportOption);
                break;
            case 'suppliers':
                await this.driver.click(this.suppliersReportOption);
                break;
            default:
                throw new Error(`Unknown report type: ${reportType}`);
        }
    }

    async setDateRange(startDate, endDate) {
        await this.driver.sendKeys(this.startDateInput, startDate);
        await this.driver.sendKeys(this.endDateInput, endDate);
    }

    async generateReport() {
        await this.driver.click(this.generateReportButton);
        await this.driver.waitForElement(this.reportTable);
    }

    async exportToPdf() {
        await this.driver.click(this.exportPdfButton);
        // Note: Actual file download verification might need system-level testing
    }

    async exportToExcel() {
        await this.driver.click(this.exportExcelButton);
        // Note: Actual file download verification might need system-level testing
    }

    async getReportRowsCount() {
        const rows = await this.driver.findElements(this.reportRows);
        return rows.length;
    }

    async getTotalAmount() {
        const totalText = await this.driver.getText(this.totalAmount);
        return parseFloat(totalText.replace(/[^0-9.-]+/g, ''));
    }

    async filterReport(filterText) {
        await this.driver.sendKeys(this.filterInput, filterText);
        // Даваме малко време на филтрирането да се изпълни
        await this.driver.sleep(500);
    }

    async getReportData() {
        const rows = await this.driver.findElements(this.reportRows);
        const data = [];
        
        for (const row of rows) {
            const cells = await row.findElements(By.css('td'));
            const rowData = {};
            
            for (const cell of cells) {
                const header = await cell.getAttribute('data-header');
                const value = await cell.getText();
                rowData[header] = value;
            }
            
            data.push(rowData);
        }
        
        return data;
    }

    async getErrorMessage() {
        return await this.driver.getText(this.errorMessage);
    }

    async isReportEmpty() {
        const rows = await this.getReportRowsCount();
        return rows === 0;
    }

    async downloadReport(format) {
        if (format.toLowerCase() === 'pdf') {
            await this.exportToPdf();
        } else if (format.toLowerCase() === 'excel') {
            await this.exportToExcel();
        } else {
            throw new Error(`Unsupported format: ${format}`);
        }
    }
}

module.exports = ReportsPage;