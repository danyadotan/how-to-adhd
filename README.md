# How to ADHD - Parent Pilot

Standalone, no-build, no-dependency, mobile-first Hebrew/English interactive parent-guidance app. **Not connected to KazoAni, TAB@Work or Lovable.**

## What works

- Parent-guided situation library, searchable and filterable by age.
- A concrete next action, smaller action, alternative, suggested next question, and close-loop control for each scenario.
- TAB as a **transparent local guided decision helper** (not generative AI).
- Opt-in follow-up items stored only in this browser's localStorage, with export/delete.
- Branching practice simulator and generic caregiver summary sharing via copy (parent controls sharing).
- Voluntary feedback via clipboard copy; never transmitted automatically.
- Hebrew RTL / English LTR; reduced motion; keyboard navigation.

## Pilot limits

Not a diagnosis or treatment tool. No accounts, analytics, databases, cloud storage, model API, or messaging. No private child profiles are required or transmitted. Avoid storing identifying medical details in the browser. For emergencies contact local emergency services and qualified professionals.

## Run and verify

`python3 -m http.server 8080` then open http://localhost:8080. Run `node --check app.js` for syntax and `node --test tests.mjs` for data/logic checks. Deployment serves static root assets and needs no build step.

## GitHub / Vercel

Repository target: https://github.com/danyadotan/how-to-adhd

Static Vercel framework auto-detection can be disabled. Keep preview protected while reviewing with adults; verify mobile / Hebrew / English before enabling public production.

## Replaceable artwork

The SVG Bridget below is an original in-app illustration and placeholder for the approved portrait, which was not available as an image attachment in this task. Do not claim it reproduces the original exactly.


---

by Danya Dotan - Bridge-iT | 2026

