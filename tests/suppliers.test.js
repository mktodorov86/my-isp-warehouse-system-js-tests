const Driver = require('../utils/driver');
const LoginPage = require('../pages/LoginPage');
const SuppliersPage = require('../pages/SuppliersPage');
const config = require('../utils/config');

describe('Suppliers Management Tests', () => {
    let driver;
    let loginPage;
    let suppliersPage;

    beforeAll(async () => {
        driver = new Driver();
        await driver.init();
        loginPage = new LoginPage(driver);
        suppliersPage = new SuppliersPage(driver);

        // Логин преди тестовете
        await loginPage.navigate();
        await loginPage.login(
            config.credentials.admin.username,
            config.credentials.admin.password
        );
    });

    beforeEach(async () => {
        await suppliersPage.navigate();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('add new supplier', async () => {
        const initialCount = await suppliersPage.getSuppliersCount();
        
        await suppliersPage.addNewSupplier(
            'Test Supplier',
            'test@supplier.com',
            '+1234567890',
            '123 Test Street'
        );
        
        const newCount = await suppliersPage.getSuppliersCount();
        expect(newCount).toBe(initialCount + 1);
        
        const supplierDetails = await suppliersPage.getSupplierDetails('Test Supplier');
        expect(supplierDetails).toEqual({
            name: 'Test Supplier',
            email: 'test@supplier.com',
            phone: '+1234567890',
            address: '123 Test Street'
        });
    });

    test('search for existing supplier', async () => {
        const supplierName = 'Search Test Supplier';
        await suppliersPage.addNewSupplier(
            supplierName,
            'search@test.com',
            '+1234567890',
            'Search Address'
        );
        
        await suppliersPage.searchSupplier(supplierName);
        const supplier = await suppliersPage.getSupplierByName(supplierName);
        
        expect(supplier).not.toBeNull();
    });

    test('edit existing supplier', async () => {
        const oldName = 'Edit Test Supplier';
        const newName = 'Updated Supplier';
        
        await suppliersPage.addNewSupplier(
            oldName,
            'edit@test.com',
            '+1234567890',
            'Edit Address'
        );
        
        await suppliersPage.editSupplier(
            oldName,
            newName,
            'updated@test.com',
            '+9876543210',
            'New Address'
        );
        
        const supplierDetails = await suppliersPage.getSupplierDetails(newName);
        expect(supplierDetails).toEqual({
            name: newName,
            email: 'updated@test.com',
            phone: '+9876543210',
            address: 'New Address'
        });
    });

    test('delete supplier', async () => {
        const supplierName = 'Delete Test Supplier';
        await suppliersPage.addNewSupplier(
            supplierName,
            'delete@test.com',
            '+1234567890',
            'Delete Address'
        );
        
        const initialCount = await suppliersPage.getSuppliersCount();
        await suppliersPage.deleteSupplier(supplierName);
        const newCount = await suppliersPage.getSuppliersCount();
        
        expect(newCount).toBe(initialCount - 1);
        const deletedSupplier = await suppliersPage.getSupplierByName(supplierName);
        expect(deletedSupplier).toBeNull();
    });

    test('validate invalid email format', async () => {
        await suppliersPage.addNewSupplier(
            'Invalid Email Supplier',
            'invalid-email',
            '+1234567890',
            'Test Address'
        );
        
        const errorMessage = await suppliersPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid email format');
    });

    test('validate duplicate supplier name', async () => {
        const supplierName = 'Duplicate Supplier';
        
        await suppliersPage.addNewSupplier(
            supplierName,
            'first@test.com',
            '+1234567890',
            'First Address'
        );
        
        await suppliersPage.addNewSupplier(
            supplierName,
            'second@test.com',
            '+0987654321',
            'Second Address'
        );
        
        const errorMessage = await suppliersPage.getErrorMessage();
        expect(errorMessage).toContain('Supplier with this name already exists');
    });

    test('validate phone number format', async () => {
        await suppliersPage.addNewSupplier(
            'Invalid Phone Supplier',
            'phone@test.com',
            'invalid-phone',
            'Test Address'
        );
        
        const errorMessage = await suppliersPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid phone number format');
    });
});