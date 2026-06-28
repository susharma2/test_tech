/**
 * faq.js — Verifcore Consultants
 * Renders FAQ items from data.js and handles accordion behavior.
 */
(function () {
  'use strict';

  function renderFAQ() {
    const list = document.getElementById('faqList');
    if (!list) return;

    const faqs = window.VERIFCORE.faqs;

    list.innerHTML = faqs.map((item, i) => `
      <div class="faq-item reveal" style="transition-delay:${i * 0.06}s">
        <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
          ${item.q}
          <span class="faq-icon" aria-hidden="true">
            <svg viewBox="0 0 12 12">
              <line x1="6" y1="1" x2="6" y2="11"/>
              <line x1="1" y1="6" x2="11" y2="6"/>
            </svg>
          </span>
        </button>
        <div class="faq-a" id="faq-a-${i}" role="region">${item.a}</div>
      </div>
    `).join('');

    // Accordion interaction
    list.addEventListener('click', function (e) {
      const btn = e.target.closest('.faq-q');
      if (!btn) return;

      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      list.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (toggle)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', renderFAQ);
})();
