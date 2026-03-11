/**
 * KCCITM – script.js
 * Features:
 *  - Sticky navbar with scroll effect
 *  - Mobile hamburger menu
 *  - Hero image slider with auto-play
 *  - Animated counters (triggered on scroll)
 *  - Form validation
 *  - Back-to-top button
 *  - Smooth active-link highlighting
 */

/* ============================================================
   1. NAVBAR – Scroll effect & hamburger toggle
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');

// Sticky navbar + back-to-top visibility
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add/remove scrolled class
  navbar.classList.toggle('scrolled', scrollY > 60);

  // Show back-to-top button after 400px
  backToTop.classList.toggle('visible', scrollY > 400);

  // Highlight active nav link based on scroll position
  highlightActiveLink();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   2. ACTIVE LINK HIGHLIGHT
   ============================================================ */
function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links    = navLinks.querySelectorAll('a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = '#' + section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === current) {
      link.style.color = 'var(--gold-light)';
      link.style.background = 'rgba(201,168,76,0.1)';
    }
  });
}

/* ============================================================
   3. BACK TO TOP
   ============================================================ */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   4. HERO SLIDER
   ============================================================ */
const slides   = document.querySelectorAll('.hero-slide');
const dots     = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startAutoSlide() {
  slideTimer = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(slideTimer);
  startAutoSlide();
}

// Dot click navigation
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    resetAutoSlide();
  });
});

// Start the slider
startAutoSlide();

/* ============================================================
   5. ANIMATED COUNTERS
   Uses IntersectionObserver to trigger when stats section
   enters the viewport.
   ============================================================ */
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000; // ms
  const start    = performance.now();

  function update(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================================
   6. FORM VALIDATION
   ============================================================ */
const form         = document.getElementById('admissionsForm');
const formSuccess  = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('show');
        form.reset();
        submitBtn.textContent = 'Submit Application';
        submitBtn.disabled = false;

        // Hide success after 5 seconds
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    }
  });

  // Real-time validation on blur
  ['name', 'email', 'phone', 'course'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });
}

/**
 * Validates a single field by id.
 * @param {string} id - The field id to validate.
 * @returns {boolean} True if valid.
 */
function validateField(id) {
  const el    = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  let valid   = true;
  let message = '';

  clearError(el, error);

  switch (id) {
    case 'name':
      if (!el.value.trim()) {
        message = 'Full name is required.';
        valid   = false;
      } else if (el.value.trim().length < 3) {
        message = 'Name must be at least 3 characters.';
        valid   = false;
      }
      break;

    case 'email':
      if (!el.value.trim()) {
        message = 'Email address is required.';
        valid   = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) {
        message = 'Please enter a valid email address.';
        valid   = false;
      }
      break;

    case 'phone':
      if (!el.value.trim()) {
        message = 'Phone number is required.';
        valid   = false;
      } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(el.value.trim())) {
        message = 'Please enter a valid phone number.';
        valid   = false;
      }
      break;

    case 'course':
      if (!el.value) {
        message = 'Please select a program.';
        valid   = false;
      }
      break;
  }

  if (!valid) {
    setError(el, error, message);
  }
  return valid;
}

/**
 * Validates the entire form.
 * @returns {boolean} True if all fields are valid.
 */
function validateForm() {
  const fields = ['name', 'email', 'phone', 'course'];
  return fields.map(validateField).every(Boolean);
}

function setError(el, errorEl, message) {
  el.classList.add('error');
  errorEl.textContent = message;
}

function clearError(el, errorEl) {
  el.classList.remove('error');
  errorEl.textContent = '';
}

/* ============================================================
   7. SCROLL-IN ANIMATIONS
   Fade-in cards and sections as they enter the viewport.
   ============================================================ */
const animatables = document.querySelectorAll(
  '.program-card, .campus-card, .stat-item, .pillar, .logo-badge, .ph-card, .about-visual, .about-content'
);

animatables.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings by index within parent
      const siblings = [...entry.target.parentElement.children];
      const delay    = siblings.indexOf(entry.target) * 60;

      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animatables.forEach(el => scrollObserver.observe(el));

/* ============================================================
   8. SMOOTH SCROLL for anchor links (polyfill fallback)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   9. HERO PARALLAX (subtle)
   ============================================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const overlay = document.querySelector('.hero-overlay');
  if (overlay && scrollY < window.innerHeight) {
    // Slightly darken overlay on scroll
    const opacity = 0.5 + (scrollY / window.innerHeight) * 0.3;
    overlay.style.opacity = Math.min(opacity, 0.9);
  }
});
