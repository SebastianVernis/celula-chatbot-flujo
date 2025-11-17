/**
 * Grupo Musical Célula - Persistent Video Background Module
 * Componente para video de fondo persistente entre sesiones y páginas
 */

class PersistentVideoBackground {
    constructor(options = {}) {
        this.options = {
            videoSrc: options.videoSrc || 'assets/video/background-video.mp4',
            fallbackImage: options.fallbackImage || 'assets/images/hero-background.jpg',
            selector: options.selector || '.persistent-video-bg',
            mobileBreakpoint: options.mobileBreakpoint || 768,
            volume: options.volume || 0,
            loop: options.loop !== false, // default to true
            muted: options.muted !== false, // default to true
            overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.5)',
            ...options
        };

        // Normalize paths to ensure they work from any page
        if (!this.options.videoSrc.startsWith('http') && !this.options.videoSrc.startsWith('/')) {
            this.options.videoSrc = this.normalizePath(this.options.videoSrc);
        }
        if (!this.options.fallbackImage.startsWith('http') && !this.options.fallbackImage.startsWith('/')) {
            this.options.fallbackImage = this.normalizePath(this.options.fallbackImage);
        }
        
        this.videoElement = null;
        this.container = null;
        this.isMobile = this.checkIsMobile();
        this.isVisible = true;

