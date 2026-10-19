import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1050,height:900}});
try{
 await page.goto('http://127.0.0.1:8080');
 const result=await page.evaluate(async()=>{
  const {labelHTML,fitLabels}=await import('/printing/print.js');
  const products=[{name:"Men's Rib Vest",size:'80 cm',barcode:'OG1005',price:142},{name:'Western Garment',size:'32–34',barcode:'OG1001',price:483},{name:'Nighty',size:'XXL',barcode:'H83',price:400}];
  const cases=[{width:60,height:40},{width:50,height:30},{width:75,height:50},{width:40,height:50,labelLayout:'Portrait reference'}];
  document.querySelector('#modal').close();document.body.innerHTML='<h2>Corrected print sizes</h2><div id="samples"></div>';document.body.style.padding='20px';
  document.querySelector('#samples').innerHTML=cases.map(s=>`<h3>${s.width} × ${s.height} mm</h3>`+labelHTML(products,{shop:'ONLY GARMENTS',columns:3,gap:3,...s})).join('');
  await document.fonts.ready;fitLabels(document);
  const errors=[];
  for(const tag of document.querySelectorAll('.sticker')){
   const cells=[...tag.children].filter(e=>e.getClientRects().length);
   for(const e of cells){if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)errors.push('Text overflow: '+e.className);}
   for(let i=0;i<cells.length;i++)for(let j=i+1;j<cells.length;j++){const a=cells[i].getBoundingClientRect(),b=cells[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5)errors.push('Overlapping cells');}
   const w=parseFloat(tag.style.width)*96/25.4;if(Math.abs(tag.getBoundingClientRect().width-w)>1)errors.push('Wrong physical width');
  }
  return {count:document.querySelectorAll('.sticker').length,errors};
 });
 assert.equal(result.count,12);assert.deepEqual(result.errors,[]);
 await page.screenshot({path:'test-results/corrected-label-sizes.png',fullPage:true});
 await page.emulateMedia({media:'print'});await page.pdf({path:'test-results/corrected-label-sizes.pdf',format:'A4',printBackground:true});
 console.log('PASS: 12 labels, four size/layout presets, no text overflow or overlapping cells, exact millimetre widths; screenshot and print PDF generated.');
}finally{await browser.close();}
