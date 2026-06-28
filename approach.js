/**
 * approach.js — Verifcore Consultants
 * Renders approach steps and tool badges from data.js
 */
(function () {
  'use strict';

  function renderApproach() {
    const list   = document.getElementById('approachList');
    const badges = document.getElementById('toolBadges');

    if (list) {
      const steps = window.VERIFCORE.approachSteps;
      list.innerHTML = steps.map(s => `
        <li>
          <span class="num">${s.num}</span>
          <span>${s.text}</span>
        </li>
      `).join('');
    }

    if (badges) {
      const tools = window.VERIFCORE.tools;
      badges.innerHTML = tools.map(t =>
        `<span class="tool-badge">${t}</span>`
      ).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', renderApproach);
})();
