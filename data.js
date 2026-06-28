/**
 * data.js — Verifcore Consultants
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all site content.
 * Edit this file to update text without touching HTML or logic.
 */

window.VERIFCORE = {

  /* ── SERVICES ──────────────────────────────────────────── */
  services: [
    {
      num: "01",
      icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
      title: "Pre-Silicon Analysis",
      desc: "Catch corner-case bugs before RTL freeze. Fewer respins, faster path to tapeout."
    },
    {
      num: "02",
      icon: `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
      title: "Testbench Architecture",
      desc: "Engineered for reuse, coverage closure, and debug clarity from day one."
    },
    {
      num: "03",
      icon: `<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      title: "Functional Coverage Design",
      desc: "Intent-driven coverage that maps directly to your verification plan, not random exploration."
    },
    {
      num: "04",
      icon: `<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>`,
      title: "Assertion-Based Verification",
      desc: "Formal-lite checks embedded in simulation for real-time protocol and data integrity verification."
    },
    {
      num: "05",
      icon: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      title: "Regression Triage",
      desc: "Find the root cause fast — not just which failure failed, but why."
    },
    {
      num: "06",
      icon: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      title: "Sign-Off Review",
      desc: "Independent technical review of your verification closure data and coverage metrics."
    }
  ],

  /* ── APPROACH STEPS ─────────────────────────────────────── */
  approachSteps: [
    { num: "01", text: "Build the test plan <strong>before</strong> writing a single line of SystemVerilog." },
    { num: "02", text: "Every test targets a coverage gap — no wasted cycles on already-verified paths." },
    { num: "03", text: "Assertions catch what directed tests miss — written for the corner cases that hurt." },
    { num: "04", text: "Regression suite stays lean. Fast feedback without sacrificing coverage." },
    { num: "05", text: "Clear documentation and milestone-based delivery — no ambiguity at sign-off." }
  ],

  /* ── TOOL BADGES ─────────────────────────────────────────── */
  tools: [
    "UVM", "SystemVerilog", "SVA", "Questasim",
    "ModelSim", "Cadence", "Synopsys", "UART / APB / AXI"
  ],

  /* ── FAQ ─────────────────────────────────────────────────── */
  faqs: [
    {
      q: "What does a design verification consultant actually do?",
      a: "We build testbenches, run simulations, and check coverage before tapeout. The goal is catching functional bugs early so you don't spin silicon twice."
    },
    {
      q: "How is this different from what our internal team already does?",
      a: "We bring a fresh pair of eyes and deep experience across multiple projects. Internal teams can develop blind spots from familiarity. We spot the edge cases they've stopped seeing."
    },
    {
      q: "Do you work on-site or remotely?",
      a: "Either works. We can embed on-site, work entirely remote, or do a hybrid setup. What matters is hitting your verification schedule, not where the desk is."
    },
    {
      q: "We're working with a tight deadline. Can you ramp up quickly?",
      a: "Yes. We can start within days, not weeks. No lengthy onboarding process — just the tools and environment access needed to begin verifying immediately."
    },
    {
      q: "What does a typical engagement look like?",
      a: "We start with a scoping call to understand your project and verification gaps. Then we define the deliverables, timeline, and sign-off criteria. Payment is milestone-based with clear exit criteria at each stage."
    },
    {
      q: "Is design verification useful for small ASIC projects too?",
      a: "Especially for smaller projects — one missed bug can wipe out your margin. A targeted verification scope costs a fraction of a respin and keeps first-pass success achievable."
    },
    {
      q: "What tools and simulators do you support?",
      a: "We work with industry-standard tools including Questasim, ModelSim, Cadence Xcelium, and Synopsys VCS. We write clean, simulator-agnostic UVM/SystemVerilog that runs on your existing tool chain."
    }
  ]
};
