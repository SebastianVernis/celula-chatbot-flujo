/**
 * YouTube Facade Pattern
 * Carga thumbnails ligeras en lugar de iframes pesados
 * Ahorro: ~1.5MB por video = ~4.5MB total en carga inicial
 */

class YouTubeFacade {
    constructor(videoId, title, container) {
        this.videoId = videoId;
        this.title = title;
        this.container = container;
        this.activated = false;
        
        this.render();
    }

    render() {
        // Crear estructura HTML con thumbnail
        this.container.innerHTML = `
            <div class="youtube-facade" data-video-id="${this.videoId}">
                <img 
                    src="https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg"
                    alt="${this.title}"
                    class="youtube-facade__thumbnail"
                    loading="lazy"
                    decoding="async"
                >
                <button 
                    class="youtube-facade__play-button" 
                    aria-label="Reproducir ${this.title}"
                    type="button"
                >
                    <svg viewBox="0 0 68 48" width="68" height="48">
                        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                    </svg>
                </button>
            </div>
        `;

        // Agregar event listener
        const playButton = this.container.querySelector('.youtube-facade__play-button');
        playButton.addEventListener('click', () => this.activate());
    }

    activate() {
        if (this.activated) return;
        
        this.activated = true;
        
        // Reemplazar con iframe real
        this.container.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${this.videoId}?autoplay=1&rel=0&showinfo=0"
                title="${this.title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
            ></iframe>
        `;
    }
}

// Estilos CSS para el facade
const facadeStyles = `
<style>
.youtube-facade {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    cursor: pointer;
    overflow: hidden;
}

.youtube-facade__thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.youtube-facade:hover .youtube-facade__thumbnail {
    transform: scale(1.05);
}

.youtube-facade__play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 68px;
    height: 48px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0.9;
    padding: 0;
}

.youtube-facade__play-button:hover {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
}

.youtube-facade__play-button:focus {
    outline: 2px solid #fbe649;
    outline-offset: 4px;
}

.youtube-facade__play-button svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}
</style>
`;

// Inyectar estilos si no existen
if (!document.getElementById('youtube-facade-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'youtube-facade-styles';
    styleElement.innerHTML = facadeStyles;
    document.head.appendChild(styleElement.firstElementChild);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeFacade;
}
