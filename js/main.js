/**
 * Основной JavaScript файл для сайта NN Company
 * Содержит общие функции и утилиты
 */

// Конфигурация
const CONFIG = {
    APP_NAME: 'NN Company',
    VERSION: '1.0.5',
    THEME_KEY: 'nn_theme',
    LANGUAGE_KEY: 'nn_language',
    USER_KEY: 'nn_user',
    SETTINGS_KEY: 'nn_settings'
};

// Утилиты
const Utils = {
    // Генерация уникального ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Форматирование даты
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Копирование текста в буфер обмена
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    // Проверка сложности пароля
    checkPasswordStrength: (password) => {
        let score = 0;
        const requirements = {
            length: false,
            uppercase: false,
            lowercase: false,
            numbers: false,
            special: false
        };

        if (password.length >= 8) {
            score += 1;
            requirements.length = true;
        }
        if (/[A-Z]/.test(password)) {
            score += 1;
            requirements.uppercase = true;
        }
        if (/[a-z]/.test(password)) {
            score += 1;
            requirements.lowercase = true;
        }
        if (/[0-9]/.test(password)) {
            score += 1;
            requirements.numbers = true;
        }
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
            requirements.special = true;
        }

        return {
            score,
            requirements,
            strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong'
        };
    },

    // Хеширование пароля (имитация bcrypt)
    hashPassword: async (password) => {
        // В реальном приложении здесь было бы настоящее хеширование
        const encoder = new TextEncoder();
        const data = encoder.encode(password + CONFIG.VERSION);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Валидация email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Генератор CAPTCHA
    generateCaptcha: () => {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 20) + 10;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 5) + 1;
                num2 = Math.floor(Math.random() * 5) + 1;
                answer = num1 * num2;
                break;
        }

        return {
            question: `Сколько будет ${num1} ${operation} ${num2}?`,
            answer: answer.toString()
        };
    },

    // Задержка выполнения
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Дебаунс
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Система перевода
const TranslationSystem = {
    currentLanguage: 'ru',
    
    translations: {
        ru: {
            'nav.home': 'Главная',
            'nav.about': 'О нас',
            'nav.products': 'Продукты',
            'nav.settings': 'Настройки',
            'nav.login': 'Войти',
            'nav.profile': 'Профиль',
            
            'hero.title': 'Технологии, которые <span class="gradient-text">понимают</span> вас',
            'hero.subtitle': 'Чистый код. Интуитивный дизайн. Бесшовный опыт.',
            'hero.products': 'Наши продукты',
            'hero.learn': 'Узнать больше',
            
            'products.title': 'Наши продукты',
            'products.subtitle': 'Инструменты для вашей цифровой жизни',
            
            'product.launcher': 'NN Launcher',
            'product.launcher.desc': 'Быстрый и безопасный лаунчер для всех ваших приложений',
            'product.download': 'Скачать',
            'product.source': 'Исходный код',
            
            'product.antivirus': 'NN Antivirus',
            'product.antivirus.desc': 'Защита в реальном времени без замедления работы',
            'product.coming': 'Скоро',
            
            'product.gamehub': 'NN Game Hub',
            'product.gamehub.desc': 'Центр для игроков с оптимизацией и статистикой',
            
            'about.title': 'О нас',
            'about.silentium': 'Silentium',
            'about.silentium.philosophy': 'Философия кода',
            'about.silentium.text': 'Чистый, эффективный код без лишнего шума. Работает так, что вы его не замечаете.',
            
            'about.iswyre': 'ISWYRE',
            'about.iswyre.philosophy': 'Философия дизайна',
            'about.iswyre.text': '«Я вижу, кто ты есть». Создаем продукты, которые понимают потребности пользователя.',
            
            'about.nn': 'NN',
            'about.nn.founders': 'Основатели: Silentium & ISWYRE',
            'about.nn.text': 'Нас всего двое. Но в этой малости — наша сила.',
            
            'about.details.title': 'Почему выбирают наши программы:',
            'about.simplicity': 'Простота использования',
            'about.simplicity.desc': 'Интуитивный интерфейс, который поймет каждый без инструкций',
            'about.speed': 'Высокая скорость',
            'about.speed.desc': 'Мгновенная работа даже на слабых устройствах',
            'about.security': 'Безопасность',
            'about.security.desc': 'Ваши данные защищены современными методами шифрования',
            
            'support.title': 'Поддержите нашу работу',
            'support.subtitle': 'Ваша поддержка помогает нам создавать качественные продукты',
            'support.button': 'Поддержать нас',
            
            'footer.tagline': 'Технологии, которые понимают вас',
            'footer.products': 'Продукты',
            'footer.company': 'Компания',
            'footer.support': 'Поддержка',
            'footer.philosophy': 'Философия',
            'footer.donate': 'Пожертвовать',
            'footer.help': 'Помощь',
            'footer.contacts': 'Контакты',
            'footer.copyright': 'Все права защищены.',
            
            'settings.title': 'Настройки',
            'settings.subtitle': 'Настройте внешний вид и поведение наших приложений',
            
            'settings.themes': 'Темы оформления',
            'settings.theme.nntheme': 'NN Theme',
            'settings.theme.nntheme.desc': 'Стандартная тема',
            'settings.theme.winter': 'Зимняя',
            'settings.theme.winter.desc': 'Светло-голубые градиенты',
            'settings.theme.dark': 'Темная',
            'settings.theme.dark.desc': 'Для работы ночью',
            'settings.theme.light': 'Светлая',
            'settings.theme.light.desc': 'Классический стиль',
            'settings.theme.active': 'Активно',
            'settings.theme.select': 'Выбрать',
            'settings.theme.system': 'Следовать системным настройкам',
            'settings.theme.system.desc': 'Автоматически переключать тему в зависимости от системных настроек',
            
            'settings.language': 'Язык интерфейса',
            'settings.language.desc': 'Выберите язык интерфейса для наших приложений. Доступны как естественные языки, так и языки программирования.',
            'settings.language.natural': 'Естественные языки',
            'settings.language.programming': 'Языки программирования',
            'settings.language.search.natural': 'Поиск языка... (450+ языков)',
            'settings.language.search.programming': 'Поиск языка... (200+ языков)',
            'settings.language.example': 'Пример кода',
            'settings.language.copy': 'Копировать',
            'settings.language.save': 'Сохранить настройки',
            
            'settings.additional': 'Дополнительные настройки',
            'settings.notifications': 'Уведомления',
            'settings.notifications.desc': 'Получать уведомления об обновлениях и новостях',
            'settings.autoupdate': 'Автообновление',
            'settings.autoupdate.desc': 'Автоматически проверять и устанавливать обновления',
            'settings.analytics': 'Анонимная аналитика',
            'settings.analytics.desc': 'Помочь улучшить продукты, отправляя анонимные данные',
            'settings.export': 'Экспорт настроек',
            'settings.import': 'Импорт настроек',
            'settings.reset': 'Сбросить настройки',
            'settings.import.area': 'Перетащите файл настроек сюда или нажмите для выбора',
            
            'settings.info': 'Информация',
            'settings.info.version': 'Версия приложения:',
            'settings.info.update': 'Последнее обновление:',
            'settings.info.storage': 'Размер хранилища:',
            'settings.info.theme': 'Текущая тема:',
            'settings.info.language': 'Выбранный язык:',
            
            'modal.confirm': 'Подтверждение действия',
            'modal.cancel': 'Отмена',
            'modal.confirm.button': 'Подтвердить',
            
            'auth.welcome': 'Добро пожаловать в <span class="gradient-text">NN Company</span>',
            'auth.subtitle': 'Войдите в свою учетную запись или создайте новую',
            'auth.security': 'Безопасность',
            'auth.security.desc': 'Ваши данные защищены современным шифрованием',
            'auth.sync': 'Синхронизация',
            'auth.sync.desc': 'Настройки сохраняются на всех ваших устройствах',
            'auth.speed': 'Быстрый доступ',
            'auth.speed.desc': 'Мгновенный доступ ко всем нашим продуктам',
            
            'auth.tab.login': 'Вход',
            'auth.tab.register': 'Регистрация',
            'auth.google': 'Войти через Google',
            'auth.or': 'или через email',
            
            'auth.email': 'Email',
            'auth.email.placeholder': 'Ваш email',
            'auth.password': 'Пароль',
            'auth.password.placeholder': 'Ваш пароль',
            'auth.captcha': 'Сколько будет 7 + 3?',
            'auth.captcha.placeholder': 'Введите ответ',
            'auth.remember': 'Запомнить меня',
            'auth.forgot': 'Забыли пароль?',
            'auth.login.button': 'Войти',
            'auth.noaccount': 'Еще нет аккаунта?',
            'auth.register.link': 'Зарегистрироваться',
            
            'auth.register.step1': 'Email',
            'auth.register.step2': 'Код',
            'auth.register.step3': 'Данные',
            'auth.register.email': 'Email адрес',
            'auth.register.email.placeholder': 'example@mail.com',
            'auth.register.email.hint': 'На этот email будет отправлен код подтверждения',
            'auth.register.code.button': 'Отправить код',
            'auth.register.code': 'Код подтверждения',
            'auth.register.code.hint': 'Введите 6-значный код из письма',
            'auth.register.code.resend': 'Отправить код повторно',
            'auth.register.code.confirm': 'Подтвердить код',
            'auth.register.username': 'Имя пользователя',
            'auth.register.username.placeholder': 'Придумайте логин',
            'auth.register.password': 'Пароль',
            'auth.register.password.placeholder': 'Создайте пароль',
            'auth.register.password.confirm': 'Подтвердите пароль',
            'auth.register.password.confirm.placeholder': 'Повторите пароль',
            'auth.register.terms': 'Я согласен с Условиями использования и Политикой конфиденциальности',
            'auth.register.button': 'Зарегистрировать аккаунт',
            
            'auth.register.success': 'Регистрация успешна!',
            'auth.register.success.desc': 'Ваш аккаунт был создан. Выполняется вход в систему...',
            'auth.register.username.label': 'Логин:',
            'auth.register.password.label': 'Пароль:',
            'auth.register.warning': 'Сохраните эти данные в надежном месте. Для безопасности рекомендуем сменить пароль после первого входа.',
            'auth.register.profile': 'Перейти в профиль',
            
            'auth.recovery.title': 'Восстановление пароля',
            'auth.recovery.email': 'Введите ваш email',
            'auth.recovery.email.placeholder': 'email@example.com',
            'auth.recovery.hint': 'На указанный email будет отправлена инструкция по восстановлению пароля.',
            'auth.recovery.send': 'Отправить'
        },
        
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.products': 'Products',
            'nav.settings': 'Settings',
            'nav.login': 'Login',
            'nav.profile': 'Profile',
            
            'hero.title': 'Technology that <span class="gradient-text">understands</span> you',
            'hero.subtitle': 'Clean code. Intuitive design. Seamless experience.',
            'hero.products': 'Our products',
            'hero.learn': 'Learn more',
            
            'products.title': 'Our Products',
            'products.subtitle': 'Tools for your digital life',
            
            'product.launcher': 'NN Launcher',
            'product.launcher.desc': 'Fast and secure launcher for all your applications',
            'product.download': 'Download',
            'product.source': 'Source code',
            
            'product.antivirus': 'NN Antivirus',
            'product.antivirus.desc': 'Real-time protection without slowing down your system',
            'product.coming': 'Coming soon',
            
            'product.gamehub': 'NN Game Hub',
            'product.gamehub.desc': 'Hub for gamers with optimization and statistics',
            
            'about.title': 'About Us',
            'about.silentium': 'Silentium',
            'about.silentium.philosophy': 'Code Philosophy',
            'about.silentium.text': 'Clean, efficient code without unnecessary noise. Works so you don\'t notice it.',
            
            'about.iswyre': 'ISWYRE',
            'about.iswyre.philosophy': 'Design Philosophy',
            'about.iswyre.text': '"I See Why You Are". We create products that understand user needs.',
            
            'about.nn': 'NN',
            'about.nn.founders': 'Founders: Silentium & ISWYRE',
            'about.nn.text': 'There are only two of us. But in this smallness lies our strength.',
            
            'about.details.title': 'Why choose our programs:',
            'about.simplicity': 'Easy to use',
            'about.simplicity.desc': 'Intuitive interface that everyone can understand without instructions',
            'about.speed': 'High speed',
            'about.speed.desc': 'Instant work even on weak devices',
            'about.security': 'Security',
            'about.security.desc': 'Your data is protected by modern encryption methods',
            
            'support.title': 'Support our work',
            'support.subtitle': 'Your support helps us create quality products',
            'support.button': 'Support us',
            
            'footer.tagline': 'Technology that understands you',
            'footer.products': 'Products',
            'footer.company': 'Company',
            'footer.support': 'Support',
            'footer.philosophy': 'Philosophy',
            'footer.donate': 'Donate',
            'footer.help': 'Help',
            'footer.contacts': 'Contacts',
            'footer.copyright': 'All rights reserved.',
            
            'settings.title': 'Settings',
            'settings.subtitle': 'Customize the appearance and behavior of our applications',
            
            'settings.themes': 'Themes',
            'settings.theme.nntheme': 'NN Theme',
            'settings.theme.nntheme.desc': 'Default theme',
            'settings.theme.winter': 'Winter',
            'settings.theme.winter.desc': 'Light blue gradients',
            'settings.theme.dark': 'Dark',
            'settings.theme.dark.desc': 'For night work',
            'settings.theme.light': 'Light',
            'settings.theme.light.desc': 'Classic style',
            'settings.theme.active': 'Active',
            'settings.theme.select': 'Select',
            'settings.theme.system': 'Follow system settings',
            'settings.theme.system.desc': 'Automatically switch theme based on system settings',
            
            'settings.language': 'Interface Language',
            'settings.language.desc': 'Choose the interface language for our applications. Both natural languages and programming languages are available.',
            'settings.language.natural': 'Natural Languages',
            'settings.language.programming': 'Programming Languages',
            'settings.language.search.natural': 'Search language... (450+ languages)',
            'settings.language.search.programming': 'Search language... (200+ languages)',
            'settings.language.example': 'Code example',
            'settings.language.copy': 'Copy',
            'settings.language.save': 'Save settings',
            
            'settings.additional': 'Additional Settings',
            'settings.notifications': 'Notifications',
            'settings.notifications.desc': 'Receive notifications about updates and news',
            'settings.autoupdate': 'Auto-update',
            'settings.autoupdate.desc': 'Automatically check and install updates',
            'settings.analytics': 'Anonymous analytics',
            'settings.analytics.desc': 'Help improve products by sending anonymous data',
            'settings.export': 'Export settings',
            'settings.import': 'Import settings',
            'settings.reset': 'Reset settings',
            'settings.import.area': 'Drag settings file here or click to select',
            
            'settings.info': 'Information',
            'settings.info.version': 'App version:',
            'settings.info.update': 'Last update:',
            'settings.info.storage': 'Storage size:',
            'settings.info.theme': 'Current theme:',
            'settings.info.language': 'Selected language:',
            
            'modal.confirm': 'Confirm action',
            'modal.cancel': 'Cancel',
            'modal.confirm.button': 'Confirm',
            
            'auth.welcome': 'Welcome to <span class="gradient-text">NN Company</span>',
            'auth.subtitle': 'Sign in to your account or create a new one',
            'auth.security': 'Security',
            'auth.security.desc': 'Your data is protected by modern encryption',
            'auth.sync': 'Sync',
            'auth.sync.desc': 'Settings are saved on all your devices',
            'auth.speed': 'Fast access',
            'auth.speed.desc': 'Instant access to all our products',
            
            'auth.tab.login': 'Login',
            'auth.tab.register': 'Register',
            'auth.google': 'Sign in with Google',
            'auth.or': 'or via email',
            
            'auth.email': 'Email',
            'auth.email.placeholder': 'Your email',
            'auth.password': 'Password',
            'auth.password.placeholder': 'Your password',
            'auth.captcha': 'What is 7 + 3?',
            'auth.captcha.placeholder': 'Enter answer',
            'auth.remember': 'Remember me',
            'auth.forgot': 'Forgot password?',
            'auth.login.button': 'Sign in',
            'auth.noaccount': 'Don\'t have an account?',
            'auth.register.link': 'Register',
            
            'auth.register.step1': 'Email',
            'auth.register.step2': 'Code',
            'auth.register.step3': 'Data',
            'auth.register.email': 'Email address',
            'auth.register.email.placeholder': 'example@mail.com',
            'auth.register.email.hint': 'A verification code will be sent to this email',
            'auth.register.code.button': 'Send code',
            'auth.register.code': 'Verification code',
            'auth.register.code.hint': 'Enter 6-digit code from email',
            'auth.register.code.resend': 'Resend code',
            'auth.register.code.confirm': 'Confirm code',
            'auth.register.username': 'Username',
            'auth.register.username.placeholder': 'Choose username',
            'auth.register.password': 'Password',
            'auth.register.password.placeholder': 'Create password',
            'auth.register.password.confirm': 'Confirm password',
            'auth.register.password.confirm.placeholder': 'Repeat password',
            'auth.register.terms': 'I agree to the Terms of Service and Privacy Policy',
            'auth.register.button': 'Register account',
            
            'auth.register.success': 'Registration successful!',
            'auth.register.success.desc': 'Your account has been created. Logging in...',
            'auth.register.username.label': 'Username:',
            'auth.register.password.label': 'Password:',
            'auth.register.warning': 'Save this data in a secure place. For security, we recommend changing your password after first login.',
            'auth.register.profile': 'Go to profile'
        }
    },

    init: () => {
        // Загрузка сохраненного языка
        const savedLang = localStorage.getItem(CONFIG.LANGUAGE_KEY) || 'ru';
        TranslationSystem.currentLanguage = savedLang;
        
        // Установка языка страницы
        document.documentElement.lang = TranslationSystem.currentLanguage;
        
        // Применение переводов
        TranslationSystem.applyTranslations();
    },

    applyTranslations: () => {
        const lang = TranslationSystem.currentLanguage;
        const dict = TranslationSystem.translations[lang] || TranslationSystem.translations['ru'];
        
        // Обновление всех элементов с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (dict[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = dict[key];
                } else if (element.hasAttribute('data-i18n-html')) {
                    element.innerHTML = dict[key];
                } else {
                    element.textContent = dict[key];
                }
            }
        });
        
        // Обновление title страницы
        const pageTitle = document.querySelector('title[data-i18n]');
        if (pageTitle && dict[pageTitle.getAttribute('data-i18n')]) {
            document.title = dict[pageTitle.getAttribute('data-i18n')];
        }
        
        // Обновление мета-тегов
        const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
        if (metaDesc && dict[metaDesc.getAttribute('data-i18n')]) {
            metaDesc.content = dict[metaDesc.getAttribute('data-i18n')];
        }
        
        // Обновление отображения текущего языка
        const currentLangEl = document.getElementById('currentLanguage');
        if (currentLangEl) {
            if (lang === 'ru') {
                currentLangEl.textContent = 'Русский';
            } else if (lang === 'en') {
                currentLangEl.textContent = 'English';
            } else {
                currentLangEl.textContent = lang.toUpperCase();
            }
        }
    },

    setLanguage: (langCode) => {
        if (TranslationSystem.translations[langCode]) {
            TranslationSystem.currentLanguage = langCode;
            
            // Сохранение в localStorage
            localStorage.setItem(CONFIG.LANGUAGE_KEY, langCode);
            
            // Обновление атрибута lang у html
            document.documentElement.lang = langCode;
            
            // Применение переводов
            TranslationSystem.applyTranslations();
            
            // Уведомление
            const langName = langCode === 'ru' ? 'Русский' : 
                            langCode === 'en' ? 'English' : 
                            langCode.toUpperCase();
            Toast.show(`Язык изменен на ${langName}`, 'success');
            
            return true;
        }
        return false;
    },

    // Получение перевода по ключу
    t: (key, params = {}) => {
        const lang = TranslationSystem.currentLanguage;
        const dict = TranslationSystem.translations[lang] || TranslationSystem.translations['ru'];
        let text = dict[key] || key;
        
        // Замена параметров
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
};

