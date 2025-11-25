// main.js — menu toggle and simple behavior
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Smooth scroll para enlaces internos
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

  // Manejadores de formulario simples (modo demo)
  const sumateForm = document.getElementById('sumateForm');
  if (sumateForm) {
    sumateForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Gracias — formulario recibido.');
      sumateForm.reset();
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Mensaje enviado (modo demo).');
      contactForm.reset();
    });
  }

  // Video de fondo: carga condicional según preferencias de usuario
  try {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canPlayVideo = !prefersReduce;


    const videos = document.querySelectorAll('.video-background video, .bg-video video');

    videos.forEach(video => {
      const srcEl = video.querySelector('source[data-src]');
      if (!srcEl) return; // Si no hay data-src, no hacemos nada

      const dataSrc = srcEl.getAttribute('data-src');
      
      if (canPlayVideo) { 
        // Pasamos la data-src al src real para que cargue
        srcEl.setAttribute('src', dataSrc);
        video.load();
        // Intentamos reproducir
        video.play().catch(err => {
            console.log("El navegador bloqueó el autoplay o hubo un error:", err);
        });
      } else {
        // Si el usuario prefiere movimiento reducido, dejamos el póster y pausamos
        video.removeAttribute('autoplay');
        video.pause();
      }
    });
  } catch (e) {
    console.warn('Error al iniciar el video de fondo:', e);
  }
});