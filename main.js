/**
 * main.js — Verifcore Consultants
 * Core interactivity: nav, scroll reveal, counter animation,
 * mobile drawer, active nav link, back-to-top button.
 */
(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────── */
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  /* ── Footer year ─────────────────────────────────────── */
  function updateYear() {
    const el = qs('#footerYear');
    if (el) {
      el.textContent = `© ${new Date().getFullYear()} Verifcore Consultants. All rights reserved.`;
    }
  }

  /* ── Navbar scroll state ─────────────────────────────── */
  function initNavbar() {
    const navbar = qs('#navbar');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile nav drawer ───────────────────────────────── */
  function initMobileNav() {
    const menuBtn    = qs('#menuBtn');
    const mobileNav  = qs('#mobile-nav');
    const mnBackdrop = qs('#mnBackdrop');
    const mnClose    = qs('#mnClose');

    if (!menuBtn || !mobileNav) return;

    function openMenu() {
      mobileNav.classList.add('open');
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);
    if (mnBackdrop) mnBackdrop.addEventListener('click', closeMenu);
    if (mnClose)    mnClose.addEventListener('click', closeMenu);

    // Close on link click
    qsa('.mn-links a, .mn-cta', mobileNav).forEach(el => {
      el.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  /* ── Active nav link on scroll ───────────────────────── */
  function initActiveNav() {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }

  /* ── Scroll reveal ───────────────────────────────────── */
  function initReveal() {
    const items = qsa('.reveal');
    if (!items.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ── Counter animation ───────────────────────────────── */
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const value    = Math.round(eased * target);
      el.textContent = value + suffix;
      if (elapsed < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = qsa('[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '+';
          animateCounter(el, target, suffix);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
  }

  /* ── Back to top ─────────────────────────────────────── */
  function initBackToTop() {
    const btn = qs('#backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth scroll for all anchor links ──────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id  = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;

      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ── Boot ────────────────────────────────────────────── */
  function init() {
    updateYear();
    initNavbar();
    initMobileNav();
    initActiveNav();
    initReveal();
    initCounters();
    initBackToTop();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
