/**
 * Система перевода сайта для NN Company
 */

const TranslationSystem = {
    // Текущий язык
    currentLanguage: 'ru',
    
    // Словари переводов
    translations: {
        ru: {
            // Навигация
            'nav.home': 'Главная',
            'nav.about': 'О нас',
            'nav.products': 'Продукты',
            'nav.settings': 'Настройки',
            'nav.login': 'Войти',
            'nav.profile': 'Профиль',
            
            // Главная страница
            'hero.title': 'Технологии, которые <span class="gradient-text">понимают</span> вас',
            'hero.subtitle': 'Чистый код. Интуитивный дизайн. Бесшовный опыт.',
            'hero.products': 'Наши продукты',
            'hero.learn': 'Узнать больше',
            
            // Продукты
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
            
            // О нас
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
            
            // Поддержка
            'support.title': 'Поддержите нашу работу',
            'support.subtitle': 'Ваша поддержка помогает нам создавать качественные продукты',
            'support.button': 'Поддержать нас',
            
            // Футер
            'footer.tagline': 'Технологии, которые понимают вас',
            'footer.products': 'Продукты',
            'footer.company': 'Компания',
            'footer.support': 'Поддержка',
            'footer.philosophy': 'Философия',
            'footer.donate': 'Пожертвовать',
            'footer.help': 'Помощь',
            'footer.contacts': 'Контакты',
            'footer.copyright': 'Все права защищены.',
            
            // Настройки
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
            'settings.language.search': 'Поиск языка...',
            'settings.language.search.natural': 'Поиск языка... (450+ языков)',
            'settings.language.search.programming': 'Поиск языка... (200+ языков)',
            'settings.language.example': 'Пример кода',
            'settings.language.copy': 'Копировать',
            'settings.language.save': 'Сохранить язык',
            
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
            
            // Аутентификация
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
            // Навигация
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.products': 'Products',
            'nav.settings': 'Settings',
            'nav.login': 'Login',
            'nav.profile': 'Profile',
            
            // Главная страница
            'hero.title': 'Technology that <span class="gradient-text">understands</span> you',
            'hero.subtitle': 'Clean code. Intuitive design. Seamless experience.',
            'hero.products': 'Our products',
            'hero.learn': 'Learn more',
            
            // Продукты
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
            
            // О нас
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
            
            // Поддержка
            'support.title': 'Support our work',
            'support.subtitle': 'Your support helps us create quality products',
            'support.button': 'Support us',
            
            // Футер
            'footer.tagline': 'Technology that understands you',
            'footer.products': 'Products',
            'footer.company': 'Company',
            'footer.support': 'Support',
            'footer.philosophy': 'Philosophy',
            'footer.donate': 'Donate',
            'footer.help': 'Help',
            'footer.contacts': 'Contacts',
            'footer.copyright': 'All rights reserved.',
            
            // Настройки
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
            'settings.language.search': 'Search language...',
            'settings.language.search.natural': 'Search language... (450+ languages)',
            'settings.language.search.programming': 'Search language... (200+ languages)',
            'settings.language.example': 'Code example',
            'settings.language.copy': 'Copy',
            'settings.language.save': 'Save language',
            
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
            
            // Аутентификация
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
        },
        
        // Добавьте здесь другие языки по аналогии
        // es: {}, de: {}, fr: {}, zh: {}, etc.
    },
    
    // Инициализация
    init: () => {
        // Загрузка сохраненного языка
        const savedLang = localStorage.getItem(window.NN.config.LANGUAGE_KEY) || 'ru';
        TranslationSystem.currentLanguage = savedLang;
        
        // Установка языка страницы
        document.documentElement.lang = TranslationSystem.currentLanguage;
        
        // Применение переводов
        TranslationSystem.applyTranslations();
        
        // Инициализация кнопки сохранения языка
        TranslationSystem.initSaveButton();
    },
    
    // Применение переводов ко всем элементам с data-i18n атрибутом
    applyTranslations: () => {
        const lang = TranslationSystem.currentLanguage;
        const dict = TranslationSystem.translations[lang] || TranslationSystem.translations['ru'];
        
        // Обновление всех элементов с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (dict[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = dict[key];
                } else {
                    element.innerHTML = dict[key];
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
        
        // Сохранение текущего языка
        localStorage.setItem(window.NN.config.LANGUAGE_KEY, lang);
        
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
    
    // Смена языка
    setLanguage: (langCode) => {
        if (TranslationSystem.translations[langCode]) {
            TranslationSystem.currentLanguage = langCode;
            TranslationSystem.applyTranslations();
            
            // Обновление атрибута lang у html
            document.documentElement.lang = langCode;
            
            // Уведомление
            window.Toast.show(`Язык изменен на ${TranslationSystem.getLanguageName(langCode)}`, 'success');
            
            return true;
        }
        return false;
    },
    
    // Получение имени языка по коду
    getLanguageName: (code) => {
        const names = {
            'ru': 'Русский',
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'ar': 'العربية',
            'hi': 'हिन्दी'
        };
        return names[code] || code;
    },
    
    // Инициализация кнопки сохранения языка
    initSaveButton: () => {
        const saveButton = document.getElementById('saveLanguage');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const langSelect = document.querySelector('.language-item.active');
                if (langSelect) {
                    const langCode = langSelect.dataset.code;
                    TranslationSystem.setLanguage(langCode);
                } else {
                    window.Toast.show('Выберите язык', 'warning');
                }
            });
        }
        
        // Автоматическое сохранение при выборе языка
        document.querySelectorAll('.language-item').forEach(item => {
            item.addEventListener('click', () => {
                const langCode = item.dataset.code;
                if (langCode.length === 2) { // Только естественные языки (2 символа)
                    TranslationSystem.setLanguage(langCode);
                }
            });
        });
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    TranslationSystem.init();
});

// Экспорт функций
window.TranslationSystem = TranslationSystem;