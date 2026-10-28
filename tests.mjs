import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';const require=createRequire(import.meta.url);const {scenarios,esc,labels,initial,guideMap}=require('./app.js');
test('scenario catalog has distinct identifiers',()=>{assert.ok(scenarios.length>=8);assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length)});
test('every scenario completes guidance loop in both languages',()=>{for(const s of scenarios){for(const key of ['title','desc','why','step','small','alternative','script']){assert.equal(s[key].length,2,`${s.id}.${key}`);assert.ok(s[key][0]&&s[key][1],`${s.id}.${key} blank`)}assert.equal(s.question[0].length,4);assert.equal(s.advice[0].length,4);}});
test('medical safeguards and accessibility defaults',()=>{assert.ok(scenarios.find(s=>s.id==='overwhelm').risk);assert.ok(scenarios.find(s=>s.id==='school').risk);assert.equal(initial.lang,'he');assert.ok(labels.en.mine);});
test('user strings are escaped',()=>{assert.equal(esc('<script>" &'), '&lt;script&gt;&quot; &amp;');});
test('every situation connects to a guide chapter',()=>{assert.deepEqual(Object.keys(guideMap).sort(),scenarios.map(s=>s.id).sort());for(const anchor of Object.values(guideMap))assert.match(anchor,/^c(?:[1-9]|10)$/)});
test('unified navigation and deep resources are present',()=>{const index=readFileSync(new URL('./index.html',import.meta.url),'utf8');const app=readFileSync(new URL('./app.js',import.meta.url),'utf8');const guide=readFileSync(new URL('./guide.html',import.meta.url),'utf8');assert.match(index,/data-view="learn"/);assert.match(app,/guide\.html#practice-arena/);assert.match(app,/guide\.html#pdf-toolbox/);assert.match(guide,/class="unified-bridge"/);assert.match(guide,/id="practice-arena"/);assert.match(guide,/id="pdf-toolbox"/);assert.doesNotMatch(guide,/chatgpt\.com\/api\/library\/files/);for(let i=1;i<=6;i++)assert.match(guide,new RegExp(`pdf/parent-tool-0${i}-`))});
test('spoken-language editing and soft landing are available',()=>{const arena=readFileSync(new URL('./guide-arena.js',import.meta.url),'utf8');assert.match(arena,/id="arena-phrase"/);assert.match(arena,/customPhrase/);assert.match(arena,/כרית לנחיתה רכה/);assert.match(arena,/מסיבת ריקודים/);assert.match(arena,/cardText\(\)/)});
test('Bridget tour, reminders and side TAB are wired',()=>{const app=readFileSync(new URL('./app.js',import.meta.url),'utf8');const css=readFileSync(new URL('./styles.css',import.meta.url),'utf8');const guideTab=readFileSync(new URL('./guide-tab.js',import.meta.url),'utf8');assert.match(app,/openBridgetTour/);assert.match(app,/thoughtAnchor/);assert.match(css,/\.bridget-arrow/);assert.match(css,/writing-mode:vertical-rl/);assert.match(guideTab,/thoughtNotes/)});


test('narration stays user initiated and has accessible controls',()=>{
  const arena=readFileSync(new URL('./guide-arena.js',import.meta.url),'utf8');
  const guide=readFileSync(new URL('./guide.html',import.meta.url),'utf8');
  assert.match(arena,/function toggleNarration\(\)/);
  assert.match(arena,/function pauseNarration\(\)/);
  assert.match(arena,/function resumeNarration\(\)/);
  assert.match(arena,/visibilitychange/);
  assert.doesNotMatch(arena,/speak\(\);/);
  assert.match(guide,/id="arena-audio-status"/);
  assert.match(guide,/aria-describedby="arena-audio-status"/);
});
test('manual recording preparation checks local files without a browser API key',()=>{
  const prepare=readFileSync(new URL('./prepare-voice.mjs',import.meta.url),'utf8');
  assert.match(prepare,/existsSync/);
  assert.match(prepare,/audioFormats/);
  assert.match(prepare,/clip\.url =/);
  assert.match(prepare,/--generate/);
});

const pilot = require('./app.js');
test('pilot export requires explicit consent and valid closed answers',()=>{
 const answers={relevance:'yes',action:'not_yet',return:'maybe'};
 assert.equal(pilot.pilotFeedbackText(answers),null);
 assert.equal(pilot.pilotFeedbackText({...answers,consent:'yes',action:'injected personal text'}),null);
 assert.equal(pilot.pilotFeedbackText({...answers,consent:'yes',barrier:'private text'}),null);
 const report=pilot.pilotFeedbackText({...answers,consent:'yes',name:'PRIVATE',scenario:'PRIVATE',saved:'PRIVATE'});
 assert.ok(report.includes('עוד לא ניסיתי'));assert.ok(report.includes('Prefer not to answer'));
 assert.ok(!report.includes('PRIVATE'));assert.ok(!report.includes('undefined'));
 for(const [key,,,options] of pilot.pilotQuestions) for(const [id] of options)
   assert.ok(pilot.pilotFeedbackText({...answers,consent:'yes',[key]:id}));
});
test('Bridget guidance follows situation, adaptation and return in both languages',()=>{
 for(const lang of ['he','en']){pilot.state.lang=lang;
 for(const view of ['home','scenarios','detail','learn','tools','mine']){
 pilot.state.view=view;const html=pilot.bridgetGuide();assert.match(html,/data-action="pilotFeedback"/);assert.match(html,/aria-current="step"/);assert.match(html,/bridget-next-step.webp/);
 }
 pilot.state.view='detail';pilot.state.stepMode='small';assert.match(pilot.bridgetGuide(),lang==='he'?/מצאתם דרך/:/Found a better fit/);
 pilot.state.stepMode='normal';pilot.state.followQuestion=null;
 }
 Object.assign(pilot.state,pilot.initial);
});
test('feedback action blocks invalid form and copies only after explicit consent',async()=>{
 const old={document:global.document,FormData:global.FormData,window:global.window,navigator:Object.getOwnPropertyDescriptor(global,'navigator')};
 let valid=false,copies=[],data={relevance:'yes',action:'partly',return:'yes'},status={textContent:''};
 global.document={getElementById:id=>id==='pilotForm'?{reportValidity:()=>valid}:status};
 global.FormData=class { *[Symbol.iterator](){yield* Object.entries(data)} };
 global.window={isSecureContext:true};
 Object.defineProperty(global,'navigator',{configurable:true,value:{clipboard:{writeText:async text=>copies.push(text)}}});
 const event={target:{closest:()=>({dataset:{action:'copyFeedback'}})}};
 try{
 pilot.actions(event);assert.equal(copies.length,0);
 valid=true;pilot.actions(event);assert.equal(copies.length,0);
 data.consent='yes';pilot.actions(event);await Promise.resolve();assert.equal(copies.length,1);assert.match(copies[0],/חלק ממנו/);assert.ok(status.textContent);
 }finally{
 for(const key of ['document','FormData','window']){if(old[key]===undefined)delete global[key];else global[key]=old[key]}
 if(old.navigator)Object.defineProperty(global,'navigator',old.navigator);else delete global.navigator;
 }
});
