"use strict";
const IS_BROWSER = typeof document !== "undefined";
const STORE = "howtoadhd-pilot-v1";
const initial = {
  lang: "he",
  view: "home",
  age: "all",
  search: "",
  scenario: null,
  stepMode: "normal",
  followQuestion: null,
  simStage: 0,
  simPick: null,
  tourStep: 0,
  role: "",
};
const state = { ...initial };
let saved = [];
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function t(he, en) {
  return state.lang === "he" ? he : en;
}
function readSaved() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) || "[]");
    return Array.isArray(v)
      ? v
          .filter(
            (x) =>
              x && typeof x.id === "string" && typeof x.scenario === "string",
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}
function persist() {
  try {
    localStorage.setItem(STORE, JSON.stringify(saved));
    return true;
  } catch {
    toast(t("אי אפשר לשמור בדפדפן הזה", "Unable to save in this browser"));
    return false;
  }
}
const scenarios = [
  {
    id: "morning",
    age: "5-9",
    emoji: "☀️",
    title: ["הבוקר מתחיל במאבק", "Mornings turn into battles"],
    desc: [
      "כל מעבר קטן גורר התנגדות, וכולם ממהרים.",
      "Every small transition triggers a struggle when time is short.",
    ],
    why: [
      "מעברים, עומס הוראות וקושי להתחיל יכולים להפוך את הבוקר להצפה.",
      "Transitions and too many instructions can make getting started overwhelming.",
    ],
    step: [
      "בחרו פעולה אחת בלבד: לנעול נעליים. שבו ליד הילד והציעו להתחיל יחד.",
      "Choose one action only: put on shoes. Sit nearby and offer to begin together.",
    ],
    small: [
      "הניחו נעל אחת ליד הדלת. זה הכול לעכשיו.",
      "Put one shoe by the door. That is enough for now.",
    ],
    alternative: [
      "הציעו בחירה מצומצמת: נעל ימין או שמאל קודם?",
      "Offer two choices: right shoe or left shoe first?",
    ],
    script: [
      '"אני רואה שקשה להתחיל. בוא נבחר רק נעל אחת, ואני איתך."',
      "“Getting started looks hard. Let’s do just one shoe. I’m here.”",
    ],
    question: [
      [
        "יש לחץ זמן",
        "זה קורה גם בלי לחץ",
        "Time is tight",
        "It also happens on relaxed days",
      ],
    ],
    advice: [
      [
        "הורידו ציפייה אחת מהבוקר ושמרו על טון שקט.",
        "נסו לתרגל בחירת פעולה אחת בשעה רגועה.",
        "Drop one expectation for now and keep your voice steady.",
        "Practice choosing one action during an unhurried moment.",
      ],
    ],
    risk: [
      "אם הילד במצוקה קשה או מסרב באופן מתמשך ללכת לבית הספר, שווה לשוחח עם הצוות החינוכי ואיש מקצוע.",
      "If distress or school refusal persists, involve the school team and a qualified professional.",
    ],
  },
  {
    id: "homework",
    age: "10-13",
    emoji: "✏️",
    title: ["שיעורי הבית לא מתחילים", "Homework never gets started"],
    desc: [
      "המחברת פתוחה, הזמן עובר, וההתנעה לא מגיעה.",
      "The notebook is open, but starting feels impossible.",
    ],
    why: [
      "תחילת משימה עשויה לדרוש יותר תמיכה מהביצוע עצמו.",
      "Starting a task may require more support than doing it.",
    ],
    step: [
      "הניחו דף אחד על השולחן וסמנו יחד שאלה אחת להתחלה.",
      "Put out one page and choose just one question together.",
    ],
    small: [
      "פתחו את המחברת בעמוד המתאים. לא צריך עדיין לענות.",
      "Open the notebook to the right page. No answering yet.",
    ],
    alternative: [
      "שאלו: לקרוא יחד את השאלה או שאני אקריא?",
      "Ask: Shall we read the question together, or should I read it aloud?",
    ],
    script: [
      '"לא חייבים לסיים הכול עכשיו. בוחרים רק איפה מתחילים."',
      "“We don’t have to finish everything now. We’re just choosing where to start.”",
    ],
    question: [
      [
        "קשה להתחיל",
        "קשה להתמיד",
        "Starting is hard",
        "Staying with it is hard",
      ],
    ],
    advice: [
      [
        "נסו טקס התחלה קבוע של 90 שניות בלי דרישה לתוצאה.",
        "חלקו לעבודה קצרה והפסקה מתוכננת מראש.",
        "Try a 90-second start ritual without demanding an outcome.",
        "Use a short work interval followed by a planned break.",
      ],
    ],
  },
  {
    id: "screens",
    age: "14-18",
    emoji: "📱",
    title: ["המסך נגמר, הוויכוח מתחיל", "Screen time ends in an argument"],
    desc: [
      "המעבר מהטלפון לפעילות אחרת מדליק את כולם.",
      "Moving away from a device sets off a conflict.",
    ],
    why: [
      "הפסקה פתאומית של פעילות מתגמלת יכולה לעורר התנגדות.",
      "Abruptly stopping a rewarding activity can bring strong resistance.",
    ],
    step: [
      "בזמן רגוע, קבעו יחד סימן מוסכם למעבר הבא.",
      "At a calm moment, agree together on a transition cue.",
    ],
    small: [
      "שאלו מה יעזור לקבל התראה לפני סיום. הקשיבו בלי להתווכח.",
      "Ask what kind of warning would help before stopping. Listen first.",
    ],
    alternative: [
      "בחרו יחד נקודת עצירה טבעית: סוף סרטון, משחקון או שיר.",
      "Agree on a natural stopping point: end of a video, level, or song.",
    ],
    script: [
      '"אני לא רוצה להפתיע אותך בכיבוי. נחליט יחד איך מסיימים."',
      "“I don’t want the shutdown to surprise you. Let’s agree on how to finish.”",
    ],
    question: [
      [
        "יש הסכם קודם",
        "אין הסכם קודם",
        "We already agreed",
        "We have no agreement",
      ],
    ],
    advice: [
      [
        "חזרו על ההסכם אחרי שנרגעים, לא בשיא הוויכוח.",
        "התחילו בשיחה על צרכים וציפיות לפני קביעת מגבלות.",
        "Revisit the agreement when calm, not in the middle of conflict.",
        "Start with needs and expectations before setting limits.",
      ],
    ],
  },
  {
    id: "overwhelm",
    age: "all",
    emoji: "🌧️",
    title: ["יש התפרצות רגשית", "An emotional meltdown"],
    desc: [
      "הקול עולה, המילים נתקעות, והכול מרגיש גדול מדי.",
      "Voices rise and the moment feels too big.",
    ],
    why: [
      "ברגע של הצפה קשה לקלוט הסברים, דרישות או הטפות.",
      "During overwhelm, explanations and demands may be hard to process.",
    ],
    step: [
      "הקטינו דיבור ורעש. הבטיחו בטיחות ושמרו נוכחות רגועה.",
      "Reduce words and noise. Keep everyone safe and remain calmly present.",
    ],
    small: [
      "הפסיקו להסביר לעשר שניות. נשמו והתבוננו בבטיחות.",
      "Stop explaining for ten seconds. Breathe and check for safety.",
    ],
    alternative: [
      "הציעו מרחב שקט או להישאר ליד הילד בלי שאלות.",
      "Offer a quiet space or calm company without questions.",
    ],
    script: [
      '"אני פה. נדבר כשיהיה קצת יותר קל."',
      "“I’m here. We can talk when things feel easier.”",
    ],
    question: [
      [
        "בטוחים כרגע",
        "יש סכנה לפגיעה",
        "Everyone is safe",
        "There is danger of injury",
      ],
    ],
    advice: [
      [
        "הישארו עם מעט מילים. חזרו לשיחה ולתיקון מאוחר יותר.",
        "אם מישהו בסכנה מיידית, פנו לשירותי חירום מקומיים. אל תסתפקו באפליקציה.",
        "Use few words now; revisit and repair later.",
        "If anyone is in immediate danger, contact local emergency services. Do not rely on this app.",
      ],
    ],
    risk: [
      "במקרה של סכנה מיידית לפגיעה בעצמי או באחרים, פנו לשירותי חירום מקומיים.",
      "For immediate danger of harm to self or others, contact local emergency services.",
    ],
  },
  {
    id: "teacher",
    age: "all",
    emoji: "🏫",
    title: ["איך מדברים עם המורה?", "Talking with a teacher"],
    desc: [
      "רוצים שיתוף פעולה בלי להגיע לשיחת האשמות.",
      "Build cooperation without a blame-filled conversation.",
    ],
    why: [
      "בקשה אחת ברורה מאפשרת לשתף פעולה ולבדוק שינוי.",
      "One clear request helps everyone collaborate and review progress.",
    ],
    step: [
      "נסחו עובדה אחת ללא שיפוט, ובקשו ניסיון משותף לשבוע.",
      "Share one observation without blame and request a one-week trial.",
    ],
    small: [
      "כתבו משפט פתיחה עובדתי אחד.",
      "Write a single factual opening sentence.",
    ],
    alternative: [
      "בקשו שיחת טלפון קצרה במקום שרשור ארוך של הודעות.",
      "Request a short phone call instead of a long message chain.",
    ],
    script: [
      '"שמתי לב שהתחלת משימות קשה לאחרונה. נוכל לנסות סימן פתיחה קבוע לשבוע ולראות מה עוזר?"',
      "“Starting tasks has been hard lately. Could we try a consistent start cue for a week and see what helps?”",
    ],
    question: [
      [
        "יש קשר טוב",
        "הקשר מתוח",
        "We have a good relationship",
        "Communication feels tense",
      ],
    ],
    advice: [
      [
        "בקשו לתאם מדד קטן שאפשר לבדוק בעוד שבוע.",
        "פתחו בעובדה ניטרלית והזמינו את נקודת המבט של המורה.",
        "Agree on one small indicator to review next week.",
        "Lead with a neutral observation and invite the teacher’s perspective.",
      ],
    ],
  },
  {
    id: "friends",
    age: "10-13",
    emoji: "🫂",
    title: ["קשה עם חברים", "Friendships feel complicated"],
    desc: [
      "עלבון, דחייה, או קושי להבין מה קרה.",
      "Hurt feelings, rejection, or difficulty reading a situation.",
    ],
    why: [
      "לפני עצות, לפעמים צריך קודם לתקף תחושה ולהבין את הסיפור.",
      "Before offering advice, it often helps to acknowledge the feeling.",
    ],
    step: [
      "שאלו שאלה אחת פתוחה והקשיבו לסיפור בלי למהר לפתור.",
      "Ask one open question and listen before trying to fix it.",
    ],
    small: [
      'אמרו: "זה נשמע כואב." ועצרו להקשיב.',
      "Say: “That sounds painful.” Then pause and listen.",
    ],
    alternative: [
      "אפשר להציע לצייר מה קרה במקום לדבר מיד.",
      "Offer to draw what happened instead of talking immediately.",
    ],
    script: [
      '"רוצה שאקשיב, או שנחשוב יחד מה לעשות?"',
      "“Would you like me to listen, or think together about what to do?”",
    ],
    question: [
      [
        "רוצה לדבר",
        "לא רוצה לדבר",
        "They want to talk",
        "They do not want to talk",
      ],
    ],
    advice: [
      [
        "שאלו מה היה החלק הכי קשה עבורם.",
        "תנו מרחב והשאירו אפשרות לחזור לשיחה מאוחר יותר.",
        "Ask which part was hardest for them.",
        "Give space and leave the door open for later.",
      ],
    ],
  },
  {
    id: "school",
    age: "5-9",
    emoji: "🎒",
    title: ["לא רוצה ללכת לבית הספר", "Refusing to go to school"],
    desc: [
      '"אני לא הולך/ת" — ואי אפשר פשוט לצאת מהבית.',
      "“I’m not going” and leaving the house feels impossible.",
    ],
    why: [
      "הימנעות יכולה להיות קשורה לעומס, חרדה, קושי חברתי או חוויות בכיתה. לא מניחים סיבה אחת.",
      "Avoidance can have many causes. Do not assume one explanation.",
    ],
    step: [
      "בזמן רגוע שאלו מה החלק הכי קשה ביום: לצאת, להיפרד או להיות בכיתה?",
      "At a calm time ask which part is hardest: leaving, separating, or being in class?",
    ],
    small: [
      'שאלו רק: "מה הכי קשה בבוקר?" בלי לתקן את התשובה.',
      "Ask only: “What is the hardest part of the morning?” Without correcting.",
    ],
    alternative: [
      "הציעו לצייר את יום הלימודים ולסמן חלק אחד שמכביד.",
      "Draw the school day and mark one difficult part.",
    ],
    script: [
      '"אני מאמינה שקשה לך. אני רוצה להבין מה קורה, ונחשוב יחד עם בית הספר איך להקל."',
      "“I believe this is hard. I want to understand, and we can work with school on support.”",
    ],
    question: [
      [
        "קושי בפרידה",
        "קושי במהלך היום",
        "Separation is hard",
        "School day feels hard",
      ],
    ],
    advice: [
      [
        "בחנו עם הצוות טקס פרידה צפוי וקצר.",
        "שתפו את הצוות בבקשה ממוקדת להבנת מוקד הקושי.",
        "Explore a predictable, short goodbye ritual with school.",
        "Ask the school team to help identify the specific difficulty.",
      ],
    ],
    risk: [
      "אם יש חשד לבריונות, פגיעה או חרדה משמעותית, פנו לגורם מקצועי ולצוות החינוכי בהקדם.",
      "If bullying, abuse, or significant anxiety is suspected, involve qualified professionals and the school promptly.",
    ],
  },
  {
    id: "teen",
    age: "14-18",
    emoji: "💬",
    title: ["המתבגר/ת לא משתף/ת", "My teen shuts me out"],
    desc: [
      '"עזבו אותי" הוא לפעמים הדבר היחיד ששומעים.',
      "“Leave me alone” feels like the only response.",
    ],
    why: [
      "עצמאות, פרטיות ורגישות לעיתוי משפיעות על שיחות עם מתבגרים.",
      "Autonomy, privacy and timing matter in conversations with teens.",
    ],
    step: [
      "בקשו רשות לשיחה קצרה ותנו אפשרות לבחור מתי.",
      "Ask permission for a short chat and let them choose when.",
    ],
    small: [
      'השאירו משפט פתוח: "אני פה כשתרצה/י."',
      "Leave an open sentence: “I’m here when you want.”",
    ],
    alternative: [
      "הציעו נסיעה קצרה או הליכה במקום שיחה פנים מול פנים.",
      "Try a short drive or walk rather than a face-to-face talk.",
    ],
    script: [
      '"אני לא צריכה תשובה עכשיו. חשוב לי שתדע/י שאני זמינה."',
      "“You don’t need to answer now. I want you to know I’m available.”",
    ],
    question: [
      ["זה חדש", "זה דפוס מתמשך", "This is new", "This has been going on"],
    ],
    advice: [
      [
        "התעניינו בעדינות בשינוי האחרון ובהרגשה הכללית.",
        "חפשו רגעי חיבור ללא דרישה לחשיפה, ושקלו ייעוץ אם עולה דאגה.",
        "Gently explore what changed and how they are feeling.",
        "Create connection without pressuring disclosure; seek professional support if worried.",
      ],
    ],
  },
];
const labels = {
  he: {
    home: "בית",
    scenarios: "סיטואציות",
    learn: "להבין",
    tools: "ערכת כלים",
    mine: "הצעדים שלי",
    privacy: "פרטיות ובטיחות",
    disclaimer: "מידע חינוכי בלבד · לא תחליף לאבחון או לטיפול",
  },
  en: {
    home: "Home",
    scenarios: "Situations",
    learn: "Learn",
    tools: "Toolkit",
    mine: "My steps",
    privacy: "Privacy & safety",
    disclaimer: "Educational guidance only · not diagnosis or treatment",
  },
};
const guideMap = {
  morning: "c7",
  homework: "c7",
  screens: "c10",
  overwhelm: "c1",
  teacher: "c8",
  friends: "c9",
  school: "c6",
  teen: "c9",
};
function title(s) {
  return esc(s.title[state.lang === "he" ? 0 : 1]);
}
function field(s, key) {
  const v = s[key];
  return esc(Array.isArray(v) ? v[state.lang === "he" ? 0 : 1] : v);
}
function iconCard(s) {
  return `<article class="card clickable" data-scenario="${s.id}" tabindex="0" role="button" aria-label="${title(s)}"><div class="iconbox" aria-hidden="true">${s.emoji}</div><h3>${title(s)}</h3><p>${field(s, "desc")}</p><span class="bottom">${t("בואו נתחיל בצעד אחד ←", "Explore one small step →")}</span></article>`;
}
// Closed choices only: no scenario, saved steps, identifiers or personal text.
const pilotQuestions = [
  ["relevance", "מצאתם סיטואציה רלוונטית?", "Did you find a relevant situation?", [["yes","כן","Yes"],["partly","חלקית","Partly"],["no","לא","No"]]],
  ["action", "הצלחתם לבצע צעד שהוצע?", "Were you able to carry out a suggested step?", [["yes","כן","Yes"],["partly","חלק ממנו","Part of it"],["no","ניסיתי ולא הצלחתי","Tried, but could not"],["not_yet","עוד לא ניסיתי","Have not tried yet"]]],
  ["return", "תרצו להשתמש באפליקציה שוב?", "Would you use the app again?", [["yes","כן","Yes"],["maybe","אולי","Maybe"],["no","לא","No"]]],
  ["barrier", "איפה היה קשה? (לא חובה)", "Where was it difficult? (optional)", [["skip","מעדיפים לא לענות","Prefer not to answer"],["none","לא היה קושי","No difficulty"],["finding","למצוא סיטואציה","Finding a situation"],["understanding","להבין את ההצעה","Understanding the suggestion"],["adapting","להתאים את הצעד","Adapting the step"],["trying","לבצע בבית","Trying it at home"],["saving","לשמור או לחזור לצעד","Saving or revisiting"],["technical","תקלה טכנית","Technical problem"]]]
];
function pilotFeedbackText(values) {
  if (values.consent !== "yes") return null;
  const lines = [];
  for (const [key, he, en, options] of pilotQuestions) {
    const choice = options.find(([id]) => id === (values[key] || (key === "barrier" ? "skip" : "")));
    if (!choice) return null;
    lines.push(`${he} / ${en}: ${choice[1]} / ${choice[2]}`);
  }
  return "How-to-ADHD | Pilot feedback v1\n" + lines.join("\n");
}
function openPilotFeedback() {
  modal({heading:t("משוב קצר לפיילוט", "Short pilot feedback"),body:`<p>${t("לא נבקש שמות, פרטי ילדים או מידע רפואי. התשובות אינן נשמרות. אפשר לסגור בכל רגע.", "No names, child details or medical information. Answers are not saved. You can close at any time.")}</p><form id="pilotForm">${pilotQuestions.map(([key,he,en,options])=>`<fieldset><legend>${t(he,en)}</legend>${options.map(([id,h,e])=>`<label class="pilot-choice"><input type="radio" name="${key}" value="${id}" ${key !== "barrier" ? "required" : ""}> ${t(h,e)}</label>`).join("")}</fieldset>`).join("")}<p class="mini-copy">${t("יועתקו רק התשובות שסימנתם וכותרת גרסת המשוב. לא מצורפים הסיטואציה, הצעדים השמורים או פרטי המכשיר. ההעתקה אינה שליחה.", "Only selected answers and the feedback version heading are copied. No situation, saved steps or device details are attached. Copying does not send anything.")}</p><label class="pilot-choice"><input type="checkbox" name="consent" value="yes" required> ${t("אני מסכימ/ה להעתיק את התשובות המסומנות כדי לשתף אותן עם צוות הפיילוט.", "I consent to copy the selected answers to share with the pilot team.")}</label><button type="button" class="btn primary" data-action="copyFeedback">${t("העתקת התשובות שסימנתי", "Copy my selected answers")}</button><p id="feedbackStatus" role="status"></p></form><p class="mini-copy">${t("לאחר ההעתקה אפשר להדביק בשיחה עם מי שהזמין אתכם לפיילוט. שירות ההודעות עשוי לזהות אתכם; המשוב אינו מובטח כאנונימי.", "After copying, paste into your conversation with your pilot organizer. Your messaging service may identify you; feedback is not guaranteed anonymous.")}</p>`});
}
function bridgetGuide() {
  const detail = state.view === "detail";
  const stage = state.view === "mine" ? 4 : detail ? (state.stepMode !== "normal" || state.followQuestion !== null ? 3 : 2) : state.view === "home" ? 0 : 1;
  const messages = [
    ["אני ברידג׳ט. נתחיל ברגע אחד, ונמצא צעד קטן שאפשר לנסות. אתם בוחרים את הקצב.", "I’m Bridget. We’ll start with one moment and find a small step to try. You set the pace."],
    ["נבחר סיטואציה שמוכרת לכם. אפשר גם לחזור ולהחליף בחירה.", "Choose a familiar situation. You can always go back and choose another."],
    ["נקרא הצעה אחת. אם היא גדולה מדי, אפשר להקטין אותה או לבחור דרך אחרת.", "Read one suggestion. If it feels too big, make it smaller or try another way."],
    ["מצאתם דרך שמתאימה יותר? אפשר לשמור ולנסות בזמן שנכון לכם.", "Found a better fit? Save it and try when the time feels right."],
    ["אחרי ניסיון אפשר לחזור לצעד. גם ניסיון חלקי עוזר ללמוד. אם מתאים, שתפו במשוב קצר.", "Return after trying. A partial attempt also helps us learn. Share short feedback if you wish."]
  ];
  const names = [["בחירה","Choose"],["הצעה","Suggestion"],["התאמה","Adapt"],["ניסיון וחזרה","Try and revisit"]];
  return `<aside class="bridget-guide" aria-label="${t("ברידג׳ט מלווה אתכם", "Bridget guides you")}"><img src="bridget-next-step.webp" width="80" height="100" alt=""><div><strong>${t("ברידג׳ט · צעד אחד בכל פעם", "Bridget · One step at a time")}</strong><p>${t(...messages[stage])}</p><ol class="journey">${names.map(([he,en],i)=>`<li ${i === Math.max(0,stage-1) ? 'aria-current="step"' : ''}>${t(he,en)}</li>`).join("")}</ol><div class="action-row"><button class="text-link" ${detail ? 'data-action="saveStep"' : 'data-view="scenarios"'}>${detail ? t("אשמור לנסות", "Save to try") : t("לבחירת סיטואציה", "Choose a situation")}</button><button class="text-link" data-action="pilotFeedback">${t("משוב קצר לפיילוט", "Short pilot feedback")}</button></div></div></aside>`;
}

