'use strict';
const fs=require('node:fs');
const {GoogleWallet,readConfig}=require('../lib/google-wallet');
const {listCards,ledgerForCard,balance,objectFields}=require('../lib/wallet-pilot');
const base='https://alastor-4dev.github.io/blanco-narciso/img/';
(async()=>{
 const names=['wallet-logo-v2.png','wallet-wordmark-v2.png',...Array.from({length:6},(_,i)=>`wallet-sellos-v2-${i}.png`)];
 await Promise.all(names.map(async name=>{const res=await fetch(base+name,{method:'HEAD',signal:AbortSignal.timeout(15000)});if(!res.ok||!res.headers.get('content-type')?.startsWith('image/png'))throw Error('El recurso aún no está publicado: '+name);}));
 const config=readConfig();const wallet=new GoogleWallet();
 await wallet.request('loyaltyclass/'+config.pilotClassId,{method:'PATCH',body:{reviewStatus:'UNDER_REVIEW',programName:'Fidelidad Narciso',hexBackgroundColor:'#6f917e',programLogo:{sourceUri:{uri:base+'wallet-logo-v2.png'}},wideProgramLogo:{sourceUri:{uri:base+'wallet-wordmark-v2.png'}}}});
 for(const card of listCards()){
  const ledger=JSON.parse(fs.readFileSync(ledgerForCard(card.objectId),'utf8'));
  // Only update the graphic; never overwrite a purchase balance during a design change.
  await wallet.request('loyaltyobject/'+card.objectId,{method:'PATCH',body:{heroImage:objectFields(ledger.cents).heroImage}});
  console.log(`Diseño actualizado: ${card.accountName}, ${balance(ledger.cents).stamps} sellos. Saldo conservado.`);
 }
 const original=await wallet.request('loyaltyclass/'+config.classId);
 console.log('Plantilla original conservada: '+original.reviewStatus);
})().catch(e=>{console.error(e.message);process.exitCode=1});
