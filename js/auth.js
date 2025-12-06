/**
 * Система аутентификации для NN Company
 */

const AuthSystem = {
    // Текущий пользователь
    currentUser: null,
    
    // Состояние регистрации
    registrationState: {
        email: '',
        verificationCode: '',
        step: 1,
        timer: null,
        timeLeft: 120 // 2 минуты в секундах
    },

    // Инициализация
    init: () => {
        AuthSystem.loadUser();
        AuthSystem.initForms();
        AuthSystem.initEventListeners();
        AuthSystem.initCaptcha();
        
        // Проверка, авторизован ли пользователь
        if (AuthSystem.isLoggedIn()) {
            AuthSystem.redirectToProfile();
        }
    },

    // Загрузка пользователя из localStorage
    loadUser: () => {
        const userData = localStorage.getItem(window.NN.config.USER_KEY);
        if (userData) {
            try {
                AuthSystem.currentUser = JSON.parse(userData);
            } catch (e) {
                console.error('Ошибка загрузки пользователя:', e);
                localStorage.removeItem(window.NN.config.USER_KEY);
            }
        }
    },

    // Инициализация форм
    initForms: () => {
        // Форма входа через Google
        const googleLoginBtn = document.getElementById('googleLogin');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', AuthSystem.handleGoogleLogin);
        }

        // Форма входа по email
        const emailLoginForm = document.getElementById('emailLoginForm');
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', AuthSystem.handleEmailLogin);
        }

        // Форма регистрации по шагам
        AuthSystem.initRegistrationSteps();

        // Кнопка "Забыли пароль"
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', AuthSystem.handleForgotPassword);
        }

        // Переключение между вкладками
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                AuthSystem.switchAuthTab(tabId);
            });
        });

        // Ссылка "Зарегистрироваться" на форме входа
        const switchToRegister = document.querySelector('.switch-to-register');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                AuthSystem.switchAuthTab('register');
            });
        }

        // Кнопка перехода в профиль после регистрации
        const goToProfileBtn = document.getElementById('goToProfile');
        if (goToProfileBtn) {
            goToProfileBtn.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });
        }
    },

    // Инициализация шагов регистрации
    initRegistrationSteps: () => {
        // Шаг 1: Email
        const emailStepForm = document.getElementById('emailStepForm');
        if (emailStepForm) {
            emailStepForm.addEventListener('submit', AuthSystem.handleEmailStep);
        }

        // Шаг 2: Код подтверждения
        const codeStepForm = document.getElementById('codeStepForm');
        if (codeStepForm) {
            codeStepForm.addEventListener('submit', AuthSystem.handleCodeStep);
            
            // Инициализация ввода кода
            const codeInputs = document.querySelectorAll('.code-input');
            codeInputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    const value = e.target.value;
                    
                    // Переход к следующему полю
                    if (value && index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                    
                    // Автоподтверждение при заполнении всех полей
                    if (index === codeInputs.length - 1 && value) {
                        const allFilled = Array.from(codeInputs).every(input => input.value);
                        if (allFilled) {
                            codeStepForm.dispatchEvent(new Event('submit'));
                        }
                    }
                });
                
                // Обработка удаления
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && index > 0) {
                        codeInputs[index - 1].focus();
                    }
                });
            });
        }

        // Шаг 3: Данные аккаунта
        const finalStepForm = document.getElementById('finalStepForm');
        if (finalStepForm) {
            finalStepForm.addEventListener('submit', AuthSystem.handleFinalStep);
            
            // Проверка пароля в реальном времени
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.addEventListener('input', AuthSystem.checkPasswordStrength);
            }
            
            // Подтверждение пароля
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', AuthSystem.checkPasswordMatch);
            }
            
            // Проверка имени пользователя
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.addEventListener('input', AuthSystem.checkUsernameAvailability);
            }
        }

        // Кнопка повторной отправки кода
        const resendCodeBtn = document.getElementById('resendCode');
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', AuthSystem.resendVerificationCode);
        }
    },

    // Инициализация обработчиков событий
    initEventListeners: () => {
        // Переключение видимости пароля
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.closest('button').dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                    e.target.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        });

        // Кнопка отправки кода подтверждения
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', () => {
                document.getElementById('emailStepForm').dispatchEvent(new Event('submit'));
            });
        }
    },

    // Инициализация CAPTCHA
    initCaptcha: () => {
        const updateCaptcha = () => {
            const captcha = window.Utils.generateCaptcha();
            const questionElement = document.getElementById('captchaQuestion');
            if (questionElement) {
                questionElement.textContent = captcha.question;
                questionElement.dataset.answer = captcha.answer;
            }
        };

        // Обновление CAPTCHA при загрузке
        updateCaptcha();

        // Обновление при ошибке
        const loginForm = document.getElementById('emailLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                const captchaInput = document.getElementById('captchaAnswer');
                const correctAnswer = document.getElementById('captchaQuestion').dataset.answer;
                
                if (captchaInput.value !== correctAnswer) {
                    e.preventDefault();
                    window.Toast.show('Неверный ответ на CAPTCHA', 'error');
                    updateCaptcha();
                    captchaInput.value = '';
                    captchaInput.focus();
                }
            });
        }
    },

    // Обработка входа через Google
    handleGoogleLogin: async (e) => {
        e.preventDefault();
        
        const button = e.target.closest('button');
        const originalText = button.innerHTML;
        
        // Показ загрузки
        button.innerHTML = '<div class="auth-loader"></div> Подключение к Google...';
        button.disabled = true;

        try {
            // Имитация запроса к Google OAuth
            await window.Utils.delay(1500);
            
            // В реальном приложении здесь был бы реальный OAuth flow
            // Для демонстрации создаем тестового пользователя
            const user = {
                id: window.Utils.generateId(),
                email: 'user@gmail.com',
                username: 'Google User',
                avatar: 'https://ui-avatars.com/api/?name=Google+User&background=6d28d9&color=fff',
                provider: 'google',
                createdAt: new Date().toISOString()
            };

            AuthSystem.login(user);
            window.Toast.show('Вход через Google выполнен успешно', 'success');
            
        } catch (error) {
            console.error('Ошибка входа через Google:', error);
            window.Toast.show('Ошибка входа через Google', 'error');
        } finally {
            // Восстановление кнопки
            button.innerHTML = originalText;
            button.disabled = false;
        }
    },

    // Обработка входа по email
    handleEmailLogin: async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Валидация
        if (!window.Utils.validateEmail(email)) {
            window.Toast.show('Введите корректный email', 'error');
            return;
        }

        if (password.length < 6) {
            window.Toast.show('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }

        // Поиск пользователя
        const users = JSON.parse(localStorage.getItem('nn_users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            window.Toast.show('Пользователь не найден', 'error');
            return;
        }

        // Проверка пароля (в реальном приложении должно быть сравнение хешей)
        if (password !== user.password) {
            window.Toast.show('Неверный пароль', 'error');
            return;
        }

        // Вход в систему
        AuthSystem.login(user);
        window.Toast.show('Вход выполнен успешно', 'success');
        
        // Сохранение "Запомнить меня"
        if (rememberMe) {
            localStorage.setItem('nn_remember', 'true');
        }
    },

    // Обработка шага 1 регистрации (Email)
    handleEmailStep: async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('registerEmail').value;
        
        if (!window.Utils.validateEmail(email)) {
            window.Toast.show('Введите корректный email', 'error');
            return;
        }

        // Проверка, не занят ли email
        const users = JSON.parse(localStorage.getItem('nn_users') || '[]');
        if (users.some(u => u.email === email)) {
            window.Toast.show('Этот email уже используется', 'error');
            return;
        }

        // Сохранение email в состоянии регистрации
        AuthSystem.registrationState.email = email;

        // Имитация отправки кода
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        const originalText = sendCodeBtn.innerHTML;
        
        sendCodeBtn.innerHTML = '<div class="auth-loader"></div> Отправка...';
        sendCodeBtn.disabled = true;

        try {
            await window.Utils.delay(1000);
            
            // Генерация кода подтверждения
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            AuthSystem.registrationState.verificationCode = code;
            
            // В реальном приложении здесь была бы отправка email
            console.log('Код подтверждения:', code); // Для демонстрации
            
            // Переход к следующему шагу
            AuthSystem.goToRegistrationStep(2);
            
            // Запуск таймера
            AuthSystem.startVerificationTimer();
            
            window.Toast.show('Код подтверждения отправлен на email', 'success');
            
        } catch (error) {
            window.Toast.show('Ошибка отправки кода', 'error');
        } finally {
            sendCodeBtn.innerHTML = originalText;
            sendCodeBtn.disabled = false;
        }
    },

    // Обработка шага 2 регистрации (Код подтверждения)
    handleCodeStep: async (e) => {
        e.preventDefault();
        
        // Получение введенного кода
        const codeInputs = document.querySelectorAll('.code-input');
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        
        if (enteredCode.length !== 6) {
            window.Toast.show('Введите полный 6-значный код', 'error');
            return;
        }

        if (enteredCode !== AuthSystem.registrationState.verificationCode) {
            window.Toast.show('Неверный код подтверждения', 'error');
            
            // Анимация ошибки
            codeInputs.forEach(input => {
                input.style.borderColor = 'var(--danger)';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 1000);
            });
            
            return;
        }

        // Очистка таймера
        if (AuthSystem.registrationState.timer) {
            clearInterval(AuthSystem.registrationState.timer);
        }

        // Переход к следующему шагу
        AuthSystem.goToRegistrationStep(3);
        window.Toast.show('Код подтвержден', 'success');
    },

    // Обработка шага 3 регистрации (Данные аккаунта)
    handleFinalStep: async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Валидация
        if (username.length < 3) {
            window.Toast.show('Имя пользователя должно содержать минимум 3 символа', 'error');
            return;
        }

        if (!username.match(/^[a-zA-Z0-9_]+$/)) {
            window.Toast.show('Имя пользователя может содержать только буквы, цифры и подчеркивания', 'error');
            return;
        }

        // Проверка доступности имени пользователя
        const users = JSON.parse(localStorage.getItem('nn_users') || '[]');
        if (users.some(u => u.username === username)) {
            window.Toast.show('Это имя пользователя уже занято', 'error');
            return;
        }

        const passwordStrength = window.Utils.checkPasswordStrength(password);
        if (passwordStrength.strength === 'weak') {
            window.Toast.show('Пароль слишком слабый', 'error');
            return;
        }

        if (password !== confirmPassword) {
            window.Toast.show('Пароли не совпадают', 'error');
            return;
        }

        if (!agreeTerms) {
            window.Toast.show('Необходимо принять условия использования', 'error');
            return;
        }

        // Создание пользователя
        const user = {
            id: window.Utils.generateId(),
            email: AuthSystem.registrationState.email,
            username: username,
            password: password, // В реальном приложении здесь должен быть хеш
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Сохранение пользователя
        users.push(user);
        localStorage.setItem('nn_users', JSON.stringify(users));

        // Вход в систему
        AuthSystem.login(user);
        
        // Показ экрана успешной регистрации
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('successScreen').style.display = 'block';
        
        // Заполнение данных аккаунта
        document.getElementById('generatedUsername').textContent = username;
        document.getElementById('generatedPassword').textContent = password;
        
        window.Toast.show('Регистрация завершена успешно', 'success');
    },

    // Переход между шагами регистрации
    goToRegistrationStep: (step) => {
        // Обновление состояния
        AuthSystem.registrationState.step = step;

        // Обновление визуального отображения шагов
        document.querySelectorAll('.step').forEach(stepEl => {
            const stepNumber = parseInt(stepEl.dataset.step);
            stepEl.classList.toggle('active', stepNumber <= step);
        });

        // Показ соответствующего шага
        document.querySelectorAll('.registration-step').forEach(stepEl => {
            const stepNumber = parseInt(stepEl.dataset.step);
            stepEl.classList.toggle('active', stepNumber === step);
        });
    },

    // Запуск таймера подтверждения
    startVerificationTimer: () => {
        AuthSystem.registrationState.timeLeft = 120;
        
        const timerElement = document.getElementById('timer');
        const resendBtn = document.getElementById('resendCode');
        
        if (resendBtn) {
            resendBtn.disabled = true;
        }

        AuthSystem.registrationState.timer = setInterval(() => {
            AuthSystem.registrationState.timeLeft--;
            
            if (timerElement) {
                const minutes = Math.floor(AuthSystem.registrationState.timeLeft / 60);
                const seconds = AuthSystem.registrationState.timeLeft % 60;
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            if (AuthSystem.registrationState.timeLeft <= 0) {
                clearInterval(AuthSystem.registrationState.timer);
                if (resendBtn) {
                    resendBtn.disabled = false;
                }
                if (timerElement) {
                    timerElement.textContent = '00:00';
                }
            }
        }, 1000);
    },

    // Повторная отправка кода подтверждения
    resendVerificationCode: async () => {
        const resendBtn = document.getElementById('resendCode');
        const originalText = resendBtn.innerHTML;
        
        resendBtn.innerHTML = '<div class="auth-loader"></div> Отправка...';
        resendBtn.disabled = true;

        try {
            await window.Utils.delay(1000);
            
            // Генерация нового кода
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            AuthSystem.registrationState.verificationCode = code;
            
            // Перезапуск таймера
            if (AuthSystem.registrationState.timer) {
                clearInterval(AuthSystem.registrationState.timer);
            }
            AuthSystem.startVerificationTimer();
            
            window.Toast.show('Новый код отправлен', 'success');
            
        } catch (error) {
            window.Toast.show('Ошибка отправки кода', 'error');
        } finally {
            resendBtn.innerHTML = originalText;
            resendBtn.disabled = false;
        }
    },

    // Проверка силы пароля
    checkPasswordStrength: (e) => {
        const password = e.target.value;
        const strength = window.Utils.checkPasswordStrength(password);
        
        // Обновление индикатора
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.getElementById('strengthText');
        
        if (strengthBar && strengthText) {
            const width = (strength.score / 5) * 100;
            strengthBar.style.width = `${width}%`;
            
            let color, text;
            switch(strength.strength) {
                case 'weak':
                    color = 'var(--danger)';
                    text = 'Слабый';
                    break;
                case 'medium':
                    color = 'var(--warning)';
                    text = 'Средний';
                    break;
                case 'strong':
                    color = 'var(--success)';
                    text = 'Сильный';
                    break;
            }
            
            strengthBar.style.background = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        }
        
        // Обновление требований
        const requirements = document.querySelectorAll('.password-requirements li');
        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            if (strength.requirements[requirement]) {
                req.classList.add('met');
            } else {
                req.classList.remove('met');
            }
        });
    },

    // Проверка совпадения паролей
    checkPasswordMatch: (e) => {
        const password = document.getElementById('password').value;
        const confirmPassword = e.target.value;
        const feedback = document.getElementById('confirmFeedback');
        
        if (!feedback) return;
        
        if (!confirmPassword) {
            feedback.textContent = '';
            feedback.className = 'input-feedback';
            return;
        }
        
        if (password === confirmPassword) {
            feedback.textContent = 'Пароли совпадают';
            feedback.className = 'input-feedback success';
        } else {
            feedback.textContent = 'Пароли не совпадают';
            feedback.className = 'input-feedback error';
        }
    },

    // Проверка доступности имени пользователя
    checkUsernameAvailability: (e) => {
        const username = e.target.value;
        const feedback = document.getElementById('usernameFeedback');
        
        if (!feedback) return;
        
        if (!username) {
            feedback.textContent = '';
            feedback.className = 'input-feedback';
            return;
        }
        
        if (username.length < 3) {
            feedback.textContent = 'Минимум 3 символа';
            feedback.className = 'input-feedback error';
            return;
        }
        
        if (!username.match(/^[a-zA-Z0-9_]+$/)) {
            feedback.textContent = 'Только буквы, цифры и подчеркивания';
            feedback.className = 'input-feedback error';
            return;
        }
        
        // Проверка в базе данных
        const users = JSON.parse(localStorage.getItem('nn_users') || '[]');
        const isTaken = users.some(u => u.username === username);
        
        if (isTaken) {
            feedback.textContent = 'Имя пользователя занято';
            feedback.className = 'input-feedback error';
        } else {
            feedback.textContent = 'Имя пользователя доступно';
            feedback.className = 'input-feedback success';
        }
    },

    // Переключение между вкладками авторизации
    switchAuthTab: (tabId) => {
        // Обновление активной вкладки
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Показ соответствующей формы
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabId}Form`);
        });
        
        // Сброс состояния регистрации при переключении
        if (tabId === 'register') {
            AuthSystem.registrationState = {
                email: '',
                verificationCode: '',
                step: 1,
                timer: null,
                timeLeft: 120
            };
            AuthSystem.goToRegistrationStep(1);
        }
    },

    // Обработка "Забыли пароль"
    handleForgotPassword: (e) => {
        e.preventDefault();
        window.Modal.open('recoveryModal');
        
        // Обработка восстановления
        const sendRecoveryBtn = document.getElementById('sendRecovery');
        const cancelRecoveryBtn = document.getElementById('cancelRecovery');
        const recoveryEmailInput = document.getElementById('recoveryEmail');
        
        if (sendRecoveryBtn) {
            sendRecoveryBtn.addEventListener('click', async () => {
                const email = recoveryEmailInput.value;
                
                if (!window.Utils.validateEmail(email)) {
                    window.Toast.show('Введите корректный email', 'error');
                    return;
                }
                
                // Имитация отправки письма восстановления
                sendRecoveryBtn.innerHTML = '<div class="auth-loader"></div> Отправка...';
                sendRecoveryBtn.disabled = true;
                
                try {
                    await window.Utils.delay(1500);
                    window.Modal.close();
                    window.Toast.show('Инструкция по восстановлению отправлена на email', 'success');
                } catch (error) {
                    window.Toast.show('Ошибка отправки инструкции', 'error');
                } finally {
                    sendRecoveryBtn.innerHTML = 'Отправить';
                    sendRecoveryBtn.disabled = false;
                }
            });
        }
        
        if (cancelRecoveryBtn) {
            cancelRecoveryBtn.addEventListener('click', window.Modal.close);
        }
    },

    // Вход пользователя
    login: (user) => {
        AuthSystem.currentUser = user;
        
        // Сохранение в localStorage
        localStorage.setItem(window.NN.config.USER_KEY, JSON.stringify(user));
        
        // Обновление времени последнего входа
        user.lastLogin = new Date().toISOString();
        
        // Перенаправление на страницу настроек через 1 секунду
        setTimeout(() => {
            window.location.href = 'settings.html';
        }, 1000);
    },

    // Выход пользователя
    logout: () => {
        AuthSystem.currentUser = null;
        localStorage.removeItem(window.NN.config.USER_KEY);
        window.Toast.show('Вы вышли из системы', 'success');
        
        // Перенаправление на главную через 1 секунду
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    // Проверка авторизации
    isLoggedIn: () => {
        return AuthSystem.currentUser !== null;
    },

    // Получение текущего пользователя
    getUser: () => {
        return AuthSystem.currentUser;
    },

    // Перенаправление в профиль
    redirectToProfile: () => {
        if (window.location.pathname.includes('auth.html')) {
            window.location.href = 'settings.html';
        }
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    AuthSystem.init();
});

// Экспорт функций
window.AuthSystem = AuthSystem;