const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const baseURL=process.env.BASE_URL || 'http://localhost:8027';
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),checks=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(baseURL+'/tools/');
const card=page.locator('[data-object=input]');
await card.scrollIntoViewIfNeeded();
let box=await card.boundingBox();
await page.mouse.move(box.x+box.width*.7,box.y+box.height*.3);
await page.waitForTimeout(350);
assert.equal(await page.locator('[data-tools-transform]').getAttribute('data-engaged'),'input');
assert.notEqual(await card.evaluate(e=>parseFloat(e.style.getPropertyValue('--ry'))),0);
checks.push('Local pointer tilt and connector engagement');
await page.mouse.down();
await page.mouse.move(box.x+box.width*.7+45,box.y+box.height*.3+20,{steps:10});
await page.waitForTimeout(250);
await page.mouse.up();
await page.waitForTimeout(45);
box=await card.boundingBox();
await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
const before=await card.boundingBox();await page.mouse.down();await page.waitForTimeout(35);const after=await card.boundingBox();
assert(Math.abs(after.x-before.x)<12);
await page.mouse.move(3000,3000,{steps:15});await page.waitForTimeout(400);
const bounds=await card.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.top>=b.top&&a.bottom<=b.bottom});
assert(bounds);await page.mouse.up();await page.mouse.move(0,0);await page.waitForTimeout(1200);
assert.equal(await card.evaluate(e=>parseFloat(e.style.getPropertyValue('--x'))),0);
checks.push('Re-grab during return, extreme drag stays bounded, spring settles');
await page.locator('[data-object=engine]').click();await page.waitForTimeout(150);
assert.equal(await page.locator('[data-tools-transform]').getAttribute('data-processing'),'true');
await page.locator('[data-transform-mode=text]').click();await page.waitForTimeout(800);
assert.equal(await page.locator('[data-tools-transform]').getAttribute('data-processing'),null);
assert.equal(await page.locator('[data-demo-output]').innerText(),'Conte seu conteúdo.');
checks.push('Mode change interrupts finite sequence');
await card.focus();await page.keyboard.down('Space');
assert.equal(await page.locator('[data-tools-transform]').getAttribute('data-processing'),null);
await page.keyboard.up('Space');assert.match(await page.locator('[data-demo-status]').innerText(),/Abra a ferramenta/);
checks.push('Space activates card on keyup without scrolling');
await page.locator('[data-object=engine]').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
assert.equal(await page.locator('[data-tools-transform]').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);
checks.push('Enabling reduced motion cancels running motion');
for(const slug of ['comprimir-imagem','converter-imagem','converter-arquivos','juntar-pdf','gerar-qr-code','link-whatsapp','bio-instagram','imagens-para-pdf','contador-caracteres','gerar-senha']){
 await page.goto(baseURL+'/tools/'+slug+'/');await page.locator('#tool-workspace h3').first().waitFor();
 if(slug==='converter-imagem'){
  await page.locator('#file-input').setInputFiles({name:'sample.png',mimeType:'image/png',buffer:fs.readFileSync('assets/devarity-logo-white.png')});
  await page.locator('#fmt').selectOption('image/webp');await page.locator('#run-image').click();await page.waitForFunction(()=>!document.querySelector('#save-image').disabled);
 }
 if(slug==='contador-caracteres'){await page.locator('#count-text').fill('Olá, mundo.');assert.match(await page.locator('#tool-workspace').innerText(),/11/);}
 checks.push('Existing tool loaded: '+slug);
}
assert.deepEqual(errors,[]);
fs.writeFileSync('docs/visual-review/hero-refinement-v2/regression-results.json',JSON.stringify({checks,errors},null,2));
console.log(checks);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
