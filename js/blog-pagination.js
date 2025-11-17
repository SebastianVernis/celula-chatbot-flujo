        document.addEventListener('DOMContentLoaded', function() {
            // Configuración de paginación dinámica para posts
            const postsPerPage = 6;

            // Lista de posts (se puede actualizar automáticamente cuando se agregan nuevos posts)
            const blogPosts = [
                {
                    id: 'post-32',
                    title: 'Tu Tranquilidad no Tiene Precio: Por Qué Siempre Debes Firmar un Contrato',
                    excerpt: 'Firmar un contrato al contratar una banda asegura tranquilidad y evita problemas. Grupo Musical Versátil La Célula explica su importancia.',
                    date: '14 nov 2025',
                    image: 'assets/gallery/banda-1.jpg',
                    url: 'post/post-32.html'
                },
                {
                    id: 'post-31',
                    title: 'Lo que Nuestros Clientes Dicen de Nosotros: Historias de Eventos Inolvidables',
                    excerpt: 'Descubre testimonios reales de clientes que vivieron eventos inolvidables con Grupo Musical Versátil La Célula.',
                    date: '11 nov 2025',
                    image: 'assets/gallery/banda-2.jpg',
                    url: 'post/post-31.html'
                },
                {
                    id: 'post-30',
                    title: 'Dale un Toque Especial a tu Posada: El Poder de la Música en Vivo',
                    excerpt: 'Convierte tu posada en un evento inolvidable con música en vivo. Grupo Musical Versátil La Célula ofrece el repertorio perfecto para celebrar.',
                    date: '08 nov 2025',
                    image: 'assets/gallery/banda-3.jpg',
                    url: 'post/post-30.html'
                },
                {
                    id: 'post-29',
                    title: 'Propósitos para 2026: ¡Hacer Eventos Más Memorables!',
                    excerpt: 'Comienza el 2026 con el propósito de crear eventos inolvidables. Grupo Musical Versátil La Célula te ayuda a lograrlo con música en vivo.',
                    date: '05 nov 2025',
                    image: 'assets/gallery/banda-4.jpg',
                    url: 'post/post-29.html'
                },
                {
                    id: 'post-28',
                    title: 'Grupo Musical vs. Rockola Digital: ¿Cuál es Mejor para tu Fiesta?',
                    excerpt: '¿Grupo musical o rockola digital? Descubre cuál es mejor para tu fiesta y por qué Grupo Musical Versátil La Célula ofrece una experiencia insuperable.',
                    date: '02 nov 2025',
                    image: 'assets/gallery/banda-5.jpg',
                    url: 'post/post-28.html'
                },
                {
                    id: 'post-27',
                    title: 'Cómo la Música en Vivo Puede Potenciar el Lanzamiento de tu Producto',
                    excerpt: 'Descubre cómo la música en vivo en tu evento de lanzamiento puede aumentar el impacto de tu marca. Grupo Musical Versátil La Célula crea experiencias memorables.',
                    date: '30 oct 2025',
                    image: 'assets/gallery/banda-6.jpg',
                    url: 'post/post-27.html'
                },
                {
                    id: 'post-26',
                    title: '3 Maneras de Romper el Hielo y Animar tu Evento Corporativo con Música',
                    excerpt: 'Descubre 3 maneras efectivas de animar tu evento corporativo con música en vivo. Grupo Musical Versátil La Célula sabe cómo crear el ambiente ideal.',
                    date: '27 oct 2025',
                    image: 'assets/gallery/banda-7.jpg',
                    url: 'post/post-26.html'
                },
                {
                    id: 'post-25',
                    title: 'Guía de Proveedores: Planeando una Boda en el Área Metropolitana',
                    excerpt: 'Descubre proveedores clave para organizar tu boda en el Área Metropolitana y cómo Grupo Musical Versátil La Célula aporta la música perfecta.',
                    date: '24 oct 2025',
                    image: 'assets/gallery/banda-8.jpg',
                    url: 'post/post-25.html'
                },
                {
                    id: 'post-24',
                    title: 'Los 5 Errores Más Comunes al Contratar Música para tu Evento (y Cómo Evitarlos)',
                    excerpt: 'Evita los errores más comunes al contratar música para tu evento. Descubre cómo Grupo Musical Versátil La Célula asegura una experiencia impecable.',
                    date: '21 oct 2025',
                    image: 'assets/gallery/banda-9.jpg',
                    url: 'post/post-24.html'
                },
                {
                    id: 'post-23',
                    title: 'Cómo Crear la Playlist Perfecta para tu Boda (y por qué es mejor dejarlo a un profesional)',
                    excerpt: 'Aprende a crear la playlist perfecta para tu boda y descubre por qué Grupo Musical Versátil La Célula puede llevarla a otro nivel con música en vivo.',
                    date: '18 oct 2025',
                    image: 'assets/gallery/banda-10.jpg',
                    url: 'post/post-23.html'
                },
                {
                    id: 'post-22',
                    title: '¿DJ o Grupo en Vivo? 7 Razones por las que la Música en Vivo Hará Inolvidable tu Evento',
                    excerpt: 'Descubre por qué la música en vivo supera a un DJ en cualquier celebración. 7 razones para elegir a Grupo Musical Versátil La Célula y hacer tu evento único.',
                    date: '15 oct 2025',
                    image: 'assets/gallery/banda-1.jpg',
                    url: 'post/post-22.html'
                },
                {
                    id: 'post-21',
                    title: 'Guía Paso a Paso: Cómo Contratar a Célula para tu Evento',
                    excerpt: 'Sigue esta guía en 5 pasos para contratar a Grupo Musical Versátil La Célula y asegura la mejor música en vivo para tu evento.',
                    date: '12 oct 2025',
                    image: 'assets/gallery/banda-2.jpg',
                    url: 'post/post-21.html'
                },
                {
                    id: 'post-20',
                    title: '¿DJ o Grupo en Vivo? 7 Razones por las que la Música en Vivo Hará Inolvidable tu Evento',
                    excerpt: 'Descubre por qué la música en vivo supera a un DJ en cualquier celebración. 7 razones para elegir a Grupo Musical Versátil La Célula y hacer tu evento único.',
                    date: '10 oct 2025',
                    image: 'assets/gallery/banda-3.jpg',
                    url: 'post/post-20.html'
                },
                {
                    id: 'post-19',
                    title: '¿Por qué los Hoteles de Lujo Prefieren Bandas Versátiles para sus Eventos?',
                    excerpt: 'Descubre por qué los hoteles de lujo eligen bandas versátiles como Grupo Musical Versátil La Célula para ofrecer experiencias únicas en sus eventos.',
                    date: '08 oct 2025',
                    image: 'assets/gallery/banda-4.jpg',
                    url: 'post/post-19.html'
                },
                {
                    id: 'post-18',
                    title: '5 Momentos Clave donde la Música en Vivo Cambia tu Evento por Completo',
                    excerpt: 'Descubre los 5 momentos donde la música en vivo transforma cualquier evento. Haz que cada instante sea especial con Grupo Musical Versátil La Célula.',
                    date: '05 oct 2025',
                    image: 'assets/gallery/banda-5.jpg',
                    url: 'post/post-18.html'
                },
                {
                    id: 'post-17',
                    title: '15 Canciones Mágicas para el Primer Baile de los Novios',
                    excerpt: 'Descubre 15 canciones perfectas para el primer baile de tu boda. Grupo Musical Versátil La Célula las interpreta en vivo para un momento inolvidable.',
                    date: '02 oct 2025',
                    image: 'assets/gallery/banda-6.jpg',
                    url: 'post/post-17.html'
                },
                {
                    id: 'post-16',
                    title: '¿Qué Equipo de Sonido Necesita una Banda para un Evento? Lo que Debes Saber',
                    excerpt: 'Descubre qué equipo de sonido utiliza una banda profesional y por qué Grupo Musical Versátil La Célula garantiza un audio impecable en cada evento.',
                    date: '29 sep 2025',
                    image: 'assets/gallery/banda-7.jpg',
                    url: 'post/post-16.html'
                },
                {
                    id: 'post-15',
                    title: '10 Preguntas Clave que Debes Hacerle a una Banda Antes de Contratarla',
                    excerpt: 'Antes de contratar una banda, haz estas 10 preguntas clave. Grupo Musical Versátil La Célula responde a cada una para tu tranquilidad.',
                    date: '26 sep 2025',
                    image: 'assets/gallery/banda-8.jpg',
                    url: 'post/post-15.html'
                },
                {
                    id: 'post-14',
                    title: 'La Imagen También Suena: La Importancia del Vestuario en una Banda de Eventos',
                    excerpt: 'Descubre cómo el vestuario influye en la presentación de una banda y cómo Grupo Musical Versátil La Célula cuida cada detalle para tu evento.',
                    date: '23 sep 2025',
                    image: 'assets/gallery/banda-9.jpg',
                    url: 'post/post-14.html'
                },
                {
                    id: 'post-13',
                    title: '5 Géneros Musicales que no Pueden Faltar en tu Boda para que Todos Bailen',
                    excerpt: 'Descubre los 5 géneros musicales que harán de tu boda un evento inolvidable. ¡Deja que Grupo Musical Versátil La Célula ponga a todos a bailar en tu gran día!',
                    date: '20 sep 2025',
                    image: 'assets/gallery/banda-10.jpg',
                    url: 'post/post-13.html'
                },
                {
                    id: 'post-12',
                    title: 'La Mejor Música para una Fiesta de XV Años Moderna y Divertida',
                    excerpt: 'Descubre cómo combinar géneros modernos y clásicos para que tu fiesta de XV años sea divertida para todas las generaciones con Grupo Musical Versátil La Célula.',
                    date: '17 sep 2025',
                    image: 'assets/gallery/banda-1.jpg',
                    url: 'post/post-12.html'
                },
                {
                    id: 'post-11',
                    title: 'No es solo tocar: Así es el Montaje de Grupo Musical Versátil La Célula para un Evento',
                    excerpt: 'Descubre el trabajo detrás del montaje de Grupo Musical Versátil La Célula y cómo garantizan un show impecable para tu evento.',
                    date: '14 sep 2025',
                    image: 'assets/gallery/banda-2.jpg',
                    url: 'post/post-11.html'
                },
                {
                    id: 'post-10',
                    title: 'Cómo Elegir la Música Correcta para tu Próximo Evento Corporativo',
                    excerpt: 'Descubre cómo la música adecuada transforma tu evento corporativo. Crea una atmósfera elegante y dinámica con Grupo Musical Versátil La Célula.',
                    date: '11 sep 2025',
                    image: 'assets/gallery/banda-3.jpg',
                    url: 'post/post-10.html'
                },
                {
                    id: 'post-9',
                    title: 'Creando el Ambiente Perfecto: La Mejor Música para la Recepción de tu Boda',
                    excerpt: 'Descubre la mejor música para la recepción de tu boda y cómo Grupo Musical Versátil La Célula puede crear el ambiente perfecto para tu gran día.',
                    date: '08 sep 2025',
                    image: 'assets/gallery/banda-4.jpg',
                    url: 'post/post-9.html'
                },
                {
                    id: 'post-8',
                    title: 'Celebrando el Amor Duradero: La Mejor Música para Aniversarios y Bodas de Plata/Oro',
                    excerpt: 'Celebra tu aniversario con música en vivo que revive recuerdos. Grupo Musical Versátil La Célula ofrece el repertorio ideal para bodas de plata y oro.',
                    date: '05 sep 2025',
                    image: 'assets/gallery/banda-5.jpg',
                    url: 'post/post-8.html'
                },
                {
                    id: 'post-7',
                    title: 'Plantilla de Artículo',
                    excerpt: 'Plantilla para artículos de blog del Grupo Musical Versátil La Célula',
                    date: '02 sep 2025',
                    image: 'assets/gallery/banda-6.jpg',
                    url: 'post/post-7.html'
                },
                {
                    id: 'post-6',
                    title: 'Elegancia y Sofisticación: La Música Perfecta para una Cena de Gala',
                    excerpt: 'Haz que tu cena de gala sea elegante con música en vivo. Grupo Musical Versátil La Célula crea la atmósfera perfecta con jazz, bossa nova y boleros.',
                    date: '29 ago 2025',
                    image: 'assets/gallery/banda-7.jpg',
                    url: 'post/post-6.html'
                },
                {
                    id: 'post-5',
                    title: 'Cómo Lograr que tu Boda se Convierta en la Fiesta del Año con Música en Vivo',
                    excerpt: 'Convierte tu boda en una celebración inolvidable. Descubre cómo la música en vivo transforma la atmósfera y hazlo realidad con Grupo Musical Versátil La Célula.',
                    date: '26 ago 2025',
                    image: 'assets/gallery/banda-8.jpg',
                    url: 'post/post-5.html'
                },
                {
                    id: 'post-4',
                    title: 'Guía Paso a Paso: Cómo Contratar a Célula para tu Evento',
                    excerpt: 'Sigue esta guía en 5 pasos para contratar a Grupo Musical Versátil La Célula y asegura la mejor música en vivo para tu evento.',
                    date: '23 ago 2025',
                    image: 'assets/gallery/banda-9.jpg',
                    url: 'post/post-4.html'
                },
                {
                    id: 'post-3',
                    title: 'Más que Canciones: Los Beneficios Psicológicos de la Música en Vivo en tu Evento',
                    excerpt: 'Descubre los beneficios psicológicos de la música en vivo y cómo Grupo Musical Versátil La Célula transforma tu evento en una experiencia emocional única.',
                    date: '20 ago 2025',
                    image: 'assets/gallery/banda-10.jpg',
                    url: 'post/post-3.html'
                },
                {
                    id: 'post-2',
                    title: '¿Por qué la Cumbia nos Hace Bailar a Todos? La Psicología de la Música para Fiestas',
                    excerpt: 'Descubre por qué la cumbia tiene el poder de hacer bailar a todos. Grupo Musical Versátil La Célula explica la psicología detrás de este ritmo irresistible.',
                    date: '17 ago 2025',
                    image: 'assets/gallery/banda-1.jpg',
                    url: 'post/post-2.html'
                },
                {
                    id: 'post-1',
                    title: 'De los 80s a Hoy: Un Viaje por el Repertorio Musical de La Célula',
                    excerpt: 'Descubre cómo Grupo Musical Versátil La Célula combina clásicos de los 80s, hits de los 90s, 2000s y éxitos actuales en su repertorio para cualquier evento.',
                    date: '14 ago 2025',
                    image: 'assets/gallery/banda-2.jpg',
                    url: 'post/post-1.html'
                }
            ];

            const container = document.getElementById('blog-posts-container');

            // Función para crear un artículo de blog sin categoría
            function createBlogPost(post) {
                const article = document.createElement('article');
                article.className = 'blog-post-card fade-in';

                article.innerHTML = `
                    <div class="post-image">
                        <img src="${post.image}" alt="${post.title}" class="post-img">
                    </div>
                    <div class="post-content-card">
                        <div class="post-meta">
                            <span class="post-date">${post.date}</span>
                        </div>
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="${post.url}" class="btn btn-secondary">Leer más</a>
                    </div>
                `;

                return article;
            }

            // Crear todos los posts y almacenarlos
            const allPosts = blogPosts.map(post => createBlogPost(post));

            // Limpiar el contenedor y agregar los posts
            container.innerHTML = '';
            allPosts.forEach(post => container.appendChild(post));

            const totalPages = Math.ceil(blogPosts.length / postsPerPage);
            let currentPage = 1;

            // Mostrar los primeros 6 posts
            showPage(currentPage);

            // Actualizar la paginación
            updatePagination();

            function showPage(pageNumber) {
                // Calcular el índice de inicio y fin
                const startIndex = (pageNumber - 1) * postsPerPage;
                const endIndex = startIndex + postsPerPage;

                // Ocultar todos los posts
                allPosts.forEach(post => post.style.display = 'none');

                // Mostrar solo los posts para la página actual
                for (let i = startIndex; i < Math.min(endIndex, allPosts.length); i++) {
                    allPosts[i].style.display = 'block';
                }

                // Actualizar la variable de página actual
                currentPage = pageNumber;
            }

            function updatePagination() {
                // Buscar el contenedor de paginación existente
                const paginationContainer = document.querySelector('.pagination ul');
                if (!paginationContainer) return;

                // Limpiar el contenido actual
                paginationContainer.innerHTML = '';

                // Botón Anterior
                const prevButton = document.createElement('li');
                prevButton.innerHTML = `<a href="../contacto.html" class="page-link ${currentPage === 1 ? 'page-link-inactive' : 'page-link-active'}"
                    onclick="changePage(${currentPage > 1 ? currentPage - 1 : 1}); return false;">← Anterior</a>`;
                paginationContainer.appendChild(prevButton);

                // Números de página
                for (let i = 1; i <= totalPages; i++) {
                    const pageItem = document.createElement('li');
                    pageItem.innerHTML = `<a href="../contacto.html" class="page-link ${i === currentPage ? 'page-link-active' : 'page-link-inactive'}"
                        onclick="changePage(${i}); return false;">${i}</a>`;
                    paginationContainer.appendChild(pageItem);
                }

                // Botón Siguiente
                const nextButton = document.createElement('li');
                nextButton.innerHTML = `<a href="../contacto.html" class="page-link ${currentPage === totalPages ? 'page-link-inactive' : 'page-link-active'} page-link-next"
                    onclick="changePage(${currentPage < totalPages ? currentPage + 1 : totalPages}); return false;">Siguiente →</a>`;
                paginationContainer.appendChild(nextButton);
            }

            // Función global para cambiar de página
            window.changePage = function(pageNumber) {
                if (pageNumber < 1 || pageNumber > totalPages) return;

                showPage(pageNumber);
                updatePagination();

                // Desplazar hacia arriba para ver los resultados
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

        });
