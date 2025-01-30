const Driver = require('../utils/driver');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const config = require('../utils/config');

describe('Inventory Management Tests', () => {
    let driver;
    let loginPage;
    let inventoryPage;

    beforeAll(async () => {
        driver = new Driver();
        await driver.init();
        loginPage = new LoginPage(driver);
        inventoryPage = new InventoryPage(driver);

        // Влизане в системата преди тестовете
        await loginPage.navigate();
        await loginPage.login(
            config.credentials.admin.username,
            config.credentials.admin.password
        );
    });

    beforeEach(async () => {
        await inventoryPage.navigate();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('add new item to inventory', async () => {
        const initialCount = await inventoryPage.getItemsCount();
        
        await inventoryPage.addNewItem('Test Item', 10, 99.99);
        
        const newCount = await inventoryPage.getItemsCount();
        expect(newCount).toBe(initialCount + 1);
        
        const itemDetails = await inventoryPage.getItemDetails('Test Item');
        expect(itemDetails).toEqual({
            name: 'Test Item',
            quantity: 10,
            price: 99.99
        });
    });

    test('search for existing item', async () => {
        const testItemName = 'Search Test Item';
        await inventoryPage.addNewItem(testItemName, 5, 49.99);
        
        await inventoryPage.searchItem(testItemName);
        const item = await inventoryPage.getItemByName(testItemName);
        
        expect(item).not.toBeNull();
    });

    test('edit existing item', async () => {
        const oldName = 'Edit Test Item';
        const newName = 'Updated Test Item';
        
        await inventoryPage.addNewItem(oldName, 5, 49.99);
        await inventoryPage.editItem(oldName, newName, 10, 59.99);
        
        const itemDetails = await inventoryPage.getItemDetails(newName);
        expect(itemDetails).toEqual({
            name: newName,
            quantity: 10,
            price: 59.99
        });
    });

    test('delete item from inventory', async () => {
        const itemName = 'Delete Test Item';
        await inventoryPage.addNewItem(itemName, 5, 49.99);
        
        const initialCount = await inventoryPage.getItemsCount();
        await inventoryPage.deleteItem(itemName);
        const newCount = await inventoryPage.getItemsCount();
        
        expect(newCount).toBe(initialCount - 1);
        const deletedItem = await inventoryPage.getItemByName(itemName);
        expect(deletedItem).toBeNull();
    });

    test('add item with invalid data', async () => {
        const initialCount = await inventoryPage.getItemsCount();
        
        // Опит за добавяне на артикул с невалидна цена
        await inventoryPage.addNewItem('Invalid Item', 10, -50);
        
        const newCount = await inventoryPage.getItemsCount();
        expect(newCount).toBe(initialCount); // Броят не трябва да се е променил
    });

    test('add item with zero quantity', async () => {
        const initialCount = await inventoryPage.getItemsCount();
        
        // Опит за добавяне на артикул с нулево количество
        await inventoryPage.addNewItem('Zero Quantity Item', 0, 99.99);
        
        const newCount = await inventoryPage.getItemsCount();
        expect(newCount).toBe(initialCount); // Броят не трябва да се е променил
    });
});