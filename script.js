/* ═══════════════════════════════════════════════════
   NOVATECH LABS — script.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── DOM REFERENCES ─────────────────────────────── */
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');
const heroCanvas    = document.getElementById('heroCanvas');
const contactForm   = document.getElementById('contactForm');
const cursorGlow    = document.getElementById('cursorGlow');

/* ═══════════════════════════════════════════════════
   1. NAVBAR — SCROLL EFFECT
   ═══════════════════════════════════════════════════ */
const handleNavbarScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run on init

/* ═══════════════════════════════════════════════════
   2. ACTIVE NAV LINK — SECTION DETECTION
   ═══════════════════════════════════════════════════ */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const updateActiveLink = () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ═══════════════════════════════════════════════════
   3. SMOOTH SCROLLING
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    const offset = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════════
   4. MOBILE MENU TOGGLE
   ═══════════════════════════════════════════════════ */
const openMobileMenu = () => {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeMobileMenu = () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileOverlay.addEventListener('click', closeMobileMenu);

// Close on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburger.classList.contains('open')) {
    closeMobileMenu();
  }
});

/* ═══════════════════════════════════════════════════
   5. HERO PARTICLE CANVAS
   ═══════════════════════════════════════════════════ */
(() => {
  if (!heroCanvas) return;

  const ctx = heroCanvas.getContext('2d');
  let width, height, particles, mouse;

  mouse = { x: -1000, y: -1000 };

  const resize = () => {
    width = heroCanvas.width  = heroCanvas.offsetWidth;
    height = heroCanvas.height = heroCanvas.offsetHeight;
  };

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x     = Math.random() * width;
      this.y     = Math.random() * height;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.size  = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,242,255' : '0,119,255';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += dx * force * 0.04;
        this.y += dy * force * 0.04;
      }

      // Wrap edges
      if (this.x < 0)      this.x = width;
      if (this.x > width)  this.x = 0;
      if (this.y < 0)      this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  const init = () => {
    resize();
    const count = Math.floor((width * height) / 12000);
    particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };

  init();
  animate();

  window.addEventListener('resize', init, { passive: true });

  heroCanvas.addEventListener('mousemove', e => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroCanvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
})();

/* ═══════════════════════════════════════════════════
   6. CUSTOM CURSOR GLOW
   ═══════════════════════════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });
}

/* ═══════════════════════════════════════════════════
   7. SCROLL REVEAL ANIMATION
   ═══════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger cards in the same parent
        const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) delay = i * 100;
        });

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════
   8. COUNTER ANIMATION
   ═══════════════════════════════════════════════════ */
const animateCounter = (el, target, duration = 1800) => {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════════════
   9. TESTIMONIAL SLIDER
   ═══════════════════════════════════════════════════ */
(() => {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  const goTo = idx => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  };

  const autoplay = () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(idx);
      autoplay();
    });
  });

  // Touch / swipe
  let touchStartX = 0;
  const track = document.getElementById('testimonialTrack');
  if (track) {
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        clearInterval(timer);
        goTo(diff > 0 ? current + 1 : current - 1);
        autoplay();
      }
    });
  }

  autoplay();
})();

/* ═══════════════════════════════════════════════════
   10. CONTACT FORM VALIDATION & SUBMIT
   ═══════════════════════════════════════════════════ */
if (contactForm) {
  const showError = (fieldId, errorId, message) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.add('error');
    if (error) {
      error.textContent = message;
      error.classList.add('visible');
    }
  };

  const clearError = (fieldId, errorId) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.remove('error');
    if (error) error.classList.remove('visible');
  };

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Live validation
  document.getElementById('name').addEventListener('input', function() {
    if (this.value.trim().length >= 2) clearError('name', 'nameError');
  });
  document.getElementById('email').addEventListener('input', function() {
    if (validateEmail(this.value.trim())) clearError('email', 'emailError');
  });
  document.getElementById('message').addEventListener('input', function() {
    if (this.value.trim().length >= 10) clearError('message', 'messageError');
  });

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const btn     = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');

    // Clear previous errors
    ['name', 'email', 'message'].forEach(id => clearError(id, id + 'Error'));

    let valid = true;

    if (name.length < 2) {
      showError('name', 'nameError', 'Please enter your full name.');
      valid = false;
    }
    if (!validateEmail(email)) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    }
    if (message.length < 10) {
      showError('message', 'messageError', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // Simulate async submit
    const btnText    = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    btn.disabled         = true;
    btnText.style.display   = 'none';
    btnSpinner.style.display = 'inline-flex';

    await new Promise(resolve => setTimeout(resolve, 1800));

    btn.disabled         = false;
    btnText.style.display   = 'inline';
    btnSpinner.style.display = 'none';

    contactForm.reset();
    success.style.display = 'flex';

    setTimeout(() => {
      success.style.display = 'none';
    }, 6000);
  });
}

/* ═══════════════════════════════════════════════════
   11. CARD TILT EFFECT (services)
   ═══════════════════════════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = (-y * 8).toFixed(2);
      const tiltY  = (x  * 8).toFixed(2);
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ═══════════════════════════════════════════════════
   12. PAGE LOAD — STAGGERED HERO ANIMATIONS
   ═══════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