// Управление темой
const ThemeManager = {
    currentTheme: 'nntheme',
    themes: {
        nntheme: {
            name: 'NN Theme',
            primary: '#6d28d9',
            primaryDark: '#5b21b6',
            primaryLight: '#8b5cf6',
            bgPrimary: '#0f172a',
            bgSecondary: '#1e293b'
        },
        winter: {
            name: 'Зимняя',
            primary: '#0ea5e9',
            primaryDark: '#0284c7',
            primaryLight: '#38bdf8',
            bgPrimary: '#f0f9ff',
            bgSecondary: '#e0f2fe'
        },
        dark: {
            name: 'Темная',
            primary: '#8b5cf6',
            primaryDark: '#7c3aed',
            primaryLight: '#a78bfa',
            bgPrimary: '#111827',
            bgSecondary: '#1f2937'
        },
        light: {
            name: 'Светлая',
            primary: '#6d28d9',
            primaryDark: '#5b21b6',
            primaryLight: '#8b5cf6',
            bgPrimary: '#ffffff',
            bgSecondary: '#f8fafc'
        }
    },

    init: () => {
        // Загрузка сохраненной темы
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'nntheme';
        ThemeManager.setTheme(savedTheme);
        
        // Инициализация переключателя
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.checked = savedTheme === 'dark';
            toggle.addEventListener('change', (e) => {
                ThemeManager.toggleDarkLight();
            });
        }

        // Обработчики для выбора темы
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                ThemeManager.setTheme(theme);
            });
        });
    },

    setTheme: (themeName) => {
        if (!ThemeManager.themes[themeName]) return;

        const theme = ThemeManager.themes[themeName];
        ThemeManager.currentTheme = themeName;

        // Обновление CSS переменных
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--primary-dark', theme.primaryDark);
        document.documentElement.style.setProperty('--primary-light', theme.primaryLight);
        document.documentElement.style.setProperty('--bg-primary', theme.bgPrimary);
        document.documentElement.style.setProperty('--bg-secondary', theme.bgSecondary);

        // Обновление активной карточки темы
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.theme === themeName) {
                card.classList.add('active');
                const badge = card.querySelector('.theme-badge') || card.querySelector('.btn-small');
                if (badge) {
                    badge.innerHTML = '<i class="fas fa-check"></i> ' + TranslationSystem.t('settings.theme.active');
                    badge.className = 'theme-badge';
                }
            }
        });

        // Сохранение в localStorage
        localStorage.setItem(CONFIG.THEME_KEY, themeName);
        
        // Обновление отображения текущей темы
        const currentThemeEl = document.getElementById('currentTheme');
        if (currentThemeEl) {
            currentThemeEl.textContent = TranslationSystem.t(`settings.theme.${themeName}`);
        }

        // Уведомление
        Toast.show(`${TranslationSystem.t('settings.theme.select')}: ${theme.name}`, 'success');
    },

    toggleDarkLight: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'nntheme' ? 'dark' : 'nntheme';
        ThemeManager.setTheme(newTheme);
    },

    getCurrentTheme: () => {
        return ThemeManager.currentTheme;
    }
};

