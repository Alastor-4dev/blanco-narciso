'use strict';
// Code-native composition of the existing brand assets; never modifies the original logos.
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=process.env.WALLET_ASSET_ORIGIN || 'http://localhost:3101';
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();
const fonts='<link href="https://fonts.cdnfonts.com/css/avoda" rel="stylesheet"><link href="https://fonts.cdnfonts.com/css/brittany-signature" rel="stylesheet">';
try{
 await page.setViewportSize({width:1280,height:400});
 await page.setContent(`${fonts}<style>*{box-sizing:border-box}html,body{margin:0;background:transparent;width:1280px;height:400px}.brand{display:flex;align-items:center;justify-content:center;height:100%;gap:10px;color:white}.brand-logo{width:240px;height:300px;position:relative;overflow:hidden;flex-shrink:0}.brand-logo img{width:400px;height:400px;max-width:none;object-fit:contain;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.word{font:156px Avoda,Georgia,serif;white-space:nowrap}.word em{font:152px 'Brittany Signature',cursive;margin-left:26px}.sub{font:15px Arial;letter-spacing:10px;margin-top:20px;text-align:center}</style><div class="brand"><div class="brand-logo"><img src="${root}/img/logo-white.png"></div><div><div class="word">Blanco<em>Narciso</em></div><div class="sub">ESTUDIO FLORAL</div></div></div>`);
 await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));
 await page.screenshot({path:path.join(__dirname,'..','img','wallet-wordmark-v4.png'),omitBackground:true});
 await page.setViewportSize({width:660,height:660});
 await page.setContent(`<style>html,body{margin:0;width:660px;height:660px;background:#6f917e;display:grid;place-items:center}img{width:460px;height:460px;object-fit:contain}</style><img src="${root}/img/logo-white.png">`);
 await page.waitForFunction(()=>document.images[0].complete&&document.images[0].naturalWidth>0);await page.screenshot({path:path.join(__dirname,'..','img','wallet-logo-v2.png')});
 await page.setViewportSize({width:1032,height:400});
 for(let count=0;count<=5;count++){
  const seals=Array.from({length:5},(_,i)=>`<div class="seal ${i<count?'filled':''}"><img src="${root}/img/${i<count?'logo-navy':'logo-white'}.png"></div>`).join('');
  await page.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;width:1032px;height:400px}.art{height:100%;width:100%;display:flex;gap:28px;justify-content:center;align-items:center;background-color:#6f917e;background-image:repeating-linear-gradient(45deg,#ffffff0a 0 1px,transparent 1px 8px),repeating-linear-gradient(-45deg,#ffffff0a 0 1px,transparent 1px 8px)}.seal{width:148px;height:148px;border:2px solid #ffffff90;border-radius:50%;display:grid;place-items:center}.seal img{width:104px;height:104px;object-fit:contain;opacity:.4}.filled{background:#f7f9f5;border-color:#f7f9f5}.filled img{opacity:1}</style><div class="art">${seals}</div>`);
  await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:path.join(__dirname,'..','img',`wallet-sellos-v2-${count}.png`)});
 }
 console.log('Rendered 660px logo, transparent 1280x400 wordmark and six stamp states from existing brand.');
}finally{await browser.close();}})();
