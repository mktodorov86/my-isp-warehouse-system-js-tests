const { By } = require('selenium-webdriver');
const config = require('../utils/config');

class InventoryPage {
    constructor(driver) {
        this.driver = driver;
        
        // Локатори за елементите на страницата
        this.addItemButton = By.id('add-item-btn');
        this.itemNameInput = By.id('item-name');
        this.itemQuantityInput = By.id('item-quantity');
        this.itemPriceInput = By.id('item-price');
        this.saveItemButton = By.id('save-item');
        this.searchInput = By.id('search-items');
        this.itemsList = By.css('.items-list');
        this.itemRows = By.css('.item-row');
        this.deleteItemButton = By.css('.delete-item');
        this.editItemButton = By.css('.edit-item');
        this.confirmDeleteButton = By.id('confirm-delete');
    }

    async navigate() {
        await this.driver.get(`${config.baseUrl}/inventory`);
    }

    async addNewItem(name, quantity, price) {
        await this.driver.click(this.addItemButton);
        await this.driver.sendKeys(this.itemNameInput, name);
        await this.driver.sendKeys(this.itemQuantityInput, quantity.toString());
        await this.driver.sendKeys(this.itemPriceInput, price.toString());
        await this.driver.click(this.saveItemButton);
    }

    async searchItem(searchText) {
        await this.driver.sendKeys(this.searchInput, searchText);
        // Изчакване за резултати от търсенето
        await this.driver.waitForElement(this.itemsList);
    }

    async getItemsCount() {
        const items = await this.driver.findElements(this.itemRows);
        return items.length;
    }

    async getItemByName(name) {
        const items = await this.driver.findElements(this.itemRows);
        for (const item of items) {
            const itemName = await item.findElement(By.css('.item-name')).getText();
            if (itemName === name) {
                return item;
            }
        }
        return null;
    }

    async deleteItem(name) {
        const item = await this.getItemByName(name);
        if (item) {
            const deleteBtn = await item.findElement(this.deleteItemButton);
            await this.driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
            await deleteBtn.click();
            await this.driver.click(this.confirmDeleteButton);
        }
    }

    async editItem(oldName, newName, newQuantity, newPrice) {
        const item = await this.getItemByName(oldName);
        if (item) {
            const editBtn = await item.findElement(this.editItemButton);
            await editBtn.click();
            
            // Изчистване и въвеждане на новите стойности
            const nameInput = await this.driver.findElement(this.itemNameInput);
            await nameInput.clear();
            await nameInput.sendKeys(newName);
            
            const quantityInput = await this.driver.findElement(this.itemQuantityInput);
            await quantityInput.clear();
            await quantityInput.sendKeys(newQuantity.toString());
            
            const priceInput = await this.driver.findElement(this.itemPriceInput);
            await priceInput.clear();
            await priceInput.sendKeys(newPrice.toString());
            
            await this.driver.click(this.saveItemButton);
        }
    }

    async getItemDetails(name) {
        const item = await this.getItemByName(name);
        if (item) {
            const itemName = await item.findElement(By.css('.item-name')).getText();
            const itemQuantity = await item.findElement(By.css('.item-quantity')).getText();
            const itemPrice = await item.findElement(By.css('.item-price')).getText();
            
            return {
                name: itemName,
                quantity: parseInt(itemQuantity),
                price: parseFloat(itemPrice)
            };
        }
        return null;
    }
}