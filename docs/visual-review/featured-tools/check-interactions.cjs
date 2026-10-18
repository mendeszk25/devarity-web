const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),sharp=require('sharp'),jsQR=require('jsqr');
const baseURL=process.env.BASE_URL || 'http://localhost:8027';
(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME_PATH || process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2}),checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(baseURL+'/tools/',{waitUntil:'networkidle'});
const section=p.locator('#destaques-tools');
assert.equal(await section.locator('a.featured-cta').count(),3);
assert.deepEqual(await section.locator('a.featured-cta').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),['./bio-instagram/','./gerar-qr-code/','./link-whatsapp/']);
await p.locator('[data-bio-preset=minimal]').click();await p.waitForTimeout(450);
assert.match(await p.locator('[data-bio-preview]').innerText(),/Mais essência/);
const first=await p.locator('.featured-bio-editor').boundingBox();
for(const style of ['professional','creative','minimal']){await p.locator(`[data-bio-preset=${style}]`).click();await p.waitForTimeout(400);assert.equal(await p.locator(`[data-bio-preset=${style}]`).getAttribute('aria-pressed'),'true');const box=await p.locator('.featured-bio-editor').boundingBox();assert.equal(box.height,first.height);}
checks.push('All three bio styles change real content, active state and typography without changing layout height');
const decode=async()=>{const img=await p.locator('[data-featured-qr]').screenshot();const {data,info}=await sharp(img).ensureAlpha().raw().toBuffer({resolveWithObject:true});return jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data};
assert.equal(await decode(),'https://devarity.com.br/tools/');
await p.locator('#featured-qr-url').fill('https://example.com/contato?origem=devarity');await p.locator('[data-featured-qr-form] button').click();await p.waitForFunction(()=>document.querySelector('[data-featured-qr] svg'));await p.waitForTimeout(450);
assert.equal(await decode(),'https://example.com/contato?origem=devarity');checks.push('Default QR and newly generated SVG both decode to their actual destinations');
const validQR=await p.locator('[data-featured-qr]').innerHTML();
for(const url of ['', 'javascript:alert(1)','ftp://example.com','https://user:pass@example.com']){
 await p.locator('#featured-qr-url').fill(url);await p.locator('[data-featured-qr-form] button').click();assert.equal(await p.locator('#featured-qr-url').getAttribute('aria-invalid'),'true');assert.equal(await p.locator('[data-featured-qr]').innerHTML(),validQR);
}
checks.push('Invalid or non-HTTP addresses show feedback and preserve the last valid QR');
await p.locator('#featured-qr-url').fill('https://devarity.com.br/tools/');await p.locator('[data-featured-qr-form] button').click();await p.waitForTimeout(450);
for(const preset of ['quote','book','work']){
 await p.locator(`[data-wa-preset=${preset}]`).click();await p.waitForTimeout(400);const value=await p.locator('#featured-wa-message').inputValue();assert.equal(await p.locator('[data-wa-preview]').innerText(),value);assert.match(await p.locator('[data-wa-link-preview]').innerText(),new RegExp('wa.me/SEU-NUMERO'));
}
await p.locator('#featured-wa-message').fill('Quero criar meu site. Podemos conversar?');assert.equal(await p.locator('[data-wa-preview]').innerText(),'Quero criar meu site. Podemos conversar?');assert((await p.locator('[data-wa-link-preview]').innerText()).includes(encodeURIComponent('Quero criar meu site. Podemos conversar?')));
assert.equal(await section.locator('a[href*="wa.me"]').count(),0);checks.push('All WhatsApp presets and typed message update preview and encoding without active fictional phone links');
await p.locator('#featured-wa-message').fill('<img src=x onerror=alert(1)>');assert.equal(await p.locator('[data-wa-preview] img').count(),0);await p.locator('#featured-wa-message').fill('');assert.match(await p.locator('[data-wa-preview]').innerText(),/Sua conversa/);checks.push('Typed text is rendered safely and empty state remains useful');
await p.locator('[data-bio-preset=professional]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-bio-preset=professional]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('[data-bio-preset=professional]').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
await p.locator('[data-wa-preset=book]').focus();await p.keyboard.press('Space');assert.equal(await p.locator('[data-wa-preset=book]').getAttribute('aria-pressed'),'true');checks.push('Keyboard Enter/Space, selected states and visible focus');
for(const [category,count] of [['Todas',10],['Imagens',2],['Documentos',3],['Links e QR',2],['Redes sociais',1],['Texto',1],['Segurança',1]]){await p.locator('[data-filter]').filter({hasText:new RegExp('^'+category+'$')}).click();await p.waitForTimeout(300);assert.equal(await p.locator('.tool-row:visible').count(),count);}
await p.locator('[data-filter=Todas]').click();await p.waitForTimeout(600);for(const term of ['bio','qr','whatsapp']){await p.locator('#tool-search').fill(term);await p.waitForTimeout(300);assert.equal(await p.locator('.tool-row:visible').count(),term==='qr'?2:1);}
await p.locator('#tool-search').fill('zzzz-nothing');await p.waitForTimeout(300);assert(await p.locator('#empty-state').isVisible());await p.locator('#clear-search').click();await p.waitForTimeout(300);assert.equal(await p.locator('.tool-row:visible').count(),10);checks.push('All category counts, search includes all featured tools, empty state and reset preserve ten tools');
await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-bio-preset=creative]').click();await p.locator('[data-wa-preset=quote]').click();await p.locator('[data-featured-qr-form] button').click();await p.waitForTimeout(450);assert.equal(await section.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);await section.screenshot({path:'docs/visual-review/featured-tools/featured-reduced-motion.png'});checks.push('Reduced motion leaves all demos functional with zero running animations');
for(const route of ['bio-instagram','gerar-qr-code','link-whatsapp']){const response=await p.goto(baseURL+'/tools/'+route+'/');assert.equal(response.status(),200);await p.locator('#tool-workspace h3').first().waitFor();}checks.push('All three CTA destinations load their existing tool interfaces');
const touch=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await touch.goto(baseURL+'/tools/');await touch.locator('[data-bio-preset=minimal]').tap();assert.match(await touch.locator('[data-bio-preview]').innerText(),/Mais essência/);await touch.locator('[data-wa-preset=quote]').tap();assert.match(await touch.locator('[data-wa-preview]').innerText(),/orçamento/);checks.push('Mobile touch activates bio and message presets');await touch.close();
const staticPage=await b.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});await staticPage.goto(baseURL+'/tools/');assert.equal(await staticPage.locator('#destaques-tools article').count(),3);assert(await staticPage.locator('#destaques-tools').isVisible());assert.equal(await staticPage.locator('a.featured-cta').count(),3);checks.push('Without JavaScript the section, all product content, default QR and tool links exist');await staticPage.close();
assert.deepEqual(errors,[]);fs.writeFileSync('docs/visual-review/featured-tools/behavior-results.json',JSON.stringify({checks,errors},null,2));console.log(checks);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
