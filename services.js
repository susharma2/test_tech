/**
 * services.js — Verifcore Consultants
 * Renders service cards dynamically from data.js
 */
(function () {
  'use strict';

  function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    const services = window.VERIFCORE.services;

    const html = services.map((svc, i) => `
      <div class="service-card reveal" style="transition-delay:${i * 0.07}s">
        <div class="svc-num">${svc.num}</div>
        <div class="svc-icon">${svc.icon}</div>
        <h3>${svc.title}</h3>
        <p>${svc.desc}</p>
      </div>
    `).join('');

    grid.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', renderServices);
})();
