const { By } = require('selenium-webdriver');
const config = require('../utils/config');

class SuppliersPage {
    constructor(driver) {
        this.driver = driver;
        
        // Локатори
        this.addSupplierButton = By.id('add-supplier-btn');
        this.supplierNameInput = By.id('supplier-name');
        this.supplierEmailInput = By.id('supplier-email');
        this.supplierPhoneInput = By.id('supplier-phone');
        this.supplierAddressInput = By.id('supplier-address');
        this.saveSupplierButton = By.id('save-supplier');
        this.searchInput = By.id('search-suppliers');
        this.suppliersList = By.css('.suppliers-list');
        this.supplierRows = By.css('.supplier-row');
        this.deleteSupplierButton = By.css('.delete-supplier');
        this.editSupplierButton = By.css('.edit-supplier');
        this.confirmDeleteButton = By.id('confirm-delete');
        this.errorMessage = By.css('.error-message');
    }

    async navigate() {
        await this.driver.get(`${config.baseUrl}/suppliers`);
    }

    async addNewSupplier(name, email, phone, address) {
        await this.driver.click(this.addSupplierButton);
        await this.driver.sendKeys(this.supplierNameInput, name);
        await this.driver.sendKeys(this.supplierEmailInput, email);
        await this.driver.sendKeys(this.supplierPhoneInput, phone);
        await this.driver.sendKeys(this.supplierAddressInput, address);
        await this.driver.click(this.saveSupplierButton);
    }

    async searchSupplier(searchText) {
        await this.driver.sendKeys(this.searchInput, searchText);
        await this.driver.waitForElement(this.suppliersList);
    }

    async getSuppliersCount() {
        const suppliers = await this.driver.findElements(this.supplierRows);
        return suppliers.length;
    }

    async getSupplierByName(name) {
        const suppliers = await this.driver.findElements(this.supplierRows);
        for (const supplier of suppliers) {
            const supplierName = await supplier.findElement(By.css('.supplier-name')).getText();
            if (supplierName === name) {
                return supplier;
            }
        }
        return null;
    }

    async deleteSupplier(name) {
        const supplier = await this.getSupplierByName(name);
        if (supplier) {
            const deleteBtn = await supplier.findElement(this.deleteSupplierButton);
            await this.driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
            await deleteBtn.click();
            await this.driver.click(this.confirmDeleteButton);
        }
    }

    async editSupplier(oldName, newName, newEmail, newPhone, newAddress) {
        const supplier = await this.getSupplierByName(oldName);
        if (supplier) {
            const editBtn = await supplier.findElement(this.editSupplierButton);
            await editBtn.click();
            
            // Изчистване и въвеждане на новите стойности
            const nameInput = await this.driver.findElement(this.supplierNameInput);
            await nameInput.clear();
            await nameInput.sendKeys(newName);
            
            const emailInput = await this.driver.findElement(this.supplierEmailInput);
            await emailInput.clear();
            await emailInput.sendKeys(newEmail);
            
            const phoneInput = await this.driver.findElement(this.supplierPhoneInput);
            await phoneInput.clear();
            await phoneInput.sendKeys(newPhone);
            
            const addressInput = await this.driver.findElement(this.supplierAddressInput);
            await addressInput.clear();
            await addressInput.sendKeys(newAddress);
            
            await this.driver.click(this.saveSupplierButton);
        }
    }

    async getSupplierDetails(name) {
        const supplier = await this.getSupplierByName(name);
        if (supplier) {
            const name = await supplier.findElement(By.css('.supplier-name')).getText();
            const email = await supplier.findElement(By.css('.supplier-email')).getText();
            const phone = await supplier.findElement(By.css('.supplier-phone')).getText();
            const address = await supplier.findElement(By.css('.supplier-address')).getText();
            
            return { name, email, phone, address };
        }
        return null;
    }

    async getErrorMessage() {
        return await this.driver.getText(this.errorMessage);
    }
}

module.exports = SuppliersPage;