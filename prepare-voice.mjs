// Build-time only. Secrets never ship to the browser. Only fixed educational copy is sent.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('./guide-arena.js', import.meta.url), 'utf8');
const extract = (name, next) => vm.runInNewContext(source.slice(source.indexOf(`  const ${name} =`),source.indexOf(`  const ${next} =`)) + `\n${name};`);
const copy = extract('copy','scenarios');
const scenarios = extract('scenarios','strengths');
const clips = {};
for (const lang of ['he','en']) {
  const c = copy[lang];
  const steps = [c.consentSub,c.avatarsSub,c.scenarioSub,c.profileSub,'',c.shareSub];
  steps.forEach((text,i)=>{if(text) clips[`${lang}-${i}`]={text,url:null};});
  for(const [id,s] of Object.entries(scenarios)) clips[`${lang}-4-${id}`]={text:`${s[lang].desc} ${s[lang].line}`,url:null};
}
const generate = process.argv.includes('--generate');
if(generate && (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID)) {
  throw new Error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID securely in the build environment. Do not put them in frontend code.');
}
if(generate){
  mkdirSync(new URL('./audio/',import.meta.url),{recursive:true});
  for(const [id,clip] of Object.entries(clips)) {
    if(!id.startsWith('he-')) continue;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(process.env.ELEVENLABS_VOICE_ID)}`, {
      method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({text:clip.text,model_id:'eleven_v3',language_code:'he',voice_settings:{stability:0.5,similarity_boost:0.75,speed:0.95}})
    });
    if(!response.ok) throw new Error(`Audio generation failed: ${response.status} (${id})`);
    if(!(response.headers.get('content-type')||'').includes('audio')) throw new Error('Expected an audio response');
    writeFileSync(new URL(`./audio/${id}.mp3`,import.meta.url),Buffer.from(await response.arrayBuffer()));
    clip.url=`audio/${id}.mp3`;
  }
}
writeFileSync(new URL('./arena-voice.js',import.meta.url),`window.ARENA_VOICE = ${JSON.stringify(clips,null,2)};\n`);
console.log(`${Object.keys(clips).length} narration entries prepared; ${generate?'Hebrew audio generated':'no audio generated (credentials required)'}.`);
