/**
 * Galería Dinámica - Grupo Musical Célula
 * Gestiona la carga y visualización dinámica de imágenes de la galería
 */

document.addEventListener('DOMContentLoaded', function() {
    // Lista de imágenes de la galería (esto puede ser actualizado automáticamente)
    const galleryImages = [
        { src: 'assets/gallery/banda-1.jpg', alt: 'Grupo Musical La Célula en vivo', text: 'En vivo' },
        { src: 'assets/gallery/banda-2.jpg', alt: 'Presentación musical', text: 'Presentación' },
        { src: 'assets/gallery/banda-3.jpg', alt: 'Evento corporativo', text: 'Eventos' },
        { src: 'assets/gallery/banda-4.jpg', alt: 'Boda musical', text: 'Bodas' },
        { src: 'assets/gallery/banda-5.jpg', alt: 'Fiesta privada', text: 'Fiestas' },
        { src: 'assets/gallery/banda-6.jpg', alt: 'Espectáculo musical', text: 'Shows' },
        { src: 'assets/gallery/banda-7.jpg', alt: 'Grupo musical La Célula en el escenario', text: 'Escenario' },
        { src: 'assets/gallery/banda-8.jpg', alt: 'Grupo musical La Célula en concierto', text: 'Concierto' },
        { src: 'assets/gallery/banda-9.jpg', alt: 'Grupo musical La Célula actuando', text: 'Actuación' },
        { src: 'assets/gallery/banda-10.jpg', alt: 'Grupo musical La Célula en evento', text: 'Evento' },
        { src: 'assets/gallery/banda-11.jpg', alt: 'Grupo musical La Célula en desfile', text: 'Desfile' },
        { src: 'assets/gallery/banda-12.jpg', alt: 'Grupo musical La Célula grupo completo', text: 'Grupo' },
        { src: 'assets/gallery/banda-13.jpg', alt: 'Grupo musical La Célula con público', text: 'Público' },
        { src: 'assets/gallery/banda-14.jpg', alt: 'Grupo musical La Célula en actuación', text: 'Actuación' },
        { src: 'assets/gallery/banda-15.jpg', alt: 'Grupo musical La Célula en boda', text: 'Boda' },
        { src: 'assets/gallery/banda-16.jpg', alt: 'Grupo musical La Célula en fiesta', text: 'Fiesta' },
        { src: 'assets/gallery/banda-17.jpg', alt: 'Grupo musical La Célula en show', text: 'Show' },
        { src: 'assets/gallery/banda-18.jpg', alt: 'Grupo musical La Célula en presentación', text: 'Presentación' },
        { src: 'assets/gallery/banda-19.jpg', alt: 'Grupo musical La Célula en evento corporativo', text: 'Corporativo' },
        { src: 'assets/gallery/banda-20.jpg', alt: 'Grupo musical La Célula en aniversario', text: 'Aniversario' },
        { src: 'assets/gallery/banda-21.jpg', alt: 'Grupo Musical La Célula en XV años', text: 'XV años' },
        { src: 'assets/gallery/banda-22.jpg', alt: 'Grupo musical La Célula en graduación', text: 'Graduación' },
        { src: 'assets/gallery/banda-23.jpg', alt: 'Grupo musical La Célula en evento social', text: 'Social' },
        { src: 'assets/gallery/banda-24.jpg', alt: 'Grupo musical La Célula en concierto al aire libre', text: 'Aire libre' },
        { src: 'assets/gallery/banda-25.jpg', alt: 'Grupo musical La Célula en evento privado', text: 'Privado' },
        { src: 'assets/gallery/banda-26.jpg', alt: 'Grupo musical La Célula en festival', text: 'Festival' },
        { src: 'assets/gallery/banda-27.jpg', alt: 'Grupo musical La Célula en bar', text: 'Bar' },
        { src: 'assets/gallery/banda-28.jpg', alt: 'Grupo musical La Célula en club', text: 'Club' },
        { src: 'assets/gallery/banda-29.jpg', alt: 'Grupo musical La Célula en teatro', text: 'Teatro' },
        { src: 'assets/gallery/banda-30.jpg', alt: 'Grupo musical La Célula en hotel', text: 'Hotel' },
        { src: 'assets/gallery/banda-31.jpg', alt: 'Grupo musical La Célula en restaurante', text: 'Restaurante' },
        { src: 'assets/gallery/banda-32.jpg', alt: 'Grupo musical La Célula en patio', text: 'Patio' },
        { src: 'assets/gallery/banda-33.jpg', alt: 'Grupo musical La Célula en jardín', text: 'Jardín' },
        { src: 'assets/gallery/banda-34.jpg', alt: 'Grupo musical La Célula en terraza', text: 'Terraza' },
        { src: 'assets/gallery/banda-35.jpg', alt: 'Grupo musical La Célula en balcón', text: 'Balcón' },
        { src: 'assets/gallery/banda-36.jpg', alt: 'Grupo musical La Célula en azotea', text: 'Azotea' },
        { src: 'assets/gallery/banda-37.jpg', alt: 'Grupo musical La Célula en salón', text: 'Salón' },
        { src: 'assets/gallery/banda-38.jpg', alt: 'Grupo musical La Célula en explanada', text: 'Explanada' },
        { src: 'assets/gallery/banda-39.jpg', alt: 'Grupo musical La Célula en explanación', text: 'Explanación' },
        { src: 'assets/gallery/banda-40.jpg', alt: 'Grupo musical La Célula en explanada abierta', text: 'Explanada Abierta' },
        { src: 'assets/gallery/banda-41.jpg', alt: 'Grupo musical La Célula en explanada techada', text: 'Explanada Techada' },
        { src: 'assets/gallery/banda-42.jpg', alt: 'Grupo musical La Célula en explanada techada 2', text: 'Techada 2' },
        { src: 'assets/gallery/banda-43.jpg', alt: 'Grupo musical La Célula en explanada techada 3', text: 'Techada 3' },
        { src: 'assets/gallery/banda-44.jpg', alt: 'Grupo musical La Célula en explanada techada 4', text: 'Techada 4' },
        { src: 'assets/gallery/banda-45.jpg', alt: 'Grupo musical La Célula en explanada techada 5', text: 'Techada 5' },
        { src: 'assets/gallery/banda-46.jpg', alt: 'Grupo musical La Célula en explanada techada 6', text: 'Techada 6' },
        { src: 'assets/gallery/banda-47.jpg', alt: 'Grupo musical La Célula en explanada techada 7', text: 'Techada 7' },
        { src: 'assets/gallery/banda-48.jpg', alt: 'Grupo musical La Célula en explanada techada 8', text: 'Techada 8' },
        { src: 'assets/gallery/banda-49.jpg', alt: 'Grupo musical La Célula en explanada techada 9', text: 'Techada 9' },
        { src: 'assets/gallery/banda-50.jpg', alt: 'Grupo musical La Célula en explanada techada 10', text: 'Techada 10' },
        { src: 'assets/gallery/banda-51.jpg', alt: 'Grupo musical La Célula en cierre de evento', text: 'Cierre' }
    ];

    // Función para crear un elemento de galería
    function createGalleryItem(imageData) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.alt}" class="gallery-image">
            <div class="gallery-overlay">
                <span class="gallery-text">${imageData.text}</span>
            </div>
        `;
        return item;
    }

    // Actualizar la galería dinámicamente
    function updateGallery() {
        const carousel = document.getElementById('galleryCarousel');
        if (!carousel) return;

        // Limpiar el carrusel
        carousel.innerHTML = '';

        // Agregar las imágenes dinámicamente
        galleryImages.forEach(image => {
            const galleryItem = createGalleryItem(image);
            carousel.appendChild(galleryItem);
        });

        // Re-inicializar la funcionalidad del carrusel si existe
        if (window.CelulaNavigation && typeof window.CelulaNavigation.initGalleryCarousel === 'function') {
            // Si el carrusel ya tiene funcionalidad, la reejecutamos
            setTimeout(() => {
                initCarousel();
            }, 100);
        }
    }

    // Inicializar el carrusel
    function initCarousel() {
        const carousel = document.getElementById('galleryCarousel');
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');

        if (!carousel || !prevBtn || !nextBtn) return;

        const items = carousel.querySelectorAll('.gallery-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        let itemsToShow = 1;
        let itemsToScroll = 1;

        // Ajustar cantidades según el tamaño de pantalla
        const updateItemsToShow = () => {
            if (window.innerWidth > 768) {
                itemsToShow = 3;
                itemsToScroll = 3;
            } else {
                itemsToShow = 1;
                itemsToScroll = 1;
            }
        };

        const updateCarousel = () => {
            const containerWidth = carousel.parentElement.clientWidth;
            const totalMargin = (itemsToShow - 1) * 20;
            const itemWidth = (containerWidth - totalMargin) / itemsToShow;

            // Set width for each item
            items.forEach(item => {
                item.style.flex = `0 0 ${itemWidth}px`;
            });

            // Ajustar el ancho total del carrusel
            carousel.style.width = `${items.length * (itemWidth + 20)}px`;

            carousel.style.transform = `translateX(-${currentIndex * (itemWidth + 20)}px)`;
            carousel.style.transition = 'transform 0.3s ease';
        };

        const nextSlide = () => {
            const containerWidth = carousel.parentElement.clientWidth;
            const totalMargin = (itemsToShow - 1) * 20;
            const itemWidth = (containerWidth - totalMargin) / itemsToShow;
            const maxIndex = Math.max(0, items.length - itemsToShow);

            if (currentIndex < maxIndex) {
                currentIndex++;
                carousel.style.transform = `translateX(-${currentIndex * (itemWidth + 20)}px)`;
                carousel.style.transition = 'transform 0.3s ease';
            }
        };

        const prevSlide = () => {
            const containerWidth = carousel.parentElement.clientWidth;
            const totalMargin = (itemsToShow - 1) * 20;
            const itemWidth = (containerWidth - totalMargin) / itemsToShow;

            if (currentIndex > 0) {
                currentIndex--;
                carousel.style.transform = `translateX(-${currentIndex * (itemWidth + 20)}px)`;
                carousel.style.transition = 'transform 0.3s ease';
            }
        };

        // Inicializar el carrusel
        updateItemsToShow();
        updateCarousel();

        // Event listeners para los botones
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Actualizar cuando se cambia el tamaño de la ventana
        window.addEventListener('resize', function() {
            updateItemsToShow();
            const maxIndex = Math.max(0, items.length - itemsToShow);
            currentIndex = Math.min(currentIndex, maxIndex);
            updateCarousel();
        });
    }

    // Ejecutar la actualización de la galería cuando se haya cargado todo
    updateGallery();
});
