        document.addEventListener('DOMContentLoaded', function() {
            // Navegación móvil
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            const navMenu = document.getElementById('nav-menu');

            if (mobileToggle && navMenu) {
                mobileToggle.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                    this.classList.toggle('active');
                });
            }

            // Manejo del formulario
            const form = document.querySelector('.cotizador-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // Recopilar datos del formulario
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);

                    // Crear mensaje para WhatsApp
                    const mensaje = `Hola, me interesa cotizar mi evento:

🎵 *Cotización de Evento Musical*
👤 *Nombre:* ${data.nombre}
📞 *Teléfono:* ${data.telefono}
📧 *Email:* ${data.email}
🎉 *Tipo de evento:* ${data.evento}
📅 *Fecha:* ${data.fecha}
📍 *Ubicación:* ${data.ubicacion}
👥 *Invitados:* ${data.invitados}
💬 *Comentarios:* ${data.comentarios || 'Ninguno'}

¡Espero su respuesta!`;

                    // Abrir WhatsApp con el mensaje
                    const whatsappUrl = `https://wa.me/+525535412631?text=${encodeURIComponent(mensaje)}`;
                    window.open(whatsappUrl, '_blank');

                    // Mostrar confirmación
                    alert('¡Gracias! Te redirigimos a WhatsApp para completar tu cotización.');
                });
            }

            console.log('✅ Cotizador cargado correctamente');
        });
