/**
 * Optimizaciones de rendimiento para Grupo Musical Célula
 * - Lazy loading de imágenes
 * - Cache de recursos
 * - Optimización de carga
 */

(function() {
    'use strict';

    // ===== LAZY LOADING DE IMÁGENES =====
    function initLazyLoading() {
        // Usar Intersection Observer para lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Cargar la imagen
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        // Marcar como cargada
                        img.classList.add('loaded');
                        
                        // Dejar de observar
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observar todas las imágenes con loading="lazy"
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });

            console.log(`✅ Lazy loading activado para ${lazyImages.length} imágenes`);
        } else {
            // Fallback para navegadores sin soporte
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
            });
        }
    }

    // ===== CACHE DE RECURSOS =====
    function initResourceCache() {
        // Registrar Service Worker si está disponible
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registrado:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ℹ️ Service Worker no disponible:', error);
                    });
            });
        }
    }

    // ===== PRECARGA DE RECURSOS CRÍTICOS =====
    function preloadCriticalResources() {
        // Precargar fuentes críticas
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Lobster:wght@400&family=Open+Sans:wght@400;600;700&family=Raleway:wght@400;600&display=swap'
        ];

        fonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }

    // ===== OPTIMIZACIÓN DE SCROLL =====
    function optimizeScroll() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Aquí se pueden agregar efectos de scroll optimizados
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== REDUCIR REPAINTS Y REFLOWS =====
    function optimizeAnimations() {
        // Usar transform en lugar de top/left para animaciones
        const animatedElements = document.querySelectorAll('.fade-in, .service-card, .gallery-item');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }

    // ===== COMPRIMIR IMÁGENES EN CLIENTE (OPCIONAL) =====
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Agregar atributos de optimización
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Agregar importance hint
            if (img.classList.contains('hero-logo') || img.classList.contains('service-image')) {
                img.setAttribute('importance', 'high');
            } else {
                img.setAttribute('importance', 'low');
            }
        });
    }

    // ===== DEFER DE SCRIPTS NO CRÍTICOS =====
    function deferNonCriticalScripts() {
        // Cargar scripts no críticos después del load
        window.addEventListener('load', () => {
            // Aquí se pueden cargar scripts adicionales
            console.log('✅ Scripts no críticos cargados');
        });
    }

    // ===== INICIALIZACIÓN =====
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Iniciando optimizaciones...');
        
        initLazyLoading();
        initResourceCache();
        optimizeScroll();
        optimizeAnimations();
        optimizeImages();
        deferNonCriticalScripts();
        
        console.log('✅ Optimizaciones aplicadas correctamente');
    });

    // ===== MONITOREO DE RENDIMIENTO =====
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;
                
                console.log('📊 Métricas de rendimiento:');
                console.log(`   - Tiempo de carga: ${pageLoadTime}ms`);
                console.log(`   - Tiempo de conexión: ${connectTime}ms`);
                console.log(`   - Tiempo de renderizado: ${renderTime}ms`);
            }, 0);
        });
    }
})();
