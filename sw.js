/**
 * Service Worker для NN Company
 * Обеспечивает офлайн-работу и кэширование
 */

const CACHE_NAME = 'nn-company-v1.0.5';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/settings.html',
    '/auth.html',
    '/css/style.css',
    '/css/settings.css',
    '/css/auth.css',
    '/js/main.js',
    '/js/settings.js',
    '/js/auth.js',
    '/manifest.json',
    '/favicon.ico',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/night-owl.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Установка');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Кэширование ресурсов');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Все ресурсы закэшированы');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Ошибка при кэшировании:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Активация');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Активирован');
            return self.clients.claim();
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
    // Пропускаем запросы к внешним API и аналитике
    if (event.request.url.includes('donationalerts.com') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('analytics')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем закэшированную версию, если она есть
                if (response) {
                    return response;
                }

                // Иначе делаем сетевой запрос
                return fetch(event.request)
                    .then((response) => {
                        // Проверяем, валидный ли ответ
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Клонируем ответ, так как он может быть использован только один раз
                        const responseToCache = response.clone();

                        // Кэшируем новый ресурс
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Офлайн-страница для HTML запросов
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Для других типов запросов можно вернуть заглушку
                        return new Response('Офлайн режим', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Фоновая синхронизация (если поддерживается)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Фоновая синхронизация:', event.tag);
    
    if (event.tag === 'sync-settings') {
        event.waitUntil(syncSettings());
    }
});

// Периодическая фоновая синхронизация
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Периодическая фоновая синхронизация:', event.tag);
    
    if (event.tag === 'update-content') {
        event.waitUntil(updateContent());
    }
});

// Функция синхронизации настроек
async function syncSettings() {
    console.log('[Service Worker] Синхронизация настроек');
    
    // Здесь можно добавить логику синхронизации с сервером
    try {
        const settings = localStorage.getItem('nn_settings');
        if (settings) {
            // Имитация отправки на сервер
            await fakeServerRequest('sync-settings', settings);
            console.log('[Service Worker] Настройки синхронизированы');
        }
    } catch (error) {
        console.error('[Service Worker] Ошибка синхронизации:', error);
    }
}

// Функция обновления контента
async function updateContent() {
    console.log('[Service Worker] Обновление контента');
    
    try {
        // Проверка обновлений
        const cache = await caches.open(CACHE_NAME);
        const requests = ASSETS_TO_CACHE.filter(url => !url.startsWith('https://'));
        
        for (const requestUrl of requests) {
            try {
                const networkResponse = await fetch(requestUrl);
                if (networkResponse.ok) {
                    await cache.put(requestUrl, networkResponse.clone());
                    console.log(`[Service Worker] Обновлен: ${requestUrl}`);
                }
            } catch (error) {
                console.warn(`[Service Worker] Не удалось обновить: ${requestUrl}`, error);
            }
        }
        
        // Отправка уведомления об обновлениях
        await sendUpdateNotification();
        
    } catch (error) {
        console.error('[Service Worker] Ошибка обновления контента:', error);
    }
}

// Отправка уведомления об обновлениях
async function sendUpdateNotification() {
    const clients = await self.clients.matchAll();
    
    if (clients && clients.length) {
        clients.forEach(client => {
            client.postMessage({
                type: 'CONTENT_UPDATED',
                message: 'Контент был обновлен в фоновом режиме'
            });
        });
    }
}

// Имитация запроса к серверу
async function fakeServerRequest(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[Service Worker] Запрос на ${endpoint} завершен`);
            resolve({ success: true });
        }, 1000);
    });
}

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push уведомление получено');
    
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const title = data.title || 'NN Company';
    const options = {
        body: data.body || 'Новое уведомление',
        icon: '/img/icon-192.png',
        badge: '/img/icon-96.png',
        tag: data.tag || 'general',
        data: data.data || {},
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Клик по уведомлению');
    
    event.notification.close();
    
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((clientList) => {
            // Проверяем, есть ли уже открытая вкладка
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Если нет, открываем новую вкладку
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Обработка закрытия уведомлений
self.addEventListener('notificationclose', (event) => {
    console.log('[Service Worker] Уведомление закрыто');
    
    // Здесь можно отправлять аналитику о закрытии уведомлений
    const notification = event.notification;
    const data = notification.data || {};
    
    // Имитация отправки аналитики
    fakeServerRequest('notification-analytics', {
        action: 'closed',
        tag: notification.tag,
        data: data
    });
});