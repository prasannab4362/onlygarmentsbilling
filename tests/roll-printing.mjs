import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const alerts=[];
page.on('dialog',async d=>{alerts.push(d.message());await d.accept();});
await page.addInitScript(()=>{window.print=()=>{top.printed=(top.printed||[]);top.printed.push(document.documentElement.outerHTML);};});
try{
 await page.goto('http://127.0.0.1:8080');await page.locator('#password').fill('owner123');await page.locator('#login button').click();
 await page.locator('nav a[href="#printer"]').click();await page.locator('[data-action="apply-narrow-roll"]').click();
 assert.equal(await page.locator('#width').inputValue(),'50');assert.equal(await page.locator('#height').inputValue(),'25');assert.equal(await page.locator('#paper').inputValue(),'Roll');
 await page.reload();assert.equal(await page.locator('#rollFeed').inputValue(),'Narrow edge across roll');
 for(const [i,name] of ['Narrow roll 50 × 25','Narrow roll 55 × 25','Narrow roll 50 × 20','Narrow roll 55 × 20'].entries()){
  await page.evaluate(async(name)=>{const {seed}=await import('/frontend/core.js');const {applyRollPreset}=await import('/printing/profiles.js');const {labelHTML,printDocument}=await import('/printing/print.js');const db=seed();applyRollPreset(db.settings,name);printDocument(labelHTML([db.products[4],db.products[0],db.products[3]],db.settings),db.settings,'labels');},name);
  await page.waitForFunction(n=>window.printed?.length===n,i+1);
 }
 assert.deepEqual(alerts,[]);
 const prints=await page.evaluate(()=>printed);
 for(let i=0;i<prints.length;i++){
  const output=await browser.newPage();await output.setContent(prints[i]);await output.waitForLoadState('networkidle');
  assert.equal(await output.locator('.roll-page').count(),3);
  const boxes=await output.locator('.roll-page').evaluateAll(xs=>xs.map(x=>{const p=x.getBoundingClientRect(),t=x.querySelector('.sticker').getBoundingClientRect();return {w:p.width,h:p.height,inside:t.left>=p.left-.5&&t.top>=p.top-.5&&t.right<=p.right+.5&&t.bottom<=p.bottom+.5}}));
  const expectedW=i<2?25:20,expectedH=i%2===0?50:55;
  for(const b of boxes){assert.ok(b.inside);assert.ok(Math.abs(b.w-expectedW*96/25.4)<1);assert.ok(Math.abs(b.h-expectedH*96/25.4)<1);}
  await output.emulateMedia({media:'print'});const pdf=await output.pdf({preferCSSPageSize:true,path:`test-results/roll-${expectedW}x${expectedH}.pdf`});
  assert.equal((pdf.toString('latin1').match(/\/Type \/Page\b/g)||[]).length,3,'Exactly one page per sticker');
  if(i===0)await output.screenshot({path:'test-results/narrow-roll-25x50.png',fullPage:true});
  await output.close();
 }
 console.log('PASS: saved roll profile, four measured-range presets, rotated artwork within paper, three copies produce exactly three PDF pages at each size.');
}finally{await browser.close();}