        this.init();
    }

    normalizePath(path) {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.substring(1).split('/');

        // If we're on the root, return the path as is
        if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
            return path;
        }

        // Count how many directory levels we're in
        let depth = pathParts.length - 1;

        // If we're on a file (like blog.html), subtract one more
        if (pathParts[pathParts.length - 1].includes('.')) {
            depth--;
        }

        // Build relative path prefix
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }

        return prefix + path;
    }
    
    checkIsMobile() {
        return window.innerWidth <= this.options.mobileBreakpoint || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        this.createVideoBackground();
        this.setupEventListeners();
        this.applyVideoBackground();
    }
    
    createVideoBackground() {
        // Create the video container element
        this.container = document.createElement('div');
        this.container.className = 'persistent-video-container';
        
        // Create the video element
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.muted = this.options.muted;
        this.videoElement.loop = this.options.loop;
        this.videoElement.playsInline = true;
        this.videoElement.preload = 'auto';
        this.videoElement.volume = this.options.volume;
        this.videoElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1000;';
        
        // Create video source
        const sourceElement = document.createElement('source');
        sourceElement.src = this.options.videoSrc;
        sourceElement.type = 'video/mp4';
        
        this.videoElement.appendChild(sourceElement);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'persistent-video-overlay';
        
        // Add elements to container
        this.container.appendChild(this.videoElement);
        this.container.appendChild(overlay);
        
        // Add to the body at the very beginning
        if (document.body.firstChild) {
            document.body.insertBefore(this.container, document.body.firstChild);
        } else {
            document.body.appendChild(this.container);
        }
        
        // Add CSS styles for the video background
        this.addStyles();
        
        // Log for debugging
        console.log('Video background created with src:', this.options.videoSrc);
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.id = 'persistent-video-bg-styles';
        style.textContent = `
            .persistent-video-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 0;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
                pointer-events: none;
            }
            
            .persistent-video-container.active {
                opacity: 1;
            }
            
            .persistent-video-container video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                object-fit: cover;
                object-position: center;
                will-change: transform;
                pointer-events: none;
            }
            
            .persistent-video-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${this.options.overlayColor || 'rgba(0, 0, 0, 0.5)'};
                z-index: 2;
                pointer-events: none;
            }

            /* Ensure sections use transparent background to show video */
            .hero-section,
            .content-section,
            .banda-section,
            .videos-section,
            .site-container {
                background: transparent !important;
                position: relative;
                z-index: 10;
            }
            
            /* Ensure header is above video */
            header, nav, .site-header {
                z-index: 100 !important;
            }

            /* Mobile-specific optimizations */
            @media (max-width: ${this.options.mobileBreakpoint}px) {
                /* Show video on mobile but with performance considerations */
                .persistent-video-container {
                    /* Don't hide on mobile anymore */
                }

                /* Alternative background for mobile as fallback */
                .persistent-video-mobile-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url(${this.options.fallbackImage}) center/cover no-repeat;
                    background-attachment: fixed;
                    z-index: -2;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                }

                .persistent-video-mobile-bg.active {
                    opacity: 1;
                }

                /* Mobile-specific video styling */
                .persistent-video-container video {
                    /* Use more efficient rendering on mobile */
                    -webkit-transform: translateZ(0);
                    -moz-transform: translateZ(0);
                    -ms-transform: translateZ(0);
                    transform: translateZ(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.isMobile = this.checkIsMobile();
            this.applyVideoBackground();
        });
        
        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseVideo();
            } else {
                if (this.isVisible) {
                    this.playVideo();
                }
            }
        });
    }
    
    applyVideoBackground() {
        if (this.isMobile) {
            // On mobile devices, try to show video but with performance considerations
            this.container.style.display = 'block';

            // Create mobile background if it doesn't exist (as fallback)
            let mobileBg = document.querySelector('.persistent-video-mobile-bg');
            if (!mobileBg) {
                mobileBg = document.createElement('div');
                mobileBg.className = 'persistent-video-mobile-bg';
                document.body.appendChild(mobileBg);
            }

            // Apply the fallback background as a CSS background
            mobileBg.style.background = `url(${this.options.fallbackImage}) center/cover no-repeat fixed`;

            // Show the video container with active class
            this.container.classList.add('active');
            mobileBg.classList.remove('active'); // Hide fallback since we're showing video

            // Check if video can play on mobile - some mobile browsers don't support autoplay
            this.checkMobileVideoPlayback();
        } else {
            // On desktop, show the video background
            document.querySelector('.persistent-video-mobile-bg')?.classList.remove('active');
            this.container.style.display = 'block';
            this.container.classList.add('active');
            
            // Try to play the video
            if (this.videoElement) {
                this.videoElement.play().catch(e => {
                    console.warn('Video playback prevented:', e);
                    this.setupPlayOnInteraction();
                });
            }
        }
        console.log('Video background applied. Mobile:', this.isMobile, 'Container active:', this.container.classList.contains('active'));
    }

    checkMobileVideoPlayback() {
        if (this.isMobile && this.videoElement) {
            // Try to play the video, and if it fails, fallback to the image background
            const playPromise = this.videoElement.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Video played successfully, hide fallback background
                    const mobileBg = document.querySelector('.persistent-video-mobile-bg');
                    if (mobileBg) {
                        mobileBg.classList.remove('active');
                    }
                }).catch(error => {
                    console.warn('Mobile video playback failed:', error);
                    // Video couldn't play, show fallback background
                    const mobileBg = document.querySelector('.persistent-video-mobile-bg');
                    if (mobileBg) {
                        mobileBg.classList.add('active');
                    }
                });
            }
        }
    }
    
    playVideo() {
        if (this.videoElement && !this.isMobile) {
            this.videoElement.play().catch(e => {
                console.warn('Video playback prevented:', e);
                // Try to play again on user interaction
                this.setupPlayOnInteraction();
            });
        }
    }
    
    pauseVideo() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }
    
    setupPlayOnInteraction() {
        const playOnInteraction = () => {
            this.videoElement.play().catch(e => console.warn('Still cannot play video:', e));
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
    }
    
    // Save state to localStorage to persist between sessions
    saveState() {
        const state = {
            timestamp: Date.now(),
            isVisible: this.isVisible,
            isMobile: this.isMobile
        };
        localStorage.setItem('persistentVideoBgState', JSON.stringify(state));
    }
    
    // Load state from localStorage
    loadState() {
        const state = localStorage.getItem('persistentVideoBgState');
        if (state) {
            try {
                const parsedState = JSON.parse(state);
                this.isVisible = parsedState.isVisible;
                // Don't restore mobile state, check current state instead
                this.isMobile = this.checkIsMobile();
                return true;
            } catch (e) {
                console.warn('Could not load video background state:', e);
                return false;
            }
        }
        return false;
    }
    
    // Method to toggle visibility
    toggleVisibility(show) {
        this.isVisible = show;
        if (show) {
            this.container.classList.add('active');
            if (!this.isMobile) this.playVideo();
        } else {
            this.container.classList.remove('active');
            this.pauseVideo();
        }
        this.saveState();
    }
    
    // Method to update video source
    updateVideoSource(newSrc) {
        if (this.videoElement) {
            this.options.videoSrc = newSrc;
            this.videoElement.querySelector('source').src = newSrc;
            this.videoElement.load();
            if (this.isVisible && !this.isMobile) {
                this.videoElement.play().catch(e => console.warn('Could not play updated video:', e));
            }
        }
    }
    
    // Destroy the video background component
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        const mobileBg = document.querySelector('.persistent-video-mobile-bg');
        if (mobileBg) {
            mobileBg.remove();
        }
        const styles = document.getElementById('persistent-video-bg-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Initialize the persistent video background when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Configuration options
    const videoBgConfig = {
        videoSrc: 'assets/video/background-video.mp4',
        fallbackImage: 'assets/images/hero-background.jpg',
        mobileBreakpoint: 768,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        muted: true,
        loop: true
    };
    
    // Only initialize if not already present
    if (!document.querySelector('.persistent-video-container')) {
        window.CelulaVideoBackground = new PersistentVideoBackground(videoBgConfig);
    }
    
    // Expose the class globally for advanced usage
    window.PersistentVideoBackgroundClass = PersistentVideoBackground;
});

// Also initialize when the page is loaded to ensure all resources are available
window.addEventListener('load', function() {
    if (window.CelulaVideoBackground) {
        // Try to play the video again once everything is loaded
        setTimeout(() => {
            window.CelulaVideoBackground.playVideo();
        }, 500);
    }
});