function renderHome() {
  const featured = [scenarios[0], scenarios[1], scenarios[2]];
  return `<section class="hero"><div><span class="eyebrow">✦ ${t("מרחב חדש להורים · גרסת פיילוט", "A new space for parents · Pilot edition")}</span><h1>${t('פחות ״מה עושים עכשיו?״<br><span class="highlight">יותר צעד קטן קדימה.</span>', 'Less “what do I do now?”<br><span class="highlight">One small step forward.</span>')}</h1><p class="lead">${t("רגע קשה בבית? בוחרים מה קורה ומוצאים דבר אחד שאפשר לנסות. בלי שיפוטיות, בקצב שלכם.", "Practical tools for the moments when attention, emotions and everyday life collide. No judgment, no overwhelm — just one thing to try.")}</p><div class="hero-actions"><button class="btn primary" data-action="welcome">${t("בואו נמצא צעד ראשון ←", "Find my first step →")}</button><button class="text-link" data-action="bridgetTour">${t("קודם, סיבוב קצר עם ברידג׳ט", "First, a quick tour with Bridget")}</button></div><p class="hero-note">✓ ${t("לא צריך הרשמה · ללא הזנת פרטים על הילדים · 1–2 דקות לצעד ראשון", "No account · No child details required · 1–2 minutes to a first step")}</p></div><div class="bridget-scene"><div class="speech">${t("היי, אני ברידג׳ט ✨<br>מה הלאה?", "Hi, I’m Bridget ✨<br>What’s next?")}</div><img class="bridget bridget-picture" src="bridget-next-step.webp" alt="Bridget, your friendly guide, presenting the next step" width="500" height="625" loading="eager" decoding="async"></div></section><div class="section-head"><div><h2>${t("מוכר לכם מהבית?", "Does this feel familiar?")}</h2><p>${t("בחרו רגע אמיתי. נחשוב יחד על הצעד הבא.", "Choose a real moment. Find the next practical move.")}</p></div><button class="text-link" data-view="scenarios">${t("כל הסיטואציות ←", "See all situations →")}</button></div><div class="cards">${featured.map(iconCard).join("")}</div><section class="steps-band"><div><h3>${t("הדרך של Bridget: פחות לחשוב, יותר להתחיל", "The Bridget way: start, don’t spiral")}</h3><p>${t("כל דבר גדול מתחיל במהלך קטן, בהסכמה שלכם.", "Every big challenge begins with one consent-based action.")}</p></div><div class="mini-step"><strong>01</strong>${t("מבינים מה קורה", "Understand the moment")}</div><div class="mini-step"><strong>02</strong>${t("בוחרים פעולה אחת", "Choose one action")}</div><div class="mini-step"><strong>03</strong>${t("מנסים, לומדים, ממשיכים", "Try, learn, continue")}</div></section><div class="section-head"><div><h2>${t("לפעמים צריך רק משפט אחד טוב", "Sometimes one sentence helps")}</h2><p>${t("תרגול קצר, בלי ציונים ובלי מבחן", "A tiny rehearsal, no scores or judgment")}</p></div></div><div class="card clickable" role="button" tabindex="0" data-action="sim" style="min-height:145px;background:#eaf1ec;border-color:#d8e8db"><div class="iconbox" style="background:white">🎭</div><h3>${t("נסו שיחה לפני שהיא מתרחשת", "Practice a conversation before it happens")}</h3><p>${t("שתי תגובות אפשריות, והזדמנות לבחור מחדש.", "Two response options and a chance to try again.")}</p><span class="bottom">${t("נכנסים לתרגול ←", "Start practice →")}</span></div>`;
}
function renderScenarios() {
  const ages = [
    ["all", t("כולם", "All ages")],
    ["5-9", "5–9"],
    ["10-13", "10–13"],
    ["14-18", "14–18"],
  ];
  const term = state.search.toLocaleLowerCase();
  const list = scenarios.filter(
    (s) =>
      (state.age === "all" || s.age === state.age || s.age === "all") &&
      (!term ||
        [...s.title, ...s.desc].join(" ").toLocaleLowerCase().includes(term)),
  );
  return `<section class="page-hero"><span class="eyebrow">${t("מספרים קטנים, רגעים גדולים", "Small steps, real life")}</span><h1 class="page-title">${t("מה קורה אצלכם עכשיו?", "What is happening right now?")}</h1><p class="page-subtitle">${t("לא חייבים למצוא הגדרה מדויקת. בחרו את מה שהכי קרוב.", "No perfect label needed. Pick what feels closest.")}</p><input id="searchScenario" class="search-box" type="search" placeholder="${t("חפשו: בוקר, מסכים, בית ספר...", "Search: mornings, screens, school...")}" value="${esc(state.search)}" aria-label="${t("חיפוש סיטואציות", "Search situations")}"><div class="chips">${ages.map(([v, l]) => `<button data-age="${v}" class="chip ${state.age === v ? "on" : ""}" aria-pressed="${state.age === v}">${l}</button>`).join("")}</div></section><div class="cards">${list.map(iconCard).join("") || `<div class="empty">${t("לא מצאנו התאמה. נסו מילה אחרת או הציגו את כל הגילים.", "No matching situation. Try another word or select all ages.")}</div>`}</div>`;
}
function renderDetail() {
  const s = scenarios.find((x) => x.id === state.scenario);
  if (!s) {
    state.view = "scenarios";
    return renderScenarios();
  }
  const opts = s.question[0];
  const ans = s.advice[0];
  let chosen = state.followQuestion;
  const guidance =
    chosen === null
      ? ""
      : `<div class="inline-feedback">${esc(ans[state.lang === "he" ? chosen : chosen + 2])}</div>`;
  return `<div class="detail-wrap"><button class="back" data-view="scenarios">${t("→ חזרה לכל הסיטואציות", "← Back to situations")}</button><article class="detail"><span class="eyebrow">${t("צעד אחד, בקצב שלכם", "One step, your pace")}</span><h1>${s.emoji} ${title(s)}</h1><p class="summary">${field(s, "desc")}</p><p class="hint">${field(s, "why")}</p><section class="step-panel" aria-label="${t("הצעד הבא", "Next step")}"><div class="tag">✳ Bridget · ${t("מה אפשר לנסות עכשיו", "What to try next")}</div><h2>${field(s, state.stepMode === "small" ? "small" : state.stepMode === "alternative" ? "alternative" : "step")}</h2><div class="script"><strong>${t("משפט שאפשר לומר:", "Words you can use:")}</strong><br>${field(s, "script")}</div><div class="action-row"><button class="btn secondary" data-action="stepMode" data-mode="small">${t("תעשו את זה קטן יותר", "Make it smaller")}</button><button class="btn secondary" data-action="stepMode" data-mode="alternative">${t("אפשרות אחרת", "Try another way")}</button><button class="btn primary" data-action="saveStep">${t("אשמור לנסות", "Save to try")}</button></div></section>${s.risk ? `<div class="callout">${field(s, "risk")}</div>` : ""}<section class="question-box"><h3>${t("שאלה אחת שיכולה לדייק את הצעד", "One question to personalize the next step")}</h3><div class="choice-list"><button class="choice ${chosen === 0 ? "on" : ""}" data-choice="0">${esc(opts[state.lang === "he" ? 0 : 2])}</button><button class="choice ${chosen === 1 ? "on" : ""}" data-choice="1">${esc(opts[state.lang === "he" ? 1 : 3])}</button></div>${guidance}</section><aside class="learn-bridge"><span>◎</span><div><strong>${t("רוצים להבין למה זה קורה?", "Want to understand why this happens?")}</strong><p>${t("פתחו את הפרק המתאים במדריך החזותי וחזרו לכאן כשתרצו לפעול.", "Open the matching visual chapter, then return here when you are ready to act.")}</p></div><a class="btn secondary" href="guide.html#${guideMap[s.id]}">${t("להסבר ולתרשים", "Read and see the diagram")}</a></aside><div class="action-row"><button class="btn ghost" data-action="copyScript">${t("העתיקו משפט לשימוש", "Copy the sentence")}</button><button class="btn ghost" data-action="shareCare">${t("הכינו סיכום לשיתוף", "Prepare caregiver summary")}</button><button class="btn ghost" data-action="done">${t("ניסינו — סגרו לולאה ✓", "Tried it — close the loop ✓")}</button></div></article></div>`;
}
function renderLearn() {
  const topics = [
    ["🌧️", "ויסות רגשי וחושי", "Emotional and sensory regulation", "c1"],
    ["🧠", "תפקודים ניהוליים", "Executive functions", "c7"],
    ["🏫", "למידה ובית הספר", "Learning and school", "c8"],
    ["🌱", "חוסן, קשר וגבולות", "Resilience, connection and boundaries", "c9"],
    ["🩺", "טיפול ותרופות", "Treatment and medication", "c3"],
    ["🧩", "כשיש קושי נוסף", "When something else may be present", "c6"],
  ];
  return `<section class="page-hero"><span class="eyebrow">${t("להבין לעומק · בלי ללכת לאיבוד", "Learn more · without getting lost")}</span><h1 class="page-title">${t("בחרו נושא אחד שמעסיק אתכם", "Choose one topic that matters now")}</h1><p class="page-subtitle">${t("המדריך החזותי מרכז ידע, תרשימים ופעולות שאפשר לנסות בבית. כל כרטיס פותח ישר בפרק הרלוונטי.", "The visual guide combines knowledge, diagrams and practical actions. Each card opens the relevant chapter.")}</p></section><div class="knowledge-grid">${topics.map(([icon, he, en, id]) => `<a class="knowledge-card" href="guide.html#${id}"><span>${icon}</span><strong>${t(he, en)}</strong><small>${t("פתיחת הפרק ←", "Open chapter →")}</small></a>`).join("")}</div><section class="deep-actions"><div><span class="eyebrow">${t("מוכנים לעשות", "Ready to practice")}</span><h2>${t("להפוך הבנה לפעולה", "Turn understanding into action")}</h2><p>${t("עברו לזירת התרגול המלאה עם אווטרים, תרחישים, החלפת תפקידים וכרטיס שאפשר לשתף.", "Open the full Practice Studio with avatars, scenarios, role switching and a shareable action card.")}</p></div><div class="hero-actions"><a class="btn primary" href="guide.html#practice-arena">${t("ל‑Practice Studio", "Open Practice Studio")}</a><a class="btn secondary" href="guide.html#pdf-toolbox">${t("לדפי העבודה להדפסה", "Printable action sheets")}</a></div></section>`;
}
function renderTools() {
  const resources = [
    [
      "CDC — ADHD",
      "https://www.cdc.gov/adhd/",
      "מידע בסיסי על ADHD, תמיכה וטיפול",
      "ADHD information, support and treatment",
    ],
    [
      "CHADD",
      "https://chadd.org/",
      "משאבים להורים ומשפחות",
      "Resources for parents and families",
    ],
    [
      "NICE guideline NG87",
      "https://www.nice.org.uk/guidance/ng87",
      "הנחיות מקצועיות בתחום ADHD",
      "Clinical guidance on ADHD",
    ],
  ];
  return `<section class="page-hero"><span class="eyebrow">${t("ערכת כלים", "A practical toolkit")}</span><h1 class="page-title">${t("לא כל בעיה צריכה פתרון ענק", "Not every problem needs a big fix")}</h1><p class="page-subtitle">${t("עקרונות קצרים שאפשר לקחת הביתה.", "Short, practical principles to try at home.")}</p></section><div class="cards"><article class="card"><div class="iconbox">⏳</div><h3>${t("כלל 90 השניות", "The 90-second start")}</h3><p>${t("מתחילים פעולה לזמן קצר, בלי לדרוש השלמה. ההתחלה היא ההצלחה הראשונה.", "Start for a short time without demanding completion. Starting is a first success.")}</p><button class="bottom" data-action="tool90">${t("פתחו תרגול ←", "Open an exercise →")}</button></article><article class="card"><div class="iconbox">🪜</div><h3>${t("מפרקים פעולה", "Make it smaller")}</h3><p>${t('במקום "תתארגן" — בוחרים תנועה אחת שאפשר לראות ולעשות.', "Replace “get ready” with one visible, doable movement.")}</p><button class="bottom" data-scenario="morning">${t("דוגמה מהבוקר ←", "Morning example →")}</button></article><article class="card"><div class="iconbox">💬</div><h3>${t("משפטי גישור", "Bridge sentences")}</h3><p>${t("מזהים רגש, מציעים שיתוף פעולה, ומשאירים מקום לבחירה.", "Name the feeling, invite collaboration, leave room for choice.")}</p><button class="bottom" data-scenario="teacher">${t("דוגמה לשיחה ←", "Conversation example →")}</button></article><article class="card"><div class="iconbox">🎭</div><h3>${t("Practice Studio", "Practice Studio")}</h3><p>${t("תרגול מלא עם אווטרים, תרחישים, החלפת תפקידים ומשוב.", "Full practice with avatars, scenarios, role switching and feedback.")}</p><a class="bottom" href="guide.html#practice-arena">${t("לזירת התרגול ←", "Open the studio →")}</a></article><article class="card"><div class="iconbox">🖨️</div><h3>${t("דפי פעולה להדפסה", "Printable action sheets")}</h3><p>${t("שישה דפים קצרים, כולל תכנית לשינוי התראות בטלפון יחד עם הילד.", "Six short sheets, including a child-inclusive phone notification plan.")}</p><a class="bottom" href="guide.html#pdf-toolbox">${t("לערכת ההדפסה ←", "Open printables →")}</a></article></div><div class="section-head"><div><h2>${t("להעמיק ממקורות מוכרים", "Explore established resources")}</h2><p>${t("קישורים למקורות חיצוניים; אינם מהווים המלצה אישית או ייעוץ רפואי.", "External resources; not personalized medical guidance.")}</p></div></div><div class="resources">${resources.map(([name, url, he, en]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><span>${name} ↗</span><small>${t(he, en)}</small></a>`).join("")}</div><div class="safe">${t("חשוב: האתר אינו כלי אבחון או טיפול. אם יש חשש לבטיחות, פגיעה, או מצוקה קשה, פנו לגורם מקצועי או לשירותי חירום מקומיים.", "Important: This site does not diagnose or treat. For safety concerns, harm, or severe distress, seek qualified help or local emergency services.")}</div>`;
}
function renderMine() {
  return `<section class="page-hero"><span class="eyebrow">${t("המשך מעקב — רק אם בחרתם", "Follow-up — only if you choose")}</span><h1 class="page-title">${t("הצעדים שלי", "My next steps")}</h1><p class="page-subtitle">${t("המידע נשמר רק בדפדפן הזה. אין חשבון, ענן או הודעות תזכורת אוטומטיות.", "Stored only in this browser. No account, cloud sync or automatic notifications.")}</p></section>${
    saved.length
      ? `<div class="detail-wrap">${saved
          .map((i) => {
            const s = scenarios.find((x) => x.id === i.scenario);
            if (!s) return "";
            return `<article class="progress-item"><span class="pill">${i.status === "done" ? t("נוסה ✓", "Tried ✓") : t("מחכה לניסיון", "To try")}</span><h3>${title(s)}</h3><p>${field(s, i.mode === "small" ? "small" : i.mode === "alternative" ? "alternative" : "step")}</p><p><small>${esc(new Date(i.date).toLocaleDateString(state.lang === "he" ? "he-IL" : "en-US"))}</small></p><div class="small-actions"><button data-action="toggleSaved" data-id="${i.id}">${i.status === "done" ? t("להחזיר לרשימה", "Mark to retry") : t("ניסינו את זה ✓", "We tried it ✓")}</button><button data-action="revisit" data-id="${s.id}">${t("חזרה לסיטואציה", "Revisit")}</button><button data-action="removeSaved" data-id="${i.id}">${t("מחיקה", "Remove")}</button></div></article>`;
          })
          .join(
            "",
          )}</div><div class="action-row"><button class="btn secondary" data-action="export">${t("ייצוא הצעדים שלי", "Export my steps")}</button><button class="btn secondary" data-action="clear">${t("מחיקת הכול", "Delete all")}</button></div>`
      : `<div class="empty"><div class="big">🌱</div><h2>${t("עדיין אין כאן צעדים. וזה בסדר.", "No saved steps yet — that is okay.")}</h2><p>${t("בחרו סיטואציה, מצאו פעולה קטנה ושמרו אותה אם תרצו.", "Choose a situation, find a small action, and save it if you want.")}</p><button class="btn primary" data-view="scenarios">${t("בוחרים צעד ראשון", "Choose a first step")}</button></div>`
  }<section class="detail"><h2>${t("עזרו לנו ללמוד מהפיילוט", "Help improve the pilot")}</h2><p>${t("שלוש שאלות קצרות, רק אם מתאים לכם. אין שליחה אוטומטית.", "Three short questions, only if you wish. Nothing is sent automatically.")}</p><button class="btn secondary" data-action="pilotFeedback">${t("משוב קצר", "Short feedback")}</button></section>`;
}
function toast(msg) {
  if (!IS_BROWSER) return;
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3300);
}
function thoughtAnchor() {
  const notes = [
    [
      "מחשבות הן כמו עננים: אחת מגיעה, משתהה לרגע ומפנה מקום לבאה.",
      "Thoughts are like clouds: one arrives, stays for a moment, then makes room for the next.",
    ],
    [
      "מחשבות גדלות כשמטפחים אותן. בואו נטפח את אלה שמרגיעות ומחזקות.",
      "Thoughts grow when we feed them. Let’s feed the ones that calm and strengthen us.",
    ],
    [
      "תדברי אלייך יפה. גם את לומדת תוך כדי.",
      "Speak kindly to yourself. You are learning as you go.",
    ],
  ];
  const index =
    Math.max(
      0,
      ["home", "scenarios", "detail", "learn", "tools", "mine"].indexOf(
        state.view,
      ),
    ) % notes.length;
  return `<aside class="thought-anchor" aria-label="${t("תזכורת קטנה", "A small reminder")}"><span aria-hidden="true">☁</span><p>${t(notes[index][0], notes[index][1])}</p></aside>`;
}
function render() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "he" ? "rtl" : "ltr";
  document.title = "How to ADHD | " + t("צעד אחד קדימה", "One step forward");
  document.getElementById("lang").textContent =
    state.lang === "he" ? "EN" : "עברית";
  document.getElementById("brandline").textContent = t(
    "צעד קטן. שינוי גדול.",
    "Small steps. Real change.",
  );
  document.getElementById("privacyBtn").textContent = t(
    "פרטיות ובטיחות",
    "Privacy & safety",
  );
  document.getElementById("footerNote").textContent =
    labels[state.lang].disclaimer;
  document.getElementById("openTab").textContent = t("ברידג׳ט", "Bridget");
  document.getElementById("floatTab").textContent = t("ברידג׳ט", "Bridget");
  document.getElementById("floatTab").setAttribute("aria-label", t("עזרה עם ברידג׳ט", "Help with Bridget"));
  document.querySelectorAll("[data-view]").forEach((n) => {
    if (n.closest("nav"))
      n.classList.toggle("selected", n.dataset.view === state.view);
    if (n.closest("nav")) {
      n.setAttribute(
        "aria-current",
        n.dataset.view === state.view ? "page" : "false",
      );
    }
  });
  const navs = document.querySelectorAll(".nav button,.bottom-nav button");
  for (const n of navs) {
    const span = n.querySelector("small");
    if (span) span.textContent = labels[state.lang][n.dataset.view] || "";
    else n.textContent = labels[state.lang][n.dataset.view] || "";
  }
  const main = document.getElementById("main");
  main.innerHTML = bridgetGuide() +
    (state.view === "home"
      ? renderHome()
      : state.view === "scenarios"
        ? renderScenarios()
        : state.view === "detail"
          ? renderDetail()
          : state.view === "learn"
            ? renderLearn()
            : state.view === "tools"
              ? renderTools()
              : renderMine()) + thoughtAnchor();
  if (state.view === "home") {
    const scene = main.querySelector(".bridget-scene");
    if (scene)
      scene.insertAdjacentHTML(
        "beforeend",
        `<button class="bridget-invite" data-action="bridgetTour"><span class="bridget-arrow" aria-hidden="true">←</span><strong>${t("תראי לי", "Bridget, show me")}</strong><small>${t("מסע קצר של פחות מדקה", "A tour under one minute")}</small></button>`,
      );
  }
}
function navigate(view) {
  state.view = view;
  state.followQuestion = null;
  state.stepMode = "normal";
  if (IS_BROWSER && location.hash !== `#${view}`)
    history.pushState(null, "", `#${view}`);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function openScenario(id) {
  if (!scenarios.some((s) => s.id === id)) return;
  state.scenario = id;
  navigate("detail");
}
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext)
    return navigator.clipboard
      .writeText(text)
      .then(() =>
        toast(
          t(
            "הועתק. אתם בוחרים למי לשתף.",
            "Copied. You choose who to share with.",
          ),
        ),
      )
      .catch(() => fallbackCopy(text));
  fallbackCopy(text);
}
function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  toast(
    ok
      ? t("הועתק", "Copied")
      : t("לא התאפשר להעתיק במכשיר הזה", "Copy not available on this device"),
  );
}
function addSaved(status = "todo") {
  const s = scenarios.find((x) => x.id === state.scenario);
  if (!s) return;
  saved.unshift({
    id: String(Date.now()) + "-" + Math.floor(Math.random() * 10000),
    scenario: s.id,
    mode: state.stepMode,
    status,
    date: new Date().toISOString(),
  });
  if (persist())
    toast(
      status === "done"
        ? t("הפעולה סומנה כנוסתה ✓", "Marked as tried ✓")
        : t("נשמר כאן בדפדפן בלבד ✓", "Saved only in this browser ✓"),
    );
}
function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
  document.body.style.overflow = "";
  const trigger = document.getElementById("floatTab");
  if (trigger) trigger.focus();
}
function modal(content) {
  const root = document.getElementById("modalRoot");
  root.innerHTML = `<div class="overlay" role="presentation" id="overlay"><section class="drawer" role="dialog" aria-modal="true" aria-label="${esc(content.heading || t("ברידג׳ט", "Bridget"))}" id="drawer"><div class="drawer-head"><h2>✳ ${content.heading || "Bridget"}</h2><button class="close" id="closeModal" aria-label="${t("סגירה", "Close")}">×</button></div><div class="modal-bridget" aria-hidden="true"><img src="bridget-next-step.webp" width="48" height="60" alt=""></div>${content.body}</section></div>`;
  document.body.style.overflow = "hidden";
  document.getElementById("closeModal").focus();
}
function openTab() {
  modal({
    heading: t("ברידג׳ט", "Bridget"),
    body: `<div class="tab-bot"><div class="preamble">${t("עזרה כאן ועכשיו · ללא AI חיצוני", "Guided help · no external AI")}</div><h3>${t("איזה צעד קטן יעזור כרגע?", "What small step would help right now?")}</h3><p>${t("אני יכולה להציע מסלולי פעולה מתוך תרחישים מוכנים. כרגע זו עזרה מובנית ולא צ׳אט AI חופשי.", "I offer guided actions from prepared scenarios. This is a decision helper, not a live generative AI chat.")}</p></div><div class="prompt-list">${scenarios
      .slice(0, 6)
      .map(
        (s) =>
          `<button data-scenario="${s.id}">${s.emoji} ${title(s)} ←</button>`,
      )
      .join(
        "",
      )}</div><p class="mini-copy">${t("אין צורך להזין פרטים אישיים. את ההחלטות מקבלים אתם.", "No personal information required. You make the decisions.")}</p>`,
  });
}
function openWelcome() {
  modal({
    heading: t("נעים להכיר", "Glad you’re here"),
    body: `<div class="welcome"><p class="page-subtitle">${t("באיזה תפקיד הגעתם היום?", "What brings you here today?")}</p><p>${t("בלי שם ובלי הרשמה. הבחירה נשארת רק במהלך הביקור.", "No name or account. This choice lasts only for this visit.")}</p><div class="prompt-list">${[["parent","אני הורה","I’m a parent"],["family","אני מהמשפחה או מטפל/ת בילד","I’m family or a caregiver"],["education","אני מצוות החינוך","I’m an educator"]].map(([id,he,en])=>`<button data-action="welcomeRole" data-role="${id}">${t(he,en)} ←</button>`).join("")}</div><button class="text-link" data-action="welcomeRole" data-role="guest">${t("אפשר גם פשוט להתחיל", "Just let me start")} ←</button></div>`,
  });
}
function welcomeSituation() {
  modal({heading:t("מה מעסיק אתכם עכשיו?", "What is happening right now?"),body:`<p class="page-subtitle">${t("בחרו רגע אחד. נצא עם משפט ופעולה שאפשר לנסות.", "Pick one moment. Leave with one sentence and one action.")}</p><div class="prompt-list">${scenarios.slice(0,4).map(s=>`<button data-scenario="${s.id}">${s.emoji} ${title(s)} ←</button>`).join("")}</div><button class="text-link" data-action="welcomeAll">${t("משהו אחר? לכל הסיטואציות", "Something else? See all situations")} ←</button><button class="tour-skip" data-action="welcome">${t("חזרה", "Back")}</button>`});
}
function openBridgetTour(step = 0) {
  state.tourStep = Math.max(0, Math.min(3, step));
  const items = [
    [
      t("מתחילים ברגע שקורה עכשיו", "Start with what is happening now"),
      t(
        "לא צריך להסביר הכול. בוחרים סיטואציה אחת.",
        "No need to explain everything. Pick one situation.",
      ),
      "👀",
    ],
    [
      t("מקבלים צעד קטן", "Get one small step"),
      t(
        "משפט אחד ופעולה אחת שאפשר לנסות.",
        "One sentence and one action to try.",
      ),
      "☝",
    ],
    [
      t("מתרגלים לפני הרגע האמיתי", "Practice before the real moment"),
      t(
        "בזירה אפשר לנסות תגובה, לשנות מילים ולנסות שוב.",
        "In the arena you can try a response, edit the words and retry.",
      ),
      "🎭",
    ],
    [
      t("אתם מחליטים מה לקחת", "You choose what to take"),
      t(
        "אפשר לשמור, לשתף או רק לקרוא. שום דבר לא נשלח אוטומטית.",
        "Save, share or simply read. Nothing is sent automatically.",
      ),
      "✨",
    ],
  ];
  const [heading, copy, pose] = items[state.tourStep];
  modal({
    heading: t("ברידג׳ט מראה את הדרך", "Bridget shows the way"),
    body: `<div class="bridget-tour pose-${state.tourStep}"><div class="tour-progress" aria-label="${t("התקדמות במסע", "Tour progress")}">${items.map((_, i) => `<span class="${i === state.tourStep ? "on" : ""}"></span>`).join("")}</div><div class="tour-scene"><img src="bridget-next-step.webp" alt="" width="180" height="225"><span class="tour-pose" aria-hidden="true">${pose}</span></div><h3>${heading}</h3><p>${copy}</p><div class="action-row">${state.tourStep ? `<button class="btn secondary" data-action="tourBack">${t("חזרה", "Back")}</button>` : ""}${state.tourStep < 3 ? `<button class="btn primary" data-action="tourNext">${t("הבא", "Next")} ←</button>` : `<button class="btn primary" data-action="tourGo">${t("בואו נתחיל", "Let’s begin")} ←</button>`}</div><button class="tour-skip" data-action="tourClose">${t("מספיק לי, תודה", "That’s enough, thanks")}</button></div>`,
  });
}
function openPractice() {
  state.simStage = 0;
  state.simPick = null;
  renderPractice();
}
function renderPractice() {
  const stage = state.simStage;
  const he = state.lang === "he";
  let body = `<p class="page-subtitle">${t("תרגול קצר: הילד לא מתחיל שיעורים. בוחרים תגובה ורואים לאן ממשיכים. בלי ציונים.", "Mini practice: homework is not getting started. Choose a response, then reflect. No scores.")}</p>`;
  if (stage === 0)
    body += `<div class="sim-dialogue"><span class="sticker">🧑‍🎓</span><p><strong>${t("הילד/ה:", "Child:")}</strong> ${t('"לא עושה את זה! זה יותר מדי."', "“I’m not doing it! It’s too much.”")}</p></div><div class="prompt-list"><button data-action="simPick" data-pick="1">${t('"תפסיק/י להתווכח ותתחיל/י עכשיו."', "“Stop arguing and start right now.”")}</button><button data-action="simPick" data-pick="2">${t('"נתחיל רק מלפתוח את המחברת יחד?"', "“Could we just open the notebook together?”")}</button></div>`;
  else if (stage === 1)
    body += `<div class="sim-dialogue"><span class="sticker">🧑‍🎓</span><p>${state.simPick === 1 ? t('"את/ה לא מבינ/ה כמה קשה לי!"', "“You don’t understand how hard this is!”") : t('"טוב, אבל רק לפתוח."', "“Okay, but just opening it.”")}</p></div><div class="hint">${state.simPick === 1 ? t("כשהטון מתגבר, אפשר לנסות להוריד דרישה ולתקן את הקשר. זו דוגמה אפשרית, לא ניבוי של תגובת ילד.", "When tension rises, try lowering the demand and repairing. This is one possible response, not a prediction.") : t("בקשה קטנה נותנת דרך להתחיל. זה לא מבטיח שיתוף פעולה, אבל מאפשר לנסות.", "A tiny request offers a starting point. It does not guarantee cooperation.")}</div><div class="prompt-list"><button data-action="simNext">${t("מה אומרים עכשיו? ←", "What next? →")}</button><button data-action="simRestart">${t("לבחור תגובה אחרת", "Try the other response")}</button></div>`;
  else
    body += `<div class="sim-dialogue"><span class="sticker">🧑‍🎓</span><p>${t('אפשר לומר: "אני רואה שזה גדול עכשיו. בוא/י נבחר רק את הדף הראשון."', "You might say: “This feels big right now. Let’s just pick the first page.”")}</p></div><div class="safe">${t("שאלת סיום: מה היה הצעד הכי קטן שהייתם מוכנים לנסות בבית?", "Reflection: What is the smallest step you would try at home?")}</div><div class="action-row"><button class="btn primary" data-scenario="homework">${t("לקחת את הצעד למציאות", "Bring this into real life")}</button><button class="btn secondary" data-action="simRestart">${t("לתרגל שוב", "Practice again")}</button><a class="btn ghost" href="guide.html#practice-arena">${t("לזירת התרגול המלאה", "Open the full Practice Studio")}</a></div>`;
  modal({ heading: t("זירת התרגול", "Practice arena"), body });
}
function caregiverText(s) {
  return t(
    `סיכום כללי לשיתוף — How to ADHD\nסיטואציה: ${s.title[0]}\nמה אפשר לנסות: ${s.step[0]}\nמשפט שימושי: ${s.script[0]}\nזהו חומר הדרכה כללי, לא מידע אישי על ילד. אפשר לערוך לפני שיתוף.`,
    `General caregiver note — How to ADHD\nSituation: ${s.title[1]}\nOne thing to try: ${s.step[1]}\nUseful sentence: ${s.script[1]}\nGeneral educational content, no child-specific information. Edit before sharing.`,
  );
}
function privacy() {
  modal({
    heading: t("פרטיות ובטיחות", "Privacy & safety"),
    body: `<div class="privacy-copy"><h3>${t("אתם בשליטה", "You stay in control")}</h3><p>${t("אין באתר הרשמה או חשבון. צעדים שמורים נשארים בדפדפן המקומי (localStorage). לא נשלח תוכן לשרת, למודל AI, למייל או לאנליטיקה. השיתוף נעשה רק אם אתם מעתיקים את הסיכום בעצמכם.", "No account is needed. Saved steps remain in your browser (localStorage). We do not send content to a server, AI model, email or analytics. Sharing occurs only when you choose to copy a generic summary.")}</p><p>${t("מומלץ לא להקליד שמות ילדים, מידע מזהה או מידע רפואי. מי שיש לו גישה לדפדפן הזה עשוי לראות את הצעדים השמורים. מחיקת נתוני אתר בדפדפן תמחק אותם.", "Avoid entering child names, identifiable information or health details. Anyone with access to this browser may view saved steps. Clearing site data removes them.")}</p><h3>${t("מתי לא להסתפק באתר", "When to seek help elsewhere")}</h3><p>${t("החומר חינוכי ומעשי בלבד; הוא לא מחליף אבחון, טיפול או ייעוץ מקצועי. אין להסיק ממנו אבחנה. במצב של סכנה מיידית פנו לשירותי חירום מקומיים. בחשש לפגיעה או מצוקה מתמשכת פנו לאיש מקצוע מתאים.", "Educational and practical content only; not diagnosis, therapy or professional care. Do not infer a diagnosis. For immediate danger call local emergency services. For abuse concerns or persistent severe distress, seek qualified help.")}</p><p>${t("זוהי גרסת פיילוט. התגובות של Bridget מבוססות על מסלולים מוגדרים מראש, לא על מודל AI חי.", "This is a pilot. Bridget responses use predefined guided paths, not a live AI model.")}</p></div>`,
  });
}
function actions(event) {
  const target = event.target.closest(
    "button,[data-scenario],.clickable[data-action]",
  );
  if (!target) return;
  if (target.dataset.scenario) {
    closeModalIfOpen();
    openScenario(target.dataset.scenario);
    return;
  }
  if (target.dataset.view) {
    navigate(target.dataset.view);
    return;
  }
  if (target.dataset.age) {
    state.age = target.dataset.age;
    render();
    return;
  }
  if (target.dataset.choice) {
    state.followQuestion = Number(target.dataset.choice);
    render();
    return;
  }
  const action = target.dataset.action;
  if (!action) return;
  if (action === "welcome") { openWelcome(); return; }
  if (action === "welcomeRole") { state.role = target.dataset.role; welcomeSituation(); return; }
  if (action === "welcomeAll") { closeModal(); navigate("scenarios"); return; }
  const s = scenarios.find((x) => x.id === state.scenario);
  if (action === "bridgetTour") {
    openBridgetTour(0);
    return;
  }
  if (action === "tourNext") {
    openBridgetTour(state.tourStep + 1);
    return;
  }
  if (action === "tourBack") {
    openBridgetTour(state.tourStep - 1);
    return;
  }
  if (action === "tourClose") {
    closeModal();
    return;
  }
  if (action === "tourGo") {
    openWelcome();
    return;
  }
  if (action === "sim") {
    openPractice();
    return;
  }
  if (action === "stepMode") {
    state.stepMode = target.dataset.mode;
    render();
    return;
  }
  if (action === "saveStep") {
    addSaved();
    return;
  }
  if (action === "done") {
    addSaved("done");
    navigate("mine");
    return;
  }
  if (action === "copyScript" && s) {
    copyText(s.script[state.lang === "he" ? 0 : 1]);
    return;
  }
  if (action === "shareCare" && s) {
    modal({
      heading: t("סיכום לשיתוף", "Caregiver summary"),
      body: `<p class="mini-copy">${t("אין כאן מידע אישי. בדקו וערכו לפני שיתוף.", "No personal data. Review and edit before sharing.")}</p><textarea id="careText" class="field" style="min-height:210px">${esc(caregiverText(s))}</textarea><button class="btn primary" data-action="copyCare">${t("העתיקו סיכום", "Copy summary")}</button>`,
    });
    return;
  }
  if (action === "copyCare") {
    copyText(document.getElementById("careText").value);
    return;
  }
  if (action === "simPick") {
    state.simPick = Number(target.dataset.pick);
    state.simStage = 1;
    renderPractice();
    return;
  }
  if (action === "simNext") {
    state.simStage = 2;
    renderPractice();
    return;
  }
  if (action === "simRestart") {
    openPractice();
    return;
  }
  if (action === "tool90") {
    modal({
      heading: t("90 שניות להתחלה", "Start in 90 seconds"),
      body: `<div class="tab-bot"><h3>${t("אל תנסו לסיים. רק להתחיל.", "Don’t aim to finish. Just begin.")}</h3><p>${t("1. בוחרים פעולה אחת קטנה. 2. מתחילים יחד. 3. עוצרים אחרי זמן קצר ובודקים איך היה.", "1. Choose a tiny action. 2. Start together. 3. Stop after a short interval and notice what happened.")}</p></div><button class="btn primary" data-scenario="homework">${t("לדוגמה מעשית", "See a practical example")}</button>`,
    });
    return;
  }
  if (action === "toggleSaved") {
    const i = saved.find((x) => x.id === target.dataset.id);
    if (i) {
      i.status = i.status === "done" ? "todo" : "done";
      persist();
      render();
    }
    return;
  }
  if (action === "removeSaved") {
    saved = saved.filter((x) => x.id !== target.dataset.id);
    persist();
    render();
    return;
  }
  if (action === "revisit") {
    openScenario(target.dataset.id);
    return;
  }
  if (action === "clear") {
    if (
      window.confirm(
        t(
          "למחוק את כל הצעדים השמורים בדפדפן הזה?",
          "Delete all saved steps from this browser?",
        ),
      )
    ) {
      saved = [];
      persist();
      render();
    }
    return;
  }
  if (action === "export") {
    const safe = saved.map((i) => ({
      situation:
        scenarios.find((s) => s.id === i.scenario)?.title[
          state.lang === "he" ? 0 : 1
        ] || "",
      status: i.status,
      date: i.date,
    }));
    const blob = new Blob([JSON.stringify(safe, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "how-to-adhd-steps.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (action === "pilotFeedback") { openPilotFeedback(); return; }
  if (action === "copyFeedback") {
    const form = document.getElementById("pilotForm");
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const text = pilotFeedbackText(values);
    if (!text) return;
    copyText(text);
    document.getElementById("feedbackStatus").textContent = t("בחרתם להעתיק. המשוב לא נשלח לצוות; הדביקו אותו בשיחה עם מי שהזמין אתכם לפיילוט. אין צורך לשלוח שוב את אותו משוב.", "You chose to copy. Feedback has not been sent to the team; paste it into your conversation with your pilot organizer. No need to resend the same response.");
    return;
  }
}
function closeModalIfOpen() {
  if (document.getElementById("overlay")) closeModal();
}
function bind() {
  saved = readSaved();
  const firstHash = location.hash.replace("#", "");
  if (["home", "scenarios", "learn", "tools", "mine"].includes(firstHash))
    state.view = firstHash;
  render();
  document.getElementById("lang").addEventListener("click", () => {
    state.lang = state.lang === "he" ? "en" : "he";
    render();
    if (document.getElementById("overlay")) closeModal();
  });
  document.getElementById("openTab").addEventListener("click", openTab);
  document.getElementById("floatTab").addEventListener("click", openTab);
  document.getElementById("privacyBtn").addEventListener("click", privacy);
  document.addEventListener("click", (e) => {
    if (e.target.id === "closeModal" || e.target.id === "overlay") {
      closeModal();
      return;
    }
    actions(e);
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "searchScenario") {
      const el = e.target;
      const position = el.selectionStart;
      state.search = el.value;
      render();
      const next = document.getElementById("searchScenario");
      if (next) {
        next.focus();
        next.setSelectionRange(position, position);
      }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("overlay")) {
      closeModal();
      return;
    }
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.matches(
        '[role="button"][data-scenario], [role="button"][data-action]',
      )
    ) {
      e.preventDefault();
      e.target.click();
    }
    if (e.key === "Tab" && document.getElementById("drawer")) {
      const els = [
        ...document
          .getElementById("drawer")
          .querySelectorAll("button,[href],textarea,input"),
      ].filter((x) => !x.disabled);
      if (!els.length) return;
      const first = els[0],
        last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (["home", "scenarios", "learn", "tools", "mine"].includes(id))
      navigate(id);
  });
}
if (IS_BROWSER) {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();
}
if (typeof module !== "undefined")
  module.exports = { scenarios, esc, labels, initial, guideMap, pilotFeedbackText, pilotQuestions, bridgetGuide, state, openPilotFeedback, actions };
