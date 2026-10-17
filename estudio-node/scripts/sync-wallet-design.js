'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {GoogleWallet,readConfig,privateDirectory}=require('../lib/google-wallet');
const {listCards,ledgerForCard,balance,objectFields,writePrivate}=require('../lib/wallet-pilot');
const {classDesign,birthDateLabel}=require('../lib/wallet-design');
const base='https://alastor-4dev.github.io/blanco-narciso/img/';
(async()=>{
 const args=process.argv.slice(2);const cardIndex=args.indexOf('--card'),nameIndex=args.indexOf('--name'),birthIndex=args.indexOf('--birth-date');
 const selected=cardIndex>=0?args[cardIndex+1]:undefined;const name=nameIndex>=0?args[nameIndex+1]:undefined;
 const birthDate=birthIndex>=0?args[birthIndex+1]:undefined;
 const cards=listCards();
 if(selected && !cards.some(c=>c.objectId===selected))throw Error('La tarjeta seleccionada no está registrada.');
 if(name && (!selected || name.trim().length<2 || name.trim().length>40))throw Error('Indica una tarjeta y un nombre de 2 a 40 caracteres.');
 if(birthIndex>=0 && (!selected || birthDateLabel(birthDate)==='Por completar' || birthDate>new Date().toISOString().slice(0,10)))throw Error('Indica una tarjeta y una fecha de nacimiento válida en formato AAAA-MM-DD.');
 const names=['wallet-logo-v2.png','wallet-wordmark-v4.png',...Array.from({length:6},(_,i)=>`wallet-sellos-v2-${i}.png`)];
 await Promise.all(names.map(async file=>{const res=await fetch(base+file,{method:'HEAD',signal:AbortSignal.timeout(15000)});if(!res.ok||!res.headers.get('content-type')?.startsWith('image/png'))throw Error('El recurso aún no está publicado: '+file);}));
 const config=readConfig();const wallet=new GoogleWallet();
 // Refresh the presentation fields without changing points, tickets or account identifiers.
 for(const card of cards){
  const remote=await wallet.request('loyaltyobject/'+card.objectId);
  const points=remote.loyaltyPoints?.balance?.double ?? remote.loyaltyPoints?.balance?.int;
  if(typeof points!=='number')throw Error('No se pudo verificar el saldo remoto.');
  const file=ledgerForCard(card.objectId);const ledger=JSON.parse(fs.readFileSync(file,'utf8'));
  const changeBirth=selected===card.objectId && birthDate;
  const presentation=objectFields(Math.round(points*100),{birthDate:changeBirth || ledger.birthDate});
  const rename=selected===card.objectId && name;
  await wallet.request('loyaltyobject/'+card.objectId,{method:'PATCH',body:{heroImage:presentation.heroImage,textModulesData:presentation.textModulesData,loyaltyPoints:{...remote.loyaltyPoints,label:presentation.loyaltyPoints.label},...(rename?{accountName:name.trim()}:{})}});
  if(rename || changeBirth){
   if(rename)ledger.accountName=name.trim();
   if(changeBirth)ledger.birthDate=birthDate;
   writePrivate(file,ledger);
   if(rename && !card.original){
    const registry=path.join(privateDirectory(),'wallet-pilot-cards.json');
    const entries=JSON.parse(fs.readFileSync(registry,'utf8'));
    writePrivate(registry,entries.map(c=>c.objectId===card.objectId?{...c,accountName:name.trim()}:c));
   }
  }
  const check=await wallet.request('loyaltyobject/'+card.objectId);
  if(JSON.stringify(check.loyaltyPoints.balance)!==JSON.stringify(remote.loyaltyPoints.balance))throw Error('El saldo cambió durante la actualización; revisar movimientos.');
  console.log(`Presentación actualizada: ${rename?name.trim():card.accountName}, ${balance(Math.round(points*100)).stamps} sellos. Saldo conservado.`);
 }
 await wallet.request('loyaltyclass/'+config.pilotClassId,{method:'PATCH',body:{reviewStatus:'UNDER_REVIEW',...classDesign()}});
 const original=await wallet.request('loyaltyclass/'+config.classId);
 console.log('Plantilla original conservada: '+original.reviewStatus);
})().catch(e=>{console.error(e.message);process.exitCode=1});
