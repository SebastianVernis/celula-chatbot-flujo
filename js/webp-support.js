/**
 * WebP Support Detection and Fallback
 * Detecta soporte de WebP y carga la imagen apropiada
 */

(function() {
    'use strict';

    // Detectar soporte de WebP
    function supportsWebP() {
        const elem = document.createElement('canvas');
        
        if (elem.getContext && elem.getContext('2d')) {
            // was able or not to get WebP representation
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        
        return false;
    }

    // Agregar clase al HTML para CSS
    if (supportsWebP()) {
        document.documentElement.classList.add('webp');
        console.log('✅ WebP soportado');
    } else {
        document.documentElement.classList.add('no-webp');
        console.log('ℹ️  WebP no soportado, usando JPG fallback');
    }

    // Helper function para crear picture element
    window.createResponsivePicture = function(imagePath, alt, sizes = '100vw') {
        const basePath = imagePath.replace(/\.[^/.]+$/, ''); // Remove extension
        const ext = imagePath.split('.').pop();
        
        return `
            <picture>
                <source 
                    type="image/webp" 
                    srcset="${basePath}.webp"
                    sizes="${sizes}">
                <source 
                    type="image/${ext}" 
                    srcset="${imagePath}"
                    sizes="${sizes}">
                <img 
                    src="${imagePath}" 
                    alt="${alt}"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600">
            </picture>
        `;
    };

    // Auto-replace img tags con picture (opcional)
    function autoReplaceImages() {
        const images = document.querySelectorAll('img[data-webp]');
        
        images.forEach(img => {
            const webpSrc = img.dataset.webp;
            const jpgSrc = img.src;
            const alt = img.alt || '';
            
            const picture = document.createElement('picture');
            
            // WebP source
            const webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.srcset = webpSrc;
            
            // JPG source (fallback)
            const jpgSource = document.createElement('source');
            jpgSource.type = 'image/jpeg';
            jpgSource.srcset = jpgSrc;
            
            // IMG element
            const newImg = img.cloneNode(true);
            newImg.removeAttribute('data-webp');
            
            // Construir picture
            picture.appendChild(webpSource);
            picture.appendChild(jpgSource);
            picture.appendChild(newImg);
            
            // Reemplazar
            img.parentNode.replaceChild(picture, img);
        });
        
        if (images.length > 0) {
            console.log(`✅ ${images.length} imágenes convertidas a <picture> con WebP`);
        }
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoReplaceImages);
    } else {
        autoReplaceImages();
    }
})();
