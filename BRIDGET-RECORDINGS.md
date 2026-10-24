# Bridget recording handoff

The existing practice arena has 16 fixed narration entries in `arena-voice.js`: eight Hebrew and eight English. These are **practice-arena** prompts, not the four-step Bridget welcome tour in `app.js`.

## Record these eight Hebrew clips

| Filename | Exact narration |
| --- | --- |
| `he-0.mp3` | זהו תרגול בדיוני להורה — לא אבחון ולא חיזוי של הילד. |
| `he-1.mp3` | בחרו דמות להורה ודמות לילד/ה. אפשר להחליף בכל רגע. |
| `he-2.mp3` | בחרו רגע אחד לתרגול. אפשר לחזור לאחרים בהמשך. |
| `he-3.mp3` | בחרו חוזקה אחת ודרך תמיכה אחת. המטרה היא לעבוד עם הכוחות, לא נגד הילד. |
| `he-4-screen.mp3` | הזמן הסתיים והילד מסרב אם היית אוהב/ת אותי, היית נותנ/ת לי עוד! כולם ממשיכים לשחק. |
| `he-4-homework.mp3` | יש ידע, אבל אין התנעה אני לא עושה את זה. זה מטומטם ואני גרוע/ה בזה. |
| `he-4-family.mp3` | כולם מסתכלים והבושה עולה עזבו אותי! אני שונא/ת את כולכם! |
| `he-5.mp3` | בחרו עם מי לשתף. רק הכרטיס הזה ישותף — לא הניסיונות שלכם. |

Use exactly the existing copy above for mapping. Punctuation may be spoken naturally. Review scenario readings carefully before publishing; no identifying child or family information should be included.

## Add a recording

1. Record one line and export as MP3 (also accepts M4A, WAV or OGG).
2. Put it at `audio/he-0.mp3` (replace the name with the matching ID).
3. Run `node prepare-voice.mjs` from the repository root.
4. Commit the new audio file and the regenerated `arena-voice.js`, then deploy a preview.

The script detects files already in `audio/` and writes relative URLs. Missing files remain `null`; playback can fall back to local device speech or leave the text readable. There is no autoplay, and audio stops when the step, language, or modal changes. The play button pauses and resumes the current clip.

The ElevenLabs `--generate` option is optional and **not** needed for manual recordings. Never place API keys or user content in frontend JavaScript. This implementation does not send user input to a voice provider.

## Verification

Run `node --check guide-arena.js`, `node --check prepare-voice.mjs`, `node --test tests.mjs`, and `node prepare-voice.mjs` in a working copy. Verify keyboard play/pause, step transitions, modal close, Hebrew/English, audio missing/error, backgrounding the page, reduced-motion preference, and narrow mobile screens in a browser. Test with an actual recording before marking audio quality and real-device behavior as verified.

**Not yet covered:** The separate four-screen Bridget welcome tour has no corresponding entries in `arena-voice.js`. It should not silently reuse practice-arena narration.
