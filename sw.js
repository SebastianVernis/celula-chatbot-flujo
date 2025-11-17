/**
 * Service Worker para Grupo Musical Célula
 * Maneja el cache de recursos estáticos con estrategia optimizada
 * Versión: 2.0 - Optimizado para rendimiento
 */

const CACHE_NAME = 'celula-cache-v2';
const RUNTIME_CACHE = 'celula-runtime-v2';

// Recursos críticos para cache inmediato
const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/cotizador.html',
    '/css/styles.css',
    '/js/navigation.js',
    '/js/optimizations.js',
    '/js/youtube-carousel.js',
    '/js/webp-support.js',
    '/assets/logo/logo.jpg',
    '/assets/logo/logo.png'
];

// Recursos que se cachean bajo demanda
const RUNTIME_CACHE_URLS = [
    '/assets/gallery/',
    '/post/',
    '/js/',
    '/css/'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('🗑️ Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Tomar control inmediatamente
            return self.clients.claim();
        })
    );
});

// Interceptar peticiones con estrategia optimizada
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Estrategia: Cache First para assets estáticos
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'image' ||
        url.pathname.startsWith('/assets/')) {
        
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then(response => {
                    // Solo cachear respuestas exitosas
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Fallback para imágenes
                    if (request.destination === 'image') {
                        return caches.match('/assets/logo/logo.jpg');
                    }
                });
            })
        );
        return;
    }

    // Estrategia: Network First para HTML
    if (request.destination === 'document' || 
        url.pathname.endsWith('.html')) {
        
        event.respondWith(
            fetch(request).then(response => {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseToCache);
                });
                return response;
            }).catch(() => {
                return caches.match(request);
            })
        );
        return;
    }

    // Estrategia: Network Only para APIs y recursos externos
    if (url.origin !== location.origin) {
        event.respondWith(fetch(request));
        return;
    }

    // Default: Cache First con Network Fallback
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            return cachedResponse || fetch(request);
        })
    );
});
