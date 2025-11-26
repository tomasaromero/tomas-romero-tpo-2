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
  
  // CONFIGURACIÓN DE TUS CREDENCIALES 
  const SERVICE_ID = "ong_impulso_cuyano";     
  const TEMPLATE_ONG = "impulso_cuyano_contacto";   
  const TEMPLATE_USER = "impulso_cuyano_sumate"; 

  // Formulario "Sumate"
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
            // 2. Copia automática al usuario
            
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
  /* =========================================
     4. ANIMACIÓN DE CONTADORES (SCROLL)
     ========================================= */
  const counters = document.querySelectorAll('.metric-number');
  const speed = 200; // Velocidad de animación

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = "+" + target; // Agrega el "+" al final
        }
      };
      updateCount();
    });
  };

  // Intersection Observer: Solo anima cuando el usuario ve la sección
  const observerOptions = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, observerOptions);

  const metricsSection = document.querySelector('.impact-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
/* =========================================
     5. DARK MODE LOGIC
     ========================================= */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Función para aplicar el tema
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add('dark-mode');
      if(themeToggle) themeToggle.innerText = '☀️'; // Icono de sol
    } else {
      body.classList.remove('dark-mode');
      if(themeToggle) themeToggle.innerText = '🌙'; // Icono de luna
    }
  };

  // 1. Verificar preferencia guardada al cargar
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyTheme(true);
  }

  // 2. Evento al hacer clic en el botón
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      
      // Cambiar icono y guardar preferencia
      applyTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

});