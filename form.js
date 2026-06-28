/**
 * form.js — Verifcore Consultants
 * Contact form with client-side validation and mailto fallback.
 * (For a real backend, replace the submitForm function with a fetch() call.)
 */
(function () {
  'use strict';

  /* ── Validators ──────────────────────────────────────── */
  const validators = {
    name:    v => v.trim().length >= 2   ? '' : 'Please enter your full name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    domain:  v => v !== ''               ? '' : 'Please select a verification domain.',
    message: v => v.trim().length >= 20  ? '' : 'Please describe your project (at least 20 characters).',
  };

  /* ── Show / clear field errors ───────────────────────── */
  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (!input || !error) return;
    if (message) {
      input.classList.add('error');
      error.textContent = message;
    } else {
      input.classList.remove('error');
      error.textContent = '';
    }
  }

  /* ── Validate whole form, return true if valid ────────── */
  function validateForm() {
    const fields  = ['name', 'email', 'domain', 'message'];
    let   isValid = true;

    fields.forEach(id => {
      const el  = document.getElementById(id);
      const msg = el ? validators[id](el.value) : 'Required.';
      showError(id, msg);
      if (msg) isValid = false;
    });

    return isValid;
  }

  /* ── Submit handler ──────────────────────────────────── */
  function submitForm(data) {
    /* ────────────────────────────────────────────────────────
       INTEGRATION POINT
       ────────────────────────────────────────────────────────
       Option A — Formspree (free tier, no backend needed):
         1. Sign up at formspree.io
         2. Replace YOUR_FORM_ID below
         3. Change the fetch URL to 'https://formspree.io/f/YOUR_FORM_ID'
         4. Remove the fallback window.location.href line

       Option B — EmailJS (free tier):
         Already works client-side, no server required.

       Option C — Your own server endpoint:
         Point fetch to your API URL.

       Until you configure one of the above, we fall back to
       a mailto: link so the form is never silently broken.
    ─────────────────────────────────────────────────────────── */

    const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← paste your Formspree form ID here

    if (FORMSPREE_ID) {
      return fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => {
        if (!r.ok) throw new Error('Server error');
        return true;
      });
    }

    // Mailto fallback
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\nDomain: ${data.domain}\n\nMessage:\n${data.message}`
    );
    const subject = encodeURIComponent(`Verification Project Inquiry — ${data.name}`);
    window.location.href = `mailto:sunil.sharma.vlsi@gmail.com?subject=${subject}&body=${body}`;
    return Promise.resolve(true);
  }

  /* ── Init ────────────────────────────────────────────── */
  function init() {
    const form      = document.getElementById('contactForm');
    const success   = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    // Live validation on blur
    ['name', 'email', 'domain', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => {
        showError(id, validators[id](el.value));
      });
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) {
          showError(id, validators[id](el.value));
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Collect data
      const data = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        domain:  document.getElementById('domain').value,
        message: document.getElementById('message').value.trim(),
      };

      // Loading state
      submitBtn.setAttribute('data-loading', '');
      submitBtn.disabled = true;

      submitForm(data)
        .then(() => {
          form.hidden    = true;
          success.hidden = false;
        })
        .catch(() => {
          submitBtn.removeAttribute('data-loading');
          submitBtn.disabled = false;
          alert('Something went wrong. Please email us directly at sunil.sharma.vlsi@gmail.com');
        });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
