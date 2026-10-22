(() => {
  const $ = (id) => document.getElementById(id),
    modal = $("arena-modal"),
    stage = $("arena-stage"),
    title = $("arena-title"),
    progress = $("arena-progress-bar");
  if (!modal || !stage) return;
  const copy = {
    he: {
      start: "מתחילים ברוגע",
      consentTitle: "לפני שמתחילים",
      consentSub: "זהו תרגול בדיוני להורה — לא אבחון ולא חיזוי של הילד.",
      consent:
        "אני מבינ/ה שלא מזינים כאן פרטים מזהים ושכל תגובות הילד הן אפשרויות לתרגול בלבד.",
      begin: "מסכימ/ה ומתחיל/ה",
      avatars: "מי נכנס לזירה?",
      avatarsSub: "בחרו דמות להורה ודמות לילד/ה. אפשר להחליף בכל רגע.",
      parent: "הדמות שלי",
      child: "דמות הילד/ה",
      next: "ממשיכים",
      scenario: "מה הכי קשה עכשיו?",
      scenarioSub: "בחרו רגע אחד לתרגול. אפשר לחזור לאחרים בהמשך.",
      profile: "מה יכול לעזור לילד/ה?",
      profileSub:
        "בחרו חוזקה אחת ודרך תמיכה אחת. המטרה היא לעבוד עם הכוחות, לא נגד הילד.",
      strength: "מה מניע?",
      support: "איך קל יותר לקבל עזרה?",
      play: "נכנסים לסצנה",
      pause: "עצירה",
      switch: "החלפת תפקידים",
      retry: "ניסיון אחר",
      card: "יצירת כרטיס פעולה",
      shareTitle: "תוכנית קטנה לרגע האמיתי",
      shareSub: "בחרו עם מי לשתף. רק הכרטיס הזה ישותף — לא הניסיונות שלכם.",
      copy: "העתקת הכרטיס",
      restart: "תרחיש נוסף",
      privacy: "הבחירות נשארות במכשיר הזה ולא נשלחות.",
      roles: ["הורה נוסף", "מורה", "סבא/סבתא", "בייביסיטר", "מטפל/ת"],
      copied: "הכרטיס הועתק. אפשר להדביק בהודעה.",
      share: "שיתוף הכרטיס",
    },
    en: {
      start: "Start calmly",
      consentTitle: "Before we begin",
      consentSub:
        "This is fictional practice for a parent — not a diagnosis or prediction.",
      consent:
        "I understand that I should not enter identifying details and that the child responses are practice possibilities only.",
      begin: "I agree — begin",
      avatars: "Who enters the arena?",
      avatarsSub:
        "Choose a parent and child avatar. You can change them anytime.",
      parent: "My character",
      child: "Child's character",
      next: "Continue",
      scenario: "What is hardest right now?",
      scenarioSub:
        "Choose one moment to practice. You can return to the others later.",
      profile: "What might help?",
      profileSub:
        "Choose one strength and one support style. Work with strengths, not against the child.",
      strength: "What motivates?",
      support: "How is help easier?",
      play: "Enter the scene",
      pause: "Pause",
      switch: "Switch roles",
      retry: "Try another response",
      card: "Create action card",
      shareTitle: "A small plan for the real moment",
      shareSub:
        "Choose who to share with. Only this card is shared — not your attempts.",
      copy: "Copy card",
      restart: "Another scenario",
      privacy: "Choices stay on this device and are not sent.",
      roles: [
        "Second parent",
        "Teacher",
        "Grandparent",
        "Babysitter",
        "Therapist",
      ],
      copied: "Card copied. You can paste it in a message.",
      share: "Share card",
    },
  };
  const scenarios = {
    screen: {
      icon: "🎮",
      he: {
        name: "קשה לעצור מסך",
        desc: "הזמן הסתיים והילד מסרב",
        line: "אם היית אוהב/ת אותי, היית נותנ/ת לי עוד! כולם ממשיכים לשחק.",
        feel: "אכזבה, מעבר חד וקושי לעצור פעילות מתגמלת",
        helps: "הכרה ברגש + גבול קצר + גשר למעבר",
        avoid: "ויכוח על אהבה או איום משפיל",
        phrase: "אני אוהב/ת אותך. הזמן הסתיים. אעזור לך לעבור לדבר הבא.",
      },
      en: {
        name: "Stopping screen time",
        desc: "Time is up and the child refuses",
        line: "If you loved me, you would let me keep playing! Everyone else can.",
        feel: "Disappointment, an abrupt transition and difficulty stopping a rewarding activity",
        helps: "Name the feeling + short boundary + transition bridge",
        avoid: "Arguing about love or using a shaming threat",
        phrase:
          "I love you. Screen time is over. I will help you move to the next thing.",
      },
    },
    homework: {
      icon: "✏️",
      he: {
        name: "שיעורי בית לא מתחילים",
        desc: "יש ידע, אבל אין התנעה",
        line: "אני לא עושה את זה. זה מטומטם ואני גרוע/ה בזה.",
        feel: "משימה גדולה, חשש מכישלון ועומס על התנעה",
        helps: "צעד של שתי דקות + בחירה מוגבלת + נוכחות רגועה",
        avoid: "לקרוא לזה עצלנות או לדרוש לסיים הכול עכשיו",
        phrase: "לא חייבים לפתור הכול. נבחר יחד את הצעד הראשון של שתי דקות.",
      },
      en: {
        name: "Homework will not start",
        desc: "The knowledge is there, initiation is not",
        line: "I'm not doing it. This is stupid and I'm bad at it.",
        feel: "A task that feels too large, fear of failure and initiation overload",
        helps: "A two-minute step + limited choice + calm presence",
        avoid: "Calling it laziness or demanding the whole task now",
        phrase:
          "We don't have to solve it all. Let's choose the first two-minute step together.",
      },
    },
    family: {
      icon: "🌋",
      he: {
        name: "התפרצות מול המשפחה",
        desc: "כולם מסתכלים והבושה עולה",
        line: "עזבו אותי! אני שונא/ת את כולכם!",
        feel: "הצפה, אובדן פרטיות ובושה כשהקהל צופה",
        helps: "יציאה מכבדת למקום שקט ושיחה רק אחרי רגיעה",
        avoid: "משמעת מול חברים או בני משפחה",
        phrase: "בוא/י איתי למקום שקט. נדבר כשנרגיש בטוחים ורגועים.",
      },
      en: {
        name: "Explosion around family",
        desc: "Everyone is watching and shame rises",
        line: "Leave me alone! I hate all of you!",
        feel: "Flooding, loss of privacy and shame under an audience",
        helps: "A dignified exit to a quiet place; talk only after calm",
        avoid: "Discipline in front of friends or family",
        phrase:
          "Come with me somewhere quiet. We'll talk when we both feel safe and calm.",
      },
    },
  };
  const strengths = {
    he: [
      ["⚽", "תנועה וספורט"],
      ["🎮", "משחקים"],
      ["🎨", "יצירה"],
      ["🎵", "מוזיקה"],
      ["🧪", "סקרנות"],
      ["🐾", "בעלי חיים"],
    ],
    en: [
      ["⚽", "Movement & sport"],
      ["🎮", "Games"],
      ["🎨", "Art"],
      ["🎵", "Music"],
      ["🧪", "Curiosity"],
      ["🐾", "Animals"],
    ],
  };
  const supports = {
    he: [
      ["👀", "להראות לי", "תמונה או דוגמה"],
      ["🗣️", "להסביר לי", "שיחה קצרה"],
      ["🤝", "לעשות יחד", "צעד אחר צעד"],
    ],
    en: [
      ["👀", "Show me", "Picture or example"],
      ["🗣️", "Tell me", "A short conversation"],
      ["🤝", "Do it together", "Step by step"],
    ],
  };
  const responseText = {
    screen: {
      he: [
        [
          "אני לא מוכן/ה לשמוע את זה. תביא/י מיד את המכשיר.",
          "risk",
          "התגובה מגבירה מאבק ובושה. הגבול ברור, אבל אין עדיין גשר למעבר.",
        ],
        [
          "אני שומע/ת כמה קשה לעצור. הזמן נגמר. רוצה לכבות לבד או שאעזור?",
          "helpful",
          "יש כאן תיקוף בלי ויתור על הגבול, וגם בחירה מוגבלת שעוזרת לעבור לפעולה.",
        ],
        [
          "טוב, רק עוד עשר דקות כדי שלא יהיה ריב.",
          "pause",
          "זה מרגיע עכשיו, אך עלול להפוך את ההתפרצות לדרך לדחות את הגבול. אפשר לעצור ולנסח מחדש.",
        ],
      ],
      en: [
        [
          "I won't listen to this. Give me the device now.",
          "risk",
          "This may increase struggle and shame. The boundary is clear, but there is no bridge to transition.",
        ],
        [
          "I hear how hard it is to stop. Time is up. Do you want to turn it off, or should I help?",
          "helpful",
          "This validates the feeling without dropping the boundary, and offers a limited choice that supports action.",
        ],
        [
          "Okay, ten more minutes so we do not fight.",
          "pause",
          "This may calm the moment but can teach that escalation delays the boundary. Pause and rephrase.",
        ],
      ],
    },
    homework: {
      he: [
        [
          "את/ה פשוט עצלן/ית. עד שלא תסיים/י אין שום דבר אחר.",
          "risk",
          "התווית פוגעת בזהות ועלולה להגדיל הימנעות. היא לא מלמדת איך להתחיל.",
        ],
        [
          "אני רואה שקשה להתחיל. נבחר יחד שאלה אחת או שתי דקות קריאה?",
          "helpful",
          "התגובה מפרידה בין הילד לקושי, מקטינה את המשימה ומציעה בחירה מוגבלת.",
        ],
        [
          "עזוב/י, אני אעשה את זה בשבילך.",
          "pause",
          "העומס יורד מיד, אבל הילד לא מתרגל את הצעד הראשון. עדיף לעשות יחד ואז להעביר אחריות.",
        ],
      ],
      en: [
        [
          "You're just lazy. Nothing else until you finish.",
          "risk",
          "The label harms identity and may increase avoidance. It does not teach how to start.",
        ],
        [
          "I can see starting is hard. Shall we choose one question or two minutes of reading?",
          "helpful",
          "This separates the child from the difficulty, shrinks the task and offers a limited choice.",
        ],
        [
          "Leave it, I'll do it for you.",
          "pause",
          "The load drops now, but the child does not practice the first step. Work together, then hand responsibility back.",
        ],
      ],
    },
    family: {
      he: [
        [
          "תירגע/י מיד ותתנצל/י בפני כולם!",
          "risk",
          "דרישה פומבית בזמן הצפה מוסיפה בושה וקהל. למידה ושיחה יוכלו לקרות רק אחרי רגיעה.",
        ],
        [
          "בוא/י איתי רגע למקום שקט. לא פותרים את זה מול כולם.",
          "helpful",
          "התגובה מגינה על הכבוד, מצמצמת גירויים ודוחה את המשמעת לזמן שבו אפשר ללמוד.",
        ],
        [
          "כולם רואים איך את/ה מתנהג/ת. למה תמיד צריך להרוס?",
          "pause",
          "גם אם נאמר מתסכול, המשפט מחבר התנהגות לזהות ומגדיל בושה. עצרו והרחיקו מהקהל.",
        ],
      ],
      en: [
        [
          "Calm down now and apologize to everyone!",
          "risk",
          "A public demand during flooding adds shame and an audience. Learning can happen only after calm.",
        ],
        [
          "Come with me somewhere quiet. We are not solving this in front of everyone.",
          "helpful",
          "This protects dignity, reduces stimulation and postpones discipline until learning is possible.",
        ],
        [
          "Everyone can see how you behave. Why do you always ruin things?",
          "pause",
          "Even when said in frustration, this links behavior to identity and increases shame. Pause and leave the audience.",
        ],
      ],
    },
  };
  let s = {
    step: 0,
    lang: "he",
    voice: false,
    parent: "🧑🏻",
    child: "🧒🏻",
    scenario: "screen",
    strength: "🎮 משחקים",
    support: "🤝 לעשות יחד",
    choice: null,
    role: 0,
    switched: false,
    customPhrase: "",
  };
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  function tr(k) {
    return copy[s.lang][k];
  }
  function selected(btns, key, val) {
    btns.forEach((b) => b.classList.toggle("selected", b.dataset[key] === val));
  }
  function button(text, id, kind) {
    return (
      '<button id="' +
      id +
      '" class="' +
      (kind || "arena-primary") +
      '">' +
      text +
      "</button>"
    );
  }
  let narrationAudio = null;
  function stopNarration() {
    if(narrationAudio) { narrationAudio.pause(); narrationAudio = null; }
    if("speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  function speak() {
    stopNarration();
    if(!s.voice) return;
    const key = `${s.lang}-${s.step}${s.step===4?'-'+s.scenario:''}`;
    const clip = (window.ARENA_VOICE || {})[key];
    if(clip && clip.url) {
      narrationAudio = new Audio(clip.url);
      narrationAudio.play().catch(()=>{ $("arena-privacy").textContent = s.lang==='he' ? 'לא ניתן לנגן כרגע. הטקסט זמין לקריאה.' : 'Audio unavailable. You can read the text.'; });
      return;
    }
    if (!s.voice || !("speechSynthesis" in window)) return;
    const text = clip ? clip.text : stage.querySelector('.arena-subtitle')?.textContent;
    if(!text) return;
    const u = new SpeechSynthesisUtterance(text.replace(/[\/]/g, ' ').replace(/[🎮☀️✏️]/gu,''));
    u.lang = s.lang === "he" ? "he-IL" : "en-US";
    const voice = window.speechSynthesis.getVoices().find(v=>v.lang.startsWith(s.lang));
    if(voice) u.voice = voice;
    u.rate = 0.92;
    $("arena-privacy").textContent = s.lang==='he' ? 'קול המכשיר · קול ElevenLabs טרם חובר' : 'Device voice · ElevenLabs voice is not connected yet';
    window.speechSynthesis.speak(u);
  }
  function setStep(n) {
    s.step = n;
    render();
    stage.focus({ preventScroll: true });
  }
  function render() {
    modal.dir = s.lang === "he" ? "rtl" : "ltr";
    title.textContent = tr(
      s.step === 0
        ? "start"
        : s.step === 1
          ? "avatars"
          : s.step === 2
            ? "scenario"
            : s.step === 3
              ? "profile"
              : s.step === 4
                ? "play"
                : "shareTitle",
    );
    progress.style.width = ((s.step + 1) / 6) * 100 + "%";
    $("arena-privacy").textContent = tr("privacy");
    $("arena-language").textContent = s.lang === "he" ? "EN" : "עב";
    if (s.step === 0) intro();
    else if (s.step === 1) avatars();
    else if (s.step === 2) scenario();
    else if (s.step === 3) profile();
    else if (s.step === 4) play();
    else shareCard();
    speak();
  }
  function intro() {
    const note =
      s.lang === "he"
        ? "TAB אינו שומר שמות, הודעות או בחירות מהתרגול. אין צורך בחשבון."
        : "TAB does not save names, messages or practice choices. No account is required.";
    stage.innerHTML =
      "<h3>" +
      tr("consentTitle") +
      '</h3><p class="arena-subtitle">' +
      tr("consentSub") +
      '</p><div class="arena-consent"><span class="shield">🛡️</span><div><label><input id="arena-agree" type="checkbox">' +
      tr("consent") +
      '</label><p class="small">' +
      note +
      '</p></div></div><div class="arena-actions"><button id="arena-begin" class="arena-primary" disabled>' +
      tr("begin") +
      "</button></div>";
    $("arena-agree").onchange = (e) =>
      ($("arena-begin").disabled = !e.target.checked);
    $("arena-begin").onclick = () => setStep(1);
  }
  function avatars() {
    const p = ["🧑🏻", "👩🏽", "👨🏾", "🧕🏻"],
      c = ["🧒🏻", "👧🏽", "👦🏾", "🧑🏼"];
    stage.innerHTML =
      "<h3>" +
      tr("avatars") +
      '</h3><p class="arena-subtitle">' +
      tr("avatarsSub") +
      '</p><div class="arena-avatar-picker"><div class="arena-avatar-group"><h4>' +
      tr("parent") +
      '</h4><div class="arena-avatar-options">' +
      p
        .map(
          (x) =>
            '<button class="arena-avatar-choice ' +
            (x === s.parent ? "selected" : "") +
            '" data-parent="' +
            x +
            '">' +
            x +
            "</button>",
        )
        .join("") +
      '</div></div><div class="arena-avatar-group"><h4>' +
      tr("child") +
      '</h4><div class="arena-avatar-options">' +
      c
        .map(
          (x) =>
            '<button class="arena-avatar-choice ' +
            (x === s.child ? "selected" : "") +
            '" data-child="' +
            x +
            '">' +
            x +
            "</button>",
        )
        .join("") +
      '</div></div></div><div class="arena-actions">' +
      button(tr("next"), "arena-next") +
      "</div>";
    stage.querySelectorAll("[data-parent]").forEach(
      (b) =>
        (b.onclick = () => {
          s.parent = b.dataset.parent;
          selected(stage.querySelectorAll("[data-parent]"), "parent", s.parent);
        }),
    );
    stage.querySelectorAll("[data-child]").forEach(
      (b) =>
        (b.onclick = () => {
          s.child = b.dataset.child;
          selected(stage.querySelectorAll("[data-child]"), "child", s.child);
        }),
    );
    $("arena-next").onclick = () => setStep(2);
  }
  function scenario() {
    stage.innerHTML =
      "<h3>" +
      tr("scenario") +
      '</h3><p class="arena-subtitle">' +
      tr("scenarioSub") +
      '</p><div class="arena-grid">' +
      Object.keys(scenarios)
        .map((k) => {
          const d = scenarios[k][s.lang];
          return (
            '<button class="arena-card ' +
            (s.scenario === k ? "selected" : "") +
            '" data-scenario="' +
            k +
            '"><span class="emoji">' +
            scenarios[k].icon +
            "</span><strong>" +
            d.name +
            "</strong><small>" +
            d.desc +
            "</small></button>"
          );
        })
        .join("") +
      '</div><div class="arena-actions">' +
      button(tr("next"), "arena-next") +
      "</div>";
    stage.querySelectorAll("[data-scenario]").forEach(
      (b) =>
        (b.onclick = () => {
          s.scenario = b.dataset.scenario;
          s.switched = false;
          s.customPhrase = "";
          selected(
            stage.querySelectorAll("[data-scenario]"),
            "scenario",
            s.scenario,
          );
        }),
    );
    $("arena-next").onclick = () => setStep(3);
  }
  function profile() {
    const st = strengths[s.lang],
      su = supports[s.lang];
    stage.innerHTML =
      "<h3>" +
      tr("profile") +
      '</h3><p class="arena-subtitle">' +
      tr("profileSub") +
      "</p><h4>" +
      tr("strength") +
      '</h4><div class="arena-grid">' +
      st
        .map(
          (x) =>
            '<button class="arena-card" data-strength="' +
            esc(x.join(" ")) +
            '"><strong>' +
            x[0] +
            " " +
            x[1] +
            "</strong></button>",
        )
        .join("") +
      "</div><h4>" +
      tr("support") +
      '</h4><div class="arena-grid">' +
      su
        .map(
          (x) =>
            '<button class="arena-card" data-support="' +
            esc(x[0] + " " + x[1]) +
            '"><strong>' +
            x[0] +
            " " +
            x[1] +
            "</strong><small>" +
            x[2] +
            "</small></button>",
        )
        .join("") +
      '</div><div class="arena-actions">' +
      button(tr("play"), "arena-next") +
      "</div>";
    stage.querySelectorAll("[data-strength]").forEach(
      (b) =>
        (b.onclick = () => {
          s.strength = b.dataset.strength;
          selected(
            stage.querySelectorAll("[data-strength]"),
            "strength",
            s.strength,
          );
        }),
    );
    stage.querySelectorAll("[data-support]").forEach(
      (b) =>
        (b.onclick = () => {
          s.support = b.dataset.support;
          selected(
            stage.querySelectorAll("[data-support]"),
            "support",
            s.support,
          );
        }),
    );
    $("arena-next").onclick = () => setStep(4);
  }
  function play() {
    const d = scenarios[s.scenario][s.lang],
      r = responseText[s.scenario][s.lang],
      roleNote = s.switched
        ? s.lang === "he"
          ? "החלפת תפקידים: קראו את המשפט בקול מנקודת המבט של הילד/ה. מה הייתם צריכים לשמוע עכשיו?"
          : "Role switch: read the line aloud from the child’s point of view. What would you need to hear now?"
        : d.desc;
    stage.innerHTML =
      "<h3>" +
      d.name +
      '</h3><p class="arena-subtitle">' +
      roleNote +
      '</p><div class="arena-scene"><div class="arena-character"><div class="face">' +
      (s.switched ? s.parent : s.child) +
      "</div><strong>" +
      (s.switched
        ? s.lang === "he"
          ? "את/ה בתפקיד הילד/ה"
          : "You are the child"
        : tr("child")) +
      '</strong></div><div><div class="arena-speech">“' +
      d.line +
      '”</div><div class="arena-choices">' +
      r
        .map(
          (x, i) =>
            '<button class="arena-choice" data-choice="' +
            i +
            '">' +
            x[0] +
            "</button>",
        )
        .join("") +
      '</div><div id="arena-feedback"></div></div></div>';
    stage
      .querySelectorAll("[data-choice]")
      .forEach((b) => (b.onclick = () => feedback(Number(b.dataset.choice))));
  }
  function feedback(i) {
    s.choice = i;
    const r = responseText[s.scenario][s.lang][i],
      d = scenarios[s.scenario][s.lang],
      box = $("arena-feedback");
    box.className = "arena-feedback " + r[1];
    box.innerHTML =
      "<strong>" +
      (r[1] === "helpful"
        ? s.lang === "he"
          ? "מה עשוי לעזור כאן"
          : "What may help here"
        : s.lang === "he"
          ? "מה התגובה עלולה ליצור"
          : "What this response may create") +
      "</strong><p>" +
      r[2] +
      '</p><div class="arena-pause-card"><h4>⏸ ' +
      tr("pause") +
      "</h4><p><b>" +
      (s.lang === "he"
        ? "מה הילד אולי חווה: "
        : "What the child may be experiencing: ") +
      "</b>" +
      d.feel +
      "</p><p><b>" +
      (s.lang === "he" ? "משפט שאפשר לנסות: " : "A phrase to try: ") +
      "</b>" +
      d.phrase +
      '</p></div><div class="arena-actions">' +
      button(tr("switch"), "arena-switch", "arena-secondary") +
      button(tr("retry"), "arena-retry", "arena-secondary") +
      button(tr("card"), "arena-card-make") +
      "</div>";
    $("arena-retry").onclick = () => {
      s.switched = false;
      play();
    };
    $("arena-switch").onclick = () => {
      s.switched = true;
      play();
    };
    $("arena-card-make").onclick = () => setStep(5);
  }
  function softLanding() {
    if (s.scenario !== "screen") return "";
    const he = s.lang === "he";
    const examples = he
      ? [
          "בוא/י נדבר על זה תוך כדי צחצוח שיניים וארגון התיק למחר.",
          "רציתי לבחור איתך סרט — בוא/י תעזור/י לי.",
          "בוא/י לסיבוב קצר למטה.",
          "בא לך לעשות מסיבת ריקודים?",
        ]
      : [
          "Let’s talk while we brush teeth and pack for tomorrow.",
          "I wanted to choose a movie with you — will you help me?",
          "Come for a quick walk downstairs.",
          "Want to have a tiny dance party?",
        ];
    return (
      '<div class="arena-soft-landing"><h4>🛬 ' +
      (he ? "מכינים כרית לנחיתה רכה" : "Prepare a soft landing") +
      "</h4><p>" +
      (he
        ? "עוד לפני שזמן הטלפון נגמר, הכינו 3–4 דברים שאפשר לעבור אליהם. לא מעמיקים עכשיו את הבאסה בוויכוח — מתקפים בקצרה ומיד מזמינים לפעולה."
        : "Before phone time ends, prepare 3–4 things to move into. Don’t deepen the disappointment with an argument; validate briefly and invite action.") +
      '</p><div class="arena-suggestion-list">' +
      examples
        .map(
          (x) =>
            '<button type="button" data-landing="' +
            esc(x) +
            '">' +
            x +
            "</button>",
        )
        .join("") +
      "</div><small>" +
      (he
        ? "נגיעה בדוגמה תכניס אותה למשפט, ואז אפשר לערוך אותה."
        : "Tap an example to use it in your phrase, then edit it.") +
      "</small></div>"
    );
  }
  function cardText() {
    const d = scenarios[s.scenario][s.lang],
      recipient = tr("roles")[s.role],
      phrase = s.customPhrase || d.phrase;
    return (
      (s.lang === "he"
        ? "תוכנית משותפת לרגע קשה"
        : "Shared plan for a hard moment") +
      "\n" +
      (s.lang === "he" ? "לשיתוף עם: " : "Share with: ") +
      recipient +
      "\n" +
      d.name +
      "\n" +
      (s.lang === "he" ? "מה אולי קורה: " : "What may be happening: ") +
      d.feel +
      "\n" +
      (s.lang === "he" ? "מה עוזר: " : "What helps: ") +
      d.helps +
      "\n" +
      (s.lang === "he" ? "מה לא לעשות: " : "Avoid: ") +
      d.avoid +
      "\n" +
      (s.lang === "he" ? "המשפט שלנו: " : "Our phrase: ") +
      phrase
    );
  }
  function shareCard() {
    const d = scenarios[s.scenario][s.lang],
      phrase = s.customPhrase || d.phrase,
      editLabel =
        s.lang === "he"
          ? "המשפט שלנו — אפשר לשנות למילים שלכם"
          : "Our phrase — edit it in your own words";
    stage.innerHTML =
      "<h3>" +
      tr("shareTitle") +
      '</h3><p class="arena-subtitle">' +
      tr("shareSub") +
      '</p><div class="arena-share-card"><h4>' +
      scenarios[s.scenario].icon +
      " " +
      d.name +
      "</h4><dl><dt>" +
      (s.lang === "he" ? "מה אולי קורה" : "What may be happening") +
      "</dt><dd>" +
      d.feel +
      "</dd><dt>" +
      (s.lang === "he" ? "מה עוזר" : "What helps") +
      "</dt><dd>" +
      d.helps +
      "</dd><dt>" +
      (s.lang === "he" ? "לא לעשות" : "Avoid") +
      "</dt><dd>" +
      d.avoid +
      '</dd></dl><label class="arena-edit-label" for="arena-phrase">' +
      editLabel +
      '</label><textarea id="arena-phrase" maxlength="260">' +
      esc(phrase) +
      '</textarea><button type="button" id="arena-phrase-reset" class="arena-text-button">' +
      (s.lang === "he" ? "חזרה לניסוח המקורי" : "Reset original wording") +
      "</button></div>" +
      softLanding() +
      '<div class="arena-role-list">' +
      tr("roles")
        .map(
          (x, i) =>
            '<button data-role="' +
            i +
            '" class="' +
            (s.role === i ? "selected" : "") +
            '">' +
            x +
            "</button>",
        )
        .join("") +
      '</div><div class="arena-actions">' +
      button(tr("share"), "arena-share") +
      button(tr("copy"), "arena-copy", "arena-secondary") +
      button(tr("restart"), "arena-restart", "arena-secondary") +
      '</div><p id="arena-status" class="arena-status" role="status"></p>';
    $("arena-phrase").oninput = (e) => (s.customPhrase = e.target.value);
    $("arena-phrase-reset").onclick = () => {
      s.customPhrase = d.phrase;
      $("arena-phrase").value = d.phrase;
    };
    stage.querySelectorAll("[data-landing]").forEach(
      (b) =>
        (b.onclick = () => {
          const lead =
            s.lang === "he"
              ? "אני רואה שמבאס לעצור. הזמן נגמר. "
              : "I know stopping is disappointing. Time is up. ";
          s.customPhrase = lead + b.dataset.landing;
          $("arena-phrase").value = s.customPhrase;
          $("arena-phrase").focus();
        }),
    );
    stage.querySelectorAll("[data-role]").forEach(
      (b) =>
        (b.onclick = () => {
          s.role = Number(b.dataset.role);
          stage
            .querySelectorAll("[data-role]")
            .forEach((x) => x.classList.toggle("selected", x === b));
        }),
    );
    $("arena-copy").onclick = async () => {
      try {
        await navigator.clipboard.writeText(cardText());
        $("arena-status").textContent = tr("copied");
      } catch (_) {
        $("arena-status").textContent = cardText();
      }
    };
    $("arena-share").onclick = async () => {
      if (navigator.share)
        try {
          await navigator.share({ title: tr("shareTitle"), text: cardText() });
        } catch (_) {}
      else $("arena-copy").click();
    };
    $("arena-restart").onclick = () => setStep(2);
  }
  function open() {
    modal.hidden = false;
    document.body.classList.add("arena-open");
    s.step = 0;
    render();
    $("arena-close").focus();
  }
  function close() {
    modal.hidden = true;
    document.body.classList.remove("arena-open");
    stopNarration();
    $("arena-launch").focus();
  }
  $("arena-launch").onclick = open;
  $("arena-close").onclick = close;
  $("arena-language").onclick = () => {
    s.lang = s.lang === "he" ? "en" : "he";
    render();
  };
  $("arena-voice").onclick = () => {
    s.voice = !s.voice;
    $("arena-voice").setAttribute("aria-pressed", String(s.voice));
    $("arena-voice").textContent = s.voice ? "🔊" : "🔇";
    speak();
  };
  $("arena-contrast").onclick = () => {
    modal.classList.toggle("arena-high-contrast");
    $("arena-contrast").setAttribute(
      "aria-pressed",
      String(modal.classList.contains("arena-high-contrast")),
    );
  };
  $("arena-bouncer-link").onclick = () => {
    close();
    const b = $("tab-bouncer");
    if (b) b.click();
  };
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