// Управление языками
const LanguageManager = {
    currentLanguage: 'ru',
    languages: {
        natural: [],
        programming: []
    },

    init: async () => {
        // Загрузка сохраненного языка
        const savedLang = localStorage.getItem(CONFIG.LANGUAGE_KEY) || 'ru';
        LanguageManager.currentLanguage = savedLang;

        // Загрузка списков языков
        await LanguageManager.loadLanguages();

        // Инициализация переключателей
        LanguageManager.initCategoryTabs();
        LanguageManager.initSearch();
        LanguageManager.initLanguageSelection();

        // Загрузка предустановленного языка
        await LanguageManager.loadLanguageData(savedLang);
    },

    loadLanguages: async () => {
        try {
            // Естественные языки
            LanguageManager.languages.natural = [
                { code: 'ru', name: 'Русский', native: 'Русский', flag: '🇷🇺' },
                { code: 'en', name: 'Английский', native: 'English', flag: '🇺🇸' },
                { code: 'es', name: 'Испанский', native: 'Español', flag: '🇪🇸' },
                { code: 'fr', name: 'Французский', native: 'Français', flag: '🇫🇷' },
                { code: 'de', name: 'Немецкий', native: 'Deutsch', flag: '🇩🇪' },
                { code: 'zh', name: 'Китайский', native: '中文', flag: '🇨🇳' },
                { code: 'ja', name: 'Японский', native: '日本語', flag: '🇯🇵' },
                { code: 'ko', name: 'Корейский', native: '한국어', flag: '🇰🇷' },
                { code: 'ar', name: 'Арабский', native: 'العربية', flag: '🇸🇦' },
                { code: 'hi', name: 'Хинди', native: 'हिन्दी', flag: '🇮🇳' }
            ];

            // Языки программирования
            LanguageManager.languages.programming = [
                { code: 'python', name: 'Python', example: 'print("NN Company")' },
                { code: 'javascript', name: 'JavaScript', example: 'console.log("NN Company")' },
                { code: 'java', name: 'Java', example: 'System.out.println("NN Company");' },
                { code: 'cpp', name: 'C++', example: 'cout << "NN Company" << endl;' },
                { code: 'csharp', name: 'C#', example: 'Console.WriteLine("NN Company");' },
                { code: 'php', name: 'PHP', example: 'echo "NN Company";' },
                { code: 'ruby', name: 'Ruby', example: 'puts "NN Company"' },
                { code: 'go', name: 'Go', example: 'fmt.Println("NN Company")' },
                { code: 'rust', name: 'Rust', example: 'println!("NN Company");' },
                { code: 'swift', name: 'Swift', example: 'print("NN Company")' }
            ];

            // Заполнение списков
            LanguageManager.renderLanguageList('natural', LanguageManager.languages.natural);
            LanguageManager.renderLanguageList('programming', LanguageManager.languages.programming);

        } catch (error) {
            console.error('Ошибка загрузки языков:', error);
        }
    },

    initCategoryTabs: () => {
        const tabs = document.querySelectorAll('.category-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                
                // Активация вкладки
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Показ соответствующей категории
                document.querySelectorAll('.language-category').forEach(cat => {
                    cat.classList.remove('active');
                });
                document.getElementById(`${category}Languages`).classList.add('active');
                
                // Обновление текста кнопок
                TranslationSystem.applyTranslations();
            });
        });
    },

    initSearch: () => {
        const naturalSearch = document.getElementById('naturalSearch');
        const programmingSearch = document.getElementById('programmingSearch');

        if (naturalSearch) {
            naturalSearch.addEventListener('input', Utils.debounce((e) => {
                const query = e.target.value.toLowerCase();
                const filtered = LanguageManager.languages.natural.filter(lang =>
                    lang.name.toLowerCase().includes(query) ||
                    lang.native.toLowerCase().includes(query)
                );
                LanguageManager.renderLanguageList('natural', filtered);
            }, 300));
        }

        if (programmingSearch) {
            programmingSearch.addEventListener('input', Utils.debounce((e) => {
                const query = e.target.value.toLowerCase();
                const filtered = LanguageManager.languages.programming.filter(lang =>
                    lang.name.toLowerCase().includes(query) ||
                    lang.code.toLowerCase().includes(query)
                );
                LanguageManager.renderLanguageList('programming', filtered);
            }, 300));
        }
    },

    initLanguageSelection: () => {
        // Обработчики для естественных языков
        document.querySelectorAll('#naturalGrid .language-item').forEach(item => {
            item.addEventListener('click', () => {
                const code = item.dataset.code;
                LanguageManager.selectLanguage(code, 'natural');
            });
        });

        // Обработчики для языков программирования
        document.querySelectorAll('#programmingGrid .language-item').forEach(item => {
            item.addEventListener('click', () => {
                const code = item.dataset.code;
                LanguageManager.selectLanguage(code, 'programming');
            });
        });

        // Кнопка копирования кода
        const copyBtn = document.querySelector('.btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const code = document.querySelector('#codeExample').textContent;
                await Utils.copyToClipboard(code);
                Toast.show(TranslationSystem.t('settings.language.copy'), 'success');
            });
        }
    },

    renderLanguageList: (type, languages) => {
        const container = document.getElementById(`${type}Grid`);
        if (!container) return;

        container.innerHTML = languages.map(lang => {
            if (type === 'natural') {
                return `
                    <div class="language-item" data-code="${lang.code}">
                        <div class="language-flag">${lang.flag}</div>
                        <div class="language-name">${lang.name}</div>
                        <div class="language-native">${lang.native}</div>
                    </div>
                `;
            } else {
                return `
                    <div class="language-item" data-code="${lang.code}">
                        <div class="language-flag">
                            <i class="fas fa-code"></i>
                        </div>
                        <div class="language-name">${lang.name}</div>
                    </div>
                `;
            }
        }).join('');

        // Переинициализация обработчиков
        LanguageManager.initLanguageSelection();
    },

    selectLanguage: (code, type) => {
        LanguageManager.currentLanguage = code;

        // Обновление выделения
        document.querySelectorAll('.language-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.code === code) {
                item.classList.add('active');
            }
        });

        if (type === 'programming') {
            // Для языков программирования только показываем пример кода
            const lang = LanguageManager.languages.programming.find(l => l.code === code);
            if (lang) {
                const codeExample = document.getElementById('codeExample');
                if (codeExample) {
                    codeExample.textContent = lang.example;
                    codeExample.className = `language-${lang.code}`;
                    
                    // Обновление подсветки синтаксиса
                    if (window.hljs) {
                        hljs.highlightElement(codeExample);
                    }
                }
            }
            
            Toast.show(`Выбран язык программирования: ${code}`, 'info');
        } else {
            // Для естественных языков меняем интерфейс
            TranslationSystem.setLanguage(code);
        }

        // Обновление отображения текущего языка
        const currentLanguageEl = document.getElementById('currentLanguage');
        if (currentLanguageEl && type === 'natural') {
            const lang = LanguageManager.languages.natural.find(l => l.code === code);
            if (lang) {
                currentLanguageEl.textContent = lang.name;
            }
        }
    },

    loadLanguageData: async (code) => {
        // Здесь можно загрузить переводы для выбранного языка
        console.log(`Загрузка данных для языка: ${code}`);
    }
};

