# Entry flow update — 22 October 2026

Status: source prepared, not published. Production deployment was rejected by automatic approval review because the existing guide includes the owner's public contact details and professional biography. Explicit approval for this destination is pending. The production CSP remains frame-ancestors 'none'.

## Attention assessment (design inference, not eye tracking)

The current desktop screenshot showed an oversized headline, a large character and three competing actions. A repeating animated prompt sat beside the character's lower body. These are observations of the old live page, not measured heatmap data.

Intended hierarchy after edits:
1. Short promise and one prominent start button.
2. Optional brief guided tour, visually quieter.
3. Bridget's prompt on the right at waist level; arrow stops after three cycles.

## Prepared journey

1. Entry: one primary action; shorter introduction.
2. Identification: optional role only (parent, family/caregiver, education, or skip). No account, authentication, name or email. Role is in memory for this visit only.
3. Situation: choose one moment from four examples or open all situations.
4. Action: existing action card with phrase, small action and options to save/practice/share.
5. Optional tour: four brief screens, back/skip available; ends at the entry flow.

## Verification and limits

- Eight existing source/catalog tests passed. JavaScript syntax checks passed.
- The old live desktop opening was inspected. Revised visual layout and journey have NOT been browser-validated because publishing is blocked.
- Mobile CSS prepared for small screens. mobile-check.html is a local QA harness with 360/390/430px iframes; it is excluded from production. This harness was NOT opened successfully in the restricted cloud browser. No real-device or responsive browser validation claimed.
- No user eye tracking, heatmap analytics, accessibility certification or measured conversion claims.
- Do not mark this update complete until production/browser checks are performed after authorization.

## Voice

The existing browser speech engine read the whole stage, including buttons. It now reads short fixed narration and selects a matching language voice when available. A visible label distinguishes device speech from ElevenLabs.

prepare-voice.mjs prepares 16 fixed narration entries. With ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID supplied securely in the build environment, `node prepare-voice.mjs --generate` generates Hebrew MP3 assets using eleven_v3. No user-entered text is sent and no credentials are shipped to the browser. Generated assets then need listening review and deployment. No ElevenLabs audio has been generated or listened to yet; no account/key was available. Desired voice: warm adult Hebrew, clear and assertive without sounding stern, measured pace.
