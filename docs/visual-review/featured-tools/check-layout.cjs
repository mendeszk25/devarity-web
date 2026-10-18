const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),sharp=require('sharp');
const baseURL=process.env.BASE_URL || 'http://localhost:8027';
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH || process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});const log=[];
for(const width of [1440,768,390,320]){
 const p=await b.newPage({viewport:{width,height:1000},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',msg=>{if(msg.type()==='assert')errors.push(msg.text())});
 await p.goto(baseURL+'/tools/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const state=await p.evaluate(()=>{const hero=document.querySelector('.hero'),featured=document.querySelector('#destaques-tools'),catalog=document.querySelector('#catalogo');
 console.assert(hero,'Hero não encontrado');console.assert(featured,'Seção de destaques não foi criada');console.assert(catalog,'Catálogo não encontrado');
 console.assert(hero.nextElementSibling===featured,'Destaques não estão imediatamente após o hero');console.assert(featured.nextElementSibling===catalog,'Destaques não estão imediatamente antes do catálogo');
 return {order:hero.nextElementSibling===featured&&featured.nextElementSibling===catalog,position:{heroBottom:hero.offsetTop+hero.offsetHeight,featuredTop:featured.offsetTop,featuredBottom:featured.offsetTop+featured.offsetHeight,catalogTop:catalog.offsetTop},height:featured.offsetHeight,display:getComputedStyle(featured).display,opacity:getComputedStyle(featured).opacity,visibility:getComputedStyle(featured).visibility,overflow:document.documentElement.scrollWidth>innerWidth,products:featured.querySelectorAll('article').length,headings:[...document.querySelectorAll('main h2,main h3')].filter(e=>e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ')),cta:[...featured.querySelectorAll('.featured-cta')].map(e=>({text:e.innerText,href:e.getAttribute('href')}))};});
 assert(state.order);assert(state.height>1200);assert.equal(state.products,3);assert(!state.overflow);assert.equal(state.opacity,'1');assert.equal(state.visibility,'visible');
 // Exercise all styles at the narrow widths and check real glyph boxes, not just page overflow.
 for(const preset of ['minimal','professional','creative']){
  await p.locator(`[data-bio-preset=${preset}]`).click();await p.waitForTimeout(430);
  assert(await p.locator('[data-bio-preview]').evaluate(el=>[...el.querySelectorAll('.featured-bio-line')].every(line=>line.scrollWidth<=line.clientWidth+1)));
 }
 const wa=p.locator('.featured-conversation');const before=await wa.boundingBox();
 await p.locator('#featured-wa-message').fill('Uma mensagem um pouco mais longa para conferir a prévia e manter a composição estável, mesmo quando o texto precisa de mais espaço para aparecer por completo.');
 const after=await wa.boundingBox();assert.equal(after.height,before.height);
 await p.locator('[data-wa-preset=work]').click();await p.waitForTimeout(450);
 // Finish one-time masks by visiting every panel; capture the whole document from its top.
 for(const selector of ['.featured-intro','.featured-bio','.featured-qr','.featured-whatsapp']){await p.locator(selector).scrollIntoViewIfNeeded();await p.waitForTimeout(720);}
 await p.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'})});await p.mouse.move(0,0);await p.waitForTimeout(800);
 const box=await p.locator('#destaques-tools').boundingBox();
 const buffer=await p.screenshot({path:`docs/visual-review/featured-tools/home-${width}.png`,fullPage:true});
 await sharp(buffer).extract({left:Math.floor(box.x),top:Math.floor(box.y),width:Math.floor(box.width),height:Math.floor(box.height)}).png().toFile(`docs/visual-review/featured-tools/featured-${width}.png`);
 for(const [name,sel] of [['bio','.featured-bio'],['qr','.featured-qr'],['whatsapp','.featured-whatsapp']]){const r=await p.locator(sel).boundingBox();if(width===1440||width===390)await sharp(buffer).extract({left:Math.floor(r.x),top:Math.floor(r.y),width:Math.floor(r.width),height:Math.floor(r.height)}).png().toFile(`docs/visual-review/featured-tools/${name}-${width}.png`);}
 const animations=await p.locator('#destaques-tools').evaluate(e=>({running:e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length,headingClip:getComputedStyle(e.querySelector('h2')).clipPath,focused:document.activeElement.tagName}));assert.equal(animations.running,0);assert.equal(animations.headingClip,'none');assert.deepEqual(errors,[]);
 log.push({width,...state,animations,errors});await p.close();
}
fs.writeFileSync('docs/visual-review/featured-tools/layout-results.json',JSON.stringify(log,null,2));console.log(log.map(x=>({width:x.width,order:x.order,height:x.height,overflow:x.overflow,animations:x.animations})));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
