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
