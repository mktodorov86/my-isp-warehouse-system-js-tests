require('dotenv').config();

module.exports = {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    browser: process.env.BROWSER || 'chrome',
    implicitTimeout: 10000,
    explicitTimeout: 15000,
    credentials: {
        admin: {
            username: process.env.ADMIN_USER || 'admin',
            password: process.env.ADMIN_PASS || 'admin'
        },
        user: {
            username: process.env.USER_USERNAME || 'user',
            password: process.env.USER_PASS || 'user'
        }
    }
};