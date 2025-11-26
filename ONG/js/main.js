// main.js — Lógica general y envío de formularios

document.addEventListener('DOMContentLoaded', () => {
  
  /* =========================================
     1. MENÚ RESPONSIVE Y NAVEGACIÓN
     ========================================= */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Smooth scroll para enlaces internos (anclas)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* =========================================
     2. VIDEO DE FONDO (Carga Inteligente)
     ========================================= */
  try {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canPlayVideo = !prefersReduce;

    const videos = document.querySelectorAll('.video-background video, .bg-video video');

    videos.forEach(video => {
      const srcEl = video.querySelector('source[data-src]');
      if (!srcEl) return; 

      const dataSrc = srcEl.getAttribute('data-src');
      
      if (canPlayVideo) { 
        srcEl.setAttribute('src', dataSrc);
        video.load();
        video.play().catch(err => {
            console.log("Autoplay bloqueado o error:", err);
        });
      } else {
        video.removeAttribute('autoplay');
        video.pause();
      }
    });
  } catch (e) {
    console.warn('Error al iniciar video:', e);
  }

  /* =========================================
     3. FORMULARIOS CON EMAILJS
     ========================================= */
  
  // --- CONFIGURACIÓN DE TUS CREDENCIALES ---
  // Reemplaza estos textos con los códigos de tu panel de EmailJS
  const SERVICE_ID = "ong_impulso_cuyano";      // Tu Service ID (ej: service_gmail)
  const TEMPLATE_ONG = "impulso_cuyano_contacto";   // ID de plantilla para avisar a la ONG
  const TEMPLATE_USER = "impulso_cuyano_sumate"; // ID de plantilla para responder al usuario

  // --- Formulario "Sumate" ---
  const sumateForm = document.getElementById('sumateForm');
  
  if (sumateForm) {
    sumateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Enviando...';

      // 1. Envío a la ONG
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ONG, this)
        .then(() => {
            // 2. (Opcional) Copia automática al usuario
            // Si creaste la plantilla de usuario, descomenta la siguiente línea:
            // emailjs.sendForm(SERVICE_ID, TEMPLATE_USER, this);
            
            alert('¡Gracias por sumarte! Hemos recibido tus datos correctamente.');
            sumateForm.reset();
            btn.innerText = originalText;
        }, (error) => {
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario. Por favor intentá nuevamente.');
            btn.innerText = originalText;
        });
    });
  }

  // --- Formulario "Contacto" ---
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Enviando...';

      // Envío a la ONG
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ONG, this)
        .then(() => {
            alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
            contactForm.reset();
            btn.innerText = originalText;
        }, (error) => {
            console.error('Error:', error);
            alert('Error al enviar el mensaje.');
            btn.innerText = originalText;
        });
    });
  }

});