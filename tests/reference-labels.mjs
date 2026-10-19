import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1100,height:850}});
try{
 await page.goto('http://127.0.0.1:8080');await page.locator('#password').fill('owner123');await page.locator('#login button').click();
 await page.locator('nav a[href="#products"]').click();await page.locator('[data-action="product"]').first().click();
 const code=await page.locator('#barcode').inputValue();assert.match(code,/^H\d+$/);assert.equal(await page.locator('#barcode').getAttribute('readonly'),'');
 await page.locator('#name').fill('Nighty');await page.locator('#size').fill('XL');await page.locator('#colour').fill('Red floral');await page.locator('#price').fill('400');await page.locator('#supplier').fill('Demo dealer');await page.locator('#editor button.primary').click();
 await page.reload();await page.locator('#lookupCode').fill(code.slice(1));await page.locator('#lookupForm button').click();await page.locator('#modal[open]').waitFor();assert.match(await page.locator('#modal').innerText(),/Red floral/);assert.match(await page.locator('#modal').innerText(),/Demo dealer/);await page.locator('#modal [data-action="product-label"]').click();await page.waitForSelector('.reference-label');assert.match(await page.locator('.ref-code').innerText(),new RegExp(code));
 await page.locator('#labelLayout').selectOption('Portrait reference');await page.locator('.label-select').last().check();await page.locator('[data-action="preview-labels"]').click();await page.waitForSelector('.portrait-label');assert.equal(await page.locator('#labelPreview svg').count(),0);
 const html=await page.evaluate(async()=>{const {labelHTML}=await import('/printing/print.js');const settings={shop:'KUMAR JAWLY STORES',columns:1,gap:3,width:60,height:40};return labelHTML([{name:'Nighty',size:'XL',barcode:'H83',price:400}],settings)+labelHTML([{name:'Trunks',size:'80',barcode:'H532',price:180}],{...settings,width:40,height:50,labelLayout:'Portrait reference'});});
 await page.setContent(`<html><head><base href="http://127.0.0.1:8080/"><link rel="stylesheet" href="frontend/styles.css"></head><body style="padding:32px;background:#eee"><h2>Sticker designs from your references</h2><div style="display:flex;gap:32px;align-items:start">${html}</div></body></html>`);await page.waitForLoadState('networkidle');await page.screenshot({path:'test-results/reference-stickers.png'});
 console.log('PASS: generated read-only code, saved details after reload, numeric lookup, both reference label layouts and QR-only rendering.');
}finally{await browser.close();}
