# How to ADHD - Parent Pilot

Standalone, no-build, no-dependency, mobile-first Hebrew/English interactive parent-guidance app. **Not connected to KazoAni, TAB@Work or Lovable.**

## What works

- Parent-guided situation library, searchable and filterable by age.
- A concrete next action, smaller action, alternative, suggested next question, and close-loop control for each scenario.
- Bridget as a **transparent local guided decision helper** (not generative AI).
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


---

by Danya Dotan - Bridge-iT | 2026


## First pilot: voluntary measurement (v1)

The short feedback form is available from Bridget on every app view and from My steps. Three closed questions ask about relevance, carrying out a suggested step, and intention to return; an optional closed list identifies difficulties. There is no free-text field, tracking identifier, timestamp, scenario, child data, device metadata or saved-step export in feedback. Answers exist only in the open form and disappear when it closes. Nothing is persisted or sent. Copy requires valid answers and a fresh, unchecked consent box. Parents review their selected answers, copy, then paste into their existing conversation with the pilot organizer. Clipboard failure is reported by the existing copy helper; there is no automatic delivery or delivery receipt. Messaging may identify a sender: do not promise anonymity.

Before inviting parents, the organizer should name one existing private reply channel in the invitation (not a public GitHub issue), explain who reviews responses, and ask for one response per parent after a first attempt. Do not request child names, diagnoses or screenshots. Keep the tally separate from sender identities; avoid copying personal conversation content into the tally. Delete raw feedback after the pilot review (suggested: within 30 days). Returning later to answer after a real attempt is welcome; treat an explicitly updated response as a replacement. No app-side deduplication or unique-parent count is possible.

### Proposed learning criteria — agree before launch

For roughly 30 invited parents, aim for at least 15 voluntary responses within a week of invitation. This is feedback coverage among invited parents, **not activation**. Report exact counts and denominators, not just percentages. The following are pragmatic pilot targets, not clinical claims or statistically representative estimates:

| Question | Calculation among respondents | Initial learning target |
| --- | --- | --- |
| Relevant situation | `yes / all valid relevance answers`; report partly separately | At least 70% yes |
| Able to carry out a step | `yes / (yes + partly + no)`; report not_yet separately | At least 60% yes among those who tried |
| Would use again | `yes / all valid return answers`; report maybe separately | At least 70% yes |
| Difficulty | Count each chosen barrier, excluding skip; include no difficulty | Review the two most common barriers |

Keep tried-partly and no separate; not_yet is neither a failure nor evidence of success. If few parents tried, improve follow-up timing before interpreting the action metric. With this small, self-selected sample, treat every barrier as a clue for manual follow-up with consenting adults. Prioritize recurring technical blockers first, then relevance and clarity of the action. Review after the first week and after about 15 responses; record one or two concrete improvements before expanding distribution. Do not infer child outcomes or treatment effectiveness.

These are **self-reports**. The app still cannot measure unique active parents, sessions, completion funnels, time on a step, actual abandonment or actual repeat use. Intention to return is not retention. Saved/tried markers remain local and are not measured centrally. Automatic usage metrics would require a separate analytics design, explicit disclosure/consent, event minimization, security and retention decisions, and server infrastructure. This PR introduces none of those.

### Bridget

The existing approved local portrait accompanies every app view with contextual next-step guidance, a four-stage route and direct access to voluntary feedback. Movement is a brief entrance, respects reduced-motion preferences, and stays in document flow. Bridget remains a predefined local helper; parents choose the pace. No chat model, child profiling or automatic navigation is introduced.