// Система уведомлений
const Toast = {
    container: null,
    queue: [],

    init: () => {
        Toast.container = document.querySelector('.toast-container');
        if (!Toast.container) {
            Toast.container = document.createElement('div');
            Toast.container.className = 'toast-container';
            document.body.appendChild(Toast.container);
        }
    },

    show: (message, type = 'info', duration = 5000) => {
        const id = Utils.generateId();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = `toast-${id}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        Toast.container.appendChild(toast);

        // Анимация появления
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Автоматическое закрытие
        const autoClose = setTimeout(() => {
            Toast.hide(id);
        }, duration);

        // Ручное закрытие
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            Toast.hide(id);
        });

        // Добавление в очередь для управления
        Toast.queue.push({
            id,
            element: toast,
            timeout: autoClose
        });
    },

    hide: (id) => {
        const toast = document.getElementById(`toast-${id}`);
        if (toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                toast.remove();
                
                // Удаление из очереди
                const index = Toast.queue.findIndex(t => t.id === id);
                if (index > -1) {
                    Toast.queue.splice(index, 1);
                }
            }, 300);
        }
    },

    clearAll: () => {
        Toast.queue.forEach(toast => {
            clearTimeout(toast.timeout);
            toast.element.remove();
        });
        Toast.queue = [];
    }
};

// Управление модальными окнами
const Modal = {
    current: null,

    open: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            Modal.current = modal;
            document.body.style.overflow = 'hidden';
        }
    },

    close: () => {
        if (Modal.current) {
            Modal.current.classList.remove('active');
            Modal.current = null;
            document.body.style.overflow = '';
        }
    },

    init: () => {
        // Закрытие по кнопке
        document.querySelectorAll('.modal-close, .modal .btn-secondary').forEach(btn => {
            btn.addEventListener('click', Modal.close);
        });

        // Закрытие по клику вне модального окна
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Modal.close();
                }
            });
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && Modal.current) {
                Modal.close();
            }
        });
    }
};

// Инициализация мобильного меню
const initMobileMenu = () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Закрытие меню при клике на ссылку
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
};

// Инициализация тултипов
const initTooltips = () => {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const tooltip = element.getAttribute('data-tooltip');
            if (tooltip) {
                element.setAttribute('title', tooltip);
            }
        });
    });
};

// Система сохранения данных
const StorageManager = {
    // Экспорт всех данных
    exportData: () => {
        const data = {
            theme: localStorage.getItem(CONFIG.THEME_KEY),
            language: localStorage.getItem(CONFIG.LANGUAGE_KEY),
            user: localStorage.getItem(CONFIG.USER_KEY),
            settings: localStorage.getItem(CONFIG.SETTINGS_KEY),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nn-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Toast.show(TranslationSystem.t('settings.export'), 'success');
    },

    // Импорт данных
    importData: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Валидация данных
                    if (data.theme) localStorage.setItem(CONFIG.THEME_KEY, data.theme);
                    if (data.language) {
                        localStorage.setItem(CONFIG.LANGUAGE_KEY, data.language);
                        // Применяем новый язык
                        TranslationSystem.setLanguage(data.language);
                    }
                    if (data.user) localStorage.setItem(CONFIG.USER_KEY, data.user);
                    if (data.settings) localStorage.setItem(CONFIG.SETTINGS_KEY, data.settings);
                    
                    Toast.show(TranslationSystem.t('settings.import'), 'success');
                    resolve(true);
                } catch (error) {
                    Toast.show('Ошибка импорта: неверный формат файла', 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                Toast.show('Ошибка чтения файла', 'error');
                reject(new Error('File read error'));
            };
            
            reader.readAsText(file);
        });
    },

    // Сброс всех данных
    resetData: () => {
        if (confirm('Вы уверены, что хотите сбросить все настройки? Это действие нельзя отменить.')) {
            localStorage.clear();
            Toast.show('Все настройки сброшены', 'success');
            
            // Перезагрузка страницы
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    },

    // Получение информации о хранилище
    getStorageInfo: () => {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16 символы занимают 2 байта
            }
        }
        return {
            size: (total / 1024).toFixed(2) + ' KB',
            items: localStorage.length
        };
    }
};

// Инициализация всех компонентов
const initTheme = () => {
    ThemeManager.init();
};

const initSettings = () => {
    // Загрузка информации о системе
    const lastUpdateEl = document.getElementById('lastUpdate');
    const storageSizeEl = document.getElementById('storageSize');
    
    if (lastUpdateEl) {
        lastUpdateEl.textContent = Utils.formatDate(new Date());
    }
    
    if (storageSizeEl) {
        const storageInfo = StorageManager.getStorageInfo();
        storageSizeEl.textContent = storageInfo.size;
    }

    // Инициализация переключателей
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingId = e.target.id;
            const value = e.target.checked;
            
            // Сохранение настройки
            let settings = JSON.parse(localStorage.getItem(CONFIG.SETTINGS_KEY) || '{}');
            settings[settingId] = value;
            localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
            
            Toast.show(`Настройка "${settingId}" сохранена`, 'success');
        });
    });

    // Загрузка сохраненных настроек
    const savedSettings = JSON.parse(localStorage.getItem(CONFIG.SETTINGS_KEY) || '{}');
    Object.entries(savedSettings).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) {
            input.checked = value;
        }
    });

    // Обработчики кнопок
    const exportBtn = document.getElementById('exportSettings');
    const importBtn = document.getElementById('importSettings');
    const resetBtn = document.getElementById('resetSettings');
    const importSection = document.getElementById('importSection');
    const importArea = document.getElementById('importArea');

    if (exportBtn) {
        exportBtn.addEventListener('click', StorageManager.exportData);
    }

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            importSection.style.display = 'block';
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', StorageManager.resetData);
    }

    if (importArea) {
        importArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            importArea.style.background = 'rgba(109, 40, 217, 0.1)';
        });

        importArea.addEventListener('dragleave', () => {
            importArea.style.background = '';
        });

        importArea.addEventListener('drop', async (e) => {
            e.preventDefault();
            importArea.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/json') {
                await StorageManager.importData(file);
                importSection.style.display = 'none';
            } else {
                Toast.show('Пожалуйста, загрузите JSON файл', 'error');
            }
        });

        const fileInput = document.getElementById('settingsFile');
        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await StorageManager.importData(file);
                    importSection.style.display = 'none';
                    fileInput.value = '';
                }
            });
        }
    }
    
    // Инициализация менеджера языков
    LanguageManager.init();
};

// Инициализация системы переводов
const initTranslations = () => {
    TranslationSystem.init();
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация компонентов
    Toast.init();
    Modal.init();
    initMobileMenu();
    initTooltips();
    initTranslations();
    
    // Показать страницу после загрузки
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Обновление информации о пользователе
    const updateUserInfo = () => {
        const userData = localStorage.getItem(CONFIG.USER_KEY);
        const userNameElement = document.getElementById('userName');
        
        if (userNameElement) {
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    userNameElement.textContent = user.username || TranslationSystem.t('nav.profile');
                } catch (e) {
                    userNameElement.textContent = TranslationSystem.t('nav.login');
                }
            } else {
                userNameElement.textContent = TranslationSystem.t('nav.login');
            }
        }
    };

    updateUserInfo();

    // Обработчик изменения localStorage (для синхронизации между вкладками)
    window.addEventListener('storage', (e) => {
        if (e.key === CONFIG.USER_KEY) {
            updateUserInfo();
        }
        if (e.key === CONFIG.LANGUAGE_KEY) {
            TranslationSystem.setLanguage(e.newValue || 'ru');
        }
    });
});

// Экспорт глобальных функций
window.Utils = Utils;
window.ThemeManager = ThemeManager;
window.LanguageManager = LanguageManager;
window.TranslationSystem = TranslationSystem;
window.Toast = Toast;
window.Modal = Modal;
window.StorageManager = StorageManager;

// Объект приложения
window.NN = {
    config: CONFIG,
    initTheme,
    initSettings,
    initMobileMenu,
    initTooltips,
    initTranslations
};