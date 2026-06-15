/* =========================================
   世界の弥栄珈琲 — script.js
   ========================================= */

'use strict';

// ── 1. Header scroll effect ──
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}, { passive: true });

// ── 2. Mobile nav toggle ──
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navMenu.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when link clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  });
});

// ── 3. Scroll Reveal (Intersection Observer) ──
const revealEls = document.querySelectorAll('.reveal, .reveal-collage');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 120;
        });
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── 4. Menu Modals ──
/**
 * @param {string} modalId
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Focus the modal content for accessibility
  const content = modal.querySelector('.modal-content');
  if (content) {
    setTimeout(() => content.focus(), 50);
  }
}

/**
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

/**
 * Close when clicking the overlay background (not the content)
 * @param {MouseEvent} event
 * @param {string} modalId
 */
function closeModalOnOverlay(event, modalId) {
  if (event.target === event.currentTarget) {
    closeModal(modalId);
  }
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.is-open').forEach(m => {
      closeModal(m.id);
    });
  }
});

// Expose to global for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOnOverlay = closeModalOnOverlay;

// ── 5. Smooth active nav link highlight ──
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));

// ── 6. Shop Info Auto Slider (5 seconds) ──
const infoSlides = document.querySelectorAll('.info-slide');
if (infoSlides.length > 0) {
  let currentSlide = 0;
  setInterval(() => {
    infoSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % infoSlides.length;
    infoSlides[currentSlide].classList.add('active');
  }, 5000);
}
