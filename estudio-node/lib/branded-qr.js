'use strict';
const fs=require('node:fs');const path=require('node:path');const QRCode=require('qrcode');
async function brandedQr(url, options={}) {
  const qr=QRCode.create(url,{errorCorrectionLevel:options.level || 'Q'});
  const margin=4, side=qr.modules.size+margin*2;
  let cells='';
  for(let row=0;row<qr.modules.size;row++)for(let col=0;col<qr.modules.size;col++)if(qr.modules.get(row,col))cells+=`<rect x="${col+margin}" y="${row+margin}" width="1" height="1"/>`;
  // Keep finder/alignment patterns and a four-module quiet zone. Only cover a small central region.
  const box=Math.floor(qr.modules.size*(options.cover || 0.13)), x=(side-box)/2, inset=box*0.17;
  const logo=fs.readFileSync(path.join(__dirname,'..','img','logo-navy.png')).toString('base64');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" fill="white"/><g fill="#1a2b4a" shape-rendering="crispEdges">${cells}</g><rect x="${x}" y="${x}" width="${box}" height="${box}" rx="${box*.14}" fill="white"/><image x="${x+inset}" y="${x+inset}" width="${box-2*inset}" height="${box-2*inset}" href="data:image/png;base64,${logo}"/></svg>`;
}
module.exports={brandedQr};
