/**
 * Настройки для страницы настроек
 */

const SettingsManager = {
    // Инициализация настроек
    init: () => {
        SettingsManager.loadUserInfo();
        SettingsManager.initLanguageManager();
        SettingsManager.initThemeSettings();
        SettingsManager.initSystemTheme();
        SettingsManager.initExportImport();
        SettingsManager.initResetButton();
        SettingsManager.updateSystemInfo();
        
        // Инициализация выбора тем
        SettingsManager.initThemeSelection();
    },

    // Загрузка информации о пользователе
    loadUserInfo: () => {
        const userData = localStorage.getItem(window.NN.config.USER_KEY);
        const userNameElement = document.getElementById('userName');
        
        if (userNameElement && userData) {
            try {
                const user = JSON.parse(userData);
                userNameElement.textContent = user.username || 'Профиль';
            } catch (e) {
                userNameElement.textContent = 'Войти';
            }
        }
    },

    // Инициализация менеджера языков
    initLanguageManager: () => {
        // Проверяем, есть ли элементы для языков на странице
        const languageSection = document.querySelector('.language-switcher');
        if (languageSection) {
            window.LanguageManager.init().catch(error => {
                console.error('Ошибка инициализации LanguageManager:', error);
                window.Toast.show('Ошибка загрузки языков', 'error');
            });
        }
    },

    // Инициализация настроек темы
    initThemeSettings: () => {
        // Загрузка текущей темы
        const savedTheme = localStorage.getItem(window.NN.config.THEME_KEY) || 'nntheme';
        const currentThemeElement = document.getElementById('currentTheme');
        
        if (currentThemeElement) {
            const themeName = window.ThemeManager.themes[savedTheme]?.name || 'NN Theme';
            currentThemeElement.textContent = themeName;
        }

        // Обновление переключателя темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
            themeToggle.addEventListener('change', (e) => {
                const isDark = e.target.checked;
                window.ThemeManager.setTheme(isDark ? 'dark' : 'nntheme');
            });
        }
    },

    // Инициализация системной темы
    initSystemTheme: () => {
        const systemThemeToggle = document.getElementById('systemTheme');
        if (systemThemeToggle) {
            // Проверка поддержки prefers-color-scheme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Загрузка сохраненной настройки
            const settings = JSON.parse(localStorage.getItem(window.NN.config.SETTINGS_KEY) || '{}');
            systemThemeToggle.checked = settings.followSystemTheme || false;
            
            // Обработчик изменения
            systemThemeToggle.addEventListener('change', (e) => {
                const followSystem = e.target.checked;
                
                // Сохранение настройки
                const settings = JSON.parse(localStorage.getItem(window.NN.config.SETTINGS_KEY) || '{}');
                settings.followSystemTheme = followSystem;
                localStorage.setItem(window.NN.config.SETTINGS_KEY, JSON.stringify(settings));
                
                if (followSystem) {
                    // Применение системной темы
                    const systemTheme = prefersDark.matches ? 'dark' : 'light';
                    window.ThemeManager.setTheme(systemTheme);
                    
                    // Слушатель изменения системной темы
                    prefersDark.addEventListener('change', SettingsManager.handleSystemThemeChange);
                } else {
                    // Удаление слушателя
                    prefersDark.removeEventListener('change', SettingsManager.handleSystemThemeChange);
                }
                
                window.Toast.show(`Следование системной теме ${followSystem ? 'включено' : 'выключено'}`, 'success');
            });

            // Инициализация слушателя, если включено
            if (systemThemeToggle.checked) {
                prefersDark.addEventListener('change', SettingsManager.handleSystemThemeChange);
            }
        }
    },

    // Обработчик изменения системной темы
    handleSystemThemeChange: (e) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        window.ThemeManager.setTheme(systemTheme);
    },

    // Инициализация экспорта/импорта
    initExportImport: () => {
        const exportBtn = document.getElementById('exportSettings');
        const importBtn = document.getElementById('importSettings');
        const importSection = document.getElementById('importSection');
        const importArea = document.getElementById('importArea');

        // Экспорт настроек
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                window.StorageManager.exportData();
            });
        }

        // Импорт настроек
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                if (importSection) {
                    importSection.style.display = 'block';
                    importSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Drag and drop для импорта
        if (importArea) {
            importArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                importArea.style.background = 'rgba(109, 40, 217, 0.1)';
                importArea.style.borderColor = 'var(--primary-light)';
            });

            importArea.addEventListener('dragleave', () => {
                importArea.style.background = '';
                importArea.style.borderColor = '';
            });

            importArea.addEventListener('drop', async (e) => {
                e.preventDefault();
                importArea.style.background = '';
                importArea.style.borderColor = '';
                
                const file = e.dataTransfer.files[0];
                if (file && file.type === 'application/json') {
                    try {
                        await window.StorageManager.importData(file);
                        if (importSection) {
                            importSection.style.display = 'none';
                        }
                        // Перезагрузка страницы для применения настроек
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } catch (error) {
                        console.error('Ошибка импорта:', error);
                    }
                } else {
                    window.Toast.show('Пожалуйста, загрузите JSON файл', 'error');
                }
            });

            // Клик для выбора файла
            const fileInput = document.getElementById('settingsFile');
            if (fileInput) {
                importArea.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            await window.StorageManager.importData(file);
                            if (importSection) {
                                importSection.style.display = 'none';
                            }
                            // Перезагрузка страницы для применения настроек
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } catch (error) {
                            console.error('Ошибка импорта:', error);
                        }
                    }
                });
            }
        }
    },

    // Инициализация кнопки сброса
    initResetButton: () => {
        const resetBtn = document.getElementById('resetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                window.Modal.open('confirmModal');
                
                // Настройка модального окна
                const modalMessage = document.getElementById('modalMessage');
                const modalConfirm = document.getElementById('modalConfirm');
                const modalCancel = document.getElementById('modalCancel');
                
                if (modalMessage) {
                    modalMessage.textContent = 'Вы уверены, что хотите сбросить все настройки к заводским? Это действие нельзя отменить.';
                }
                
                if (modalConfirm) {
                    modalConfirm.onclick = () => {
                        window.StorageManager.resetData();
                        window.Modal.close();
                    };
                }
                
                if (modalCancel) {
                    modalCancel.onclick = window.Modal.close;
                }
            });
        }
    },

    // Обновление информации о системе
    updateSystemInfo: () => {
        // Версия приложения
        const versionElement = document.querySelector('.system-info .info-value');
        if (versionElement) {
            versionElement.textContent = `NN Launcher v${window.NN.config.VERSION}`;
        }

        // Размер хранилища
        const storageSizeElement = document.getElementById('storageSize');
        if (storageSizeElement) {
            const storageInfo = window.StorageManager.getStorageInfo();
            storageSizeElement.textContent = storageInfo.size;
        }

        // Текущий язык
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) {
            const savedLang = localStorage.getItem(window.NN.config.LANGUAGE_KEY) || 'ru';
            // Здесь можно добавить логику для получения имени языка по коду
            currentLanguageElement.textContent = savedLang === 'ru' ? 'Русский' : 'English';
        }
    },

    // Инициализация выбора тем
    initThemeSelection: () => {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                window.ThemeManager.setTheme(theme);
            });
        });
    },

    // Сохранение конкретной настройки
    saveSetting: (key, value) => {
        let settings = JSON.parse(localStorage.getItem(window.NN.config.SETTINGS_KEY) || '{}');
        settings[key] = value;
        localStorage.setItem(window.NN.config.SETTINGS_KEY, JSON.stringify(settings));
    },

    // Загрузка конкретной настройки
    loadSetting: (key, defaultValue = null) => {
        const settings = JSON.parse(localStorage.getItem(window.NN.config.SETTINGS_KEY) || '{}');
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    SettingsManager.init();
});

// Экспорт функций
window.SettingsManager = SettingsManager;