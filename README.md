# Warehouse System Test Automation

Автоматизирани тестове за система за управление на склад използвайки Selenium WebDriver и JavaScript.

## Изисквания

- Node.js (версия 14 или по-нова)
- Chrome браузър
- ChromeDriver (съвместим с вашата версия на Chrome)

## Инсталация

1. Клонирайте репозиторито:
```bash
git clone https://github.com/mktodorov86/my-isp-warehouse-system-js-tests.git
cd YOUR-REPO-NAME
```

2. Инсталирайте зависимостите:
```bash
npm install
```

3. Създайте `.env` файл в основната директория със следното съдържание:
```
BASE_URL=http://localhost:8080
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
USER_USERNAME=your_user_username
USER_PASS=your_user_password
```

## Стартиране на тестовете

За да стартирате всички тестове:
```bash
npm test
```

За да стартирате специфичен тест:
```bash
npm run test:login    # само login тестове
npm run test:inventory # само inventory тестове
```

## Структура на проекта

- `/tests` - тестови файлове
- `/pages` - Page Object класове
- `/utils` - помощни функции и конфигурация

## Приноси

Моля, прочетете [CONTRIBUTING.md](CONTRIBUTING.md) за детайли относно нашия код на поведение и процеса за изпращане на pull requests.

## Related Projects
This project is a JavaScript/Selenium implementation of the original Java-based warehouse system:
[my-isp-warehouse-system](https://github.com/mktodorov86/my-isp-warehouse-system)