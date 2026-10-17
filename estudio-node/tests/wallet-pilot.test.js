'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const crypto=require('node:crypto');
const {GoogleWallet}=require('../lib/google-wallet');
const {WalletPilot,balance,writePrivate}=require('../lib/wallet-pilot');
test('OAuth assertions are signed, scoped and cached; invalid resource is rejected',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bn-auth-'));
 try{const {privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});const file=path.join(dir,'key.json');fs.writeFileSync(file,JSON.stringify({type:'service_account',client_email:'test@example.invalid',private_key:privateKey.export({type:'pkcs8',format:'pem'})}));let authCalls=0,apiCalls=0;
 const wallet=new GoogleWallet({keyFile:file,fetch:async(url,options)=>{
  if(url==='https://oauth2.googleapis.com/token'){authCalls++;const [h,p,s]=options.body.get('assertion').split('.');assert(crypto.verify('RSA-SHA256',Buffer.from(h+'.'+p),publicKey,Buffer.from(s,'base64url')));const claims=JSON.parse(Buffer.from(p,'base64url'));assert.equal(claims.scope,'https://www.googleapis.com/auth/wallet_object.issuer');return {ok:true,json:async()=>({access_token:'test',expires_in:3600})};}
  assert(url.startsWith('https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/'));assert.equal(options.headers.Authorization,'Bearer test');apiCalls++;return {ok:true,status:200,json:async()=>({id:'123.test'})};}});
 await wallet.request('loyaltyobject/123.test');await wallet.request('loyaltyobject/123.test');assert.equal(authCalls,1);assert.equal(apiCalls,2);await assert.rejects(wallet.request('https://attacker.invalid'),/no permitido/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Purchases survive sync failure, reject duplicates, and serialize concurrent tickets',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bn-ledger-'));const old=process.env.WALLET_PILOT_LEDGER;process.env.WALLET_PILOT_LEDGER=path.join(dir,'ledger.json');
 try{writePrivate(process.env.WALLET_PILOT_LEDGER,{objectId:'123.test',cents:0,events:[],syncStatus:'synced'});let fail=true;let patches=[];const pilot=new WalletPilot({request:async(resource,opts)=>{if(fail)throw Error('offline');patches.push(opts.body);return{};}});
 const result=await pilot.purchase('500.25','TICKET-001');assert.equal(result.points,500.25);assert.equal(result.syncStatus,'pending');assert(result.warning);await assert.rejects(pilot.purchase('500.25','TICKET-001'),e=>e.status===409);assert.equal(pilot.summary().events.length,1);
 fail=false;await pilot.synchronize();assert.equal(pilot.summary().syncStatus,'synced');assert.equal(patches.at(-1).loyaltyPoints.balance.double,500.25);
 await Promise.all([pilot.purchase('100','TICKET-002'),pilot.purchase('200','TICKET-003')]);assert.equal(pilot.summary().points,800.25);assert.equal(pilot.summary().events.length,3);await assert.rejects(pilot.purchase('-1','BAD-1'),e=>e.status===400);await assert.rejects(pilot.purchase('0.001','BAD-2'),e=>e.status===400);await assert.rejects(pilot.purchase('2500','BAD-3'),e=>e.status===400);assert.equal(pilot.summary().points,800.25);
 }finally{if(old===undefined)delete process.env.WALLET_PILOT_LEDGER;else process.env.WALLET_PILOT_LEDGER=old;fs.rmSync(dir,{recursive:true,force:true});}
});
test('Five stamp boundary and reward math',()=>{assert.deepEqual(balance(250000),{points:2500,stamps:5,remaining:0,nextStamp:0,rewards:1});assert.equal(balance(49999).stamps,0);assert.equal(balance(50000).stamps,1);assert.equal(balance(120000).remaining,1300)});
test('Different people receive separate cards, balances and identifiers',async()=>{
 const {createCard,listCards,ledgerForCard}=require('../lib/wallet-pilot');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bn-cards-'));
 const before={privateDir:process.env.WALLET_PRIVATE_DIR,config:process.env.GOOGLE_WALLET_CONFIG};
 process.env.WALLET_PRIVATE_DIR=dir;process.env.GOOGLE_WALLET_CONFIG=path.join(dir,'google-wallet.json');
 try{
  writePrivate(process.env.GOOGLE_WALLET_CONFIG,{issuerId:'123',pilotClassId:'123.class',pilotObjectId:'123.original'});
  const fake={request:async(resource,{body})=>body};
  const a=await createCard(fake,'Prueba A');const b=await createCard(fake,'Prueba B');
  assert.notEqual(a.objectId,b.objectId);assert.notEqual(a.accountId,b.accountId);assert.equal(listCards().length,3);
  const first=new WalletPilot(fake,{ledgerFile:ledgerForCard(a.objectId)});const second=new WalletPilot(fake,{ledgerFile:ledgerForCard(b.objectId)});
  await first.purchase('500','TICKET-001');assert.equal(first.summary().points,500);assert.equal(second.summary().points,0);
  assert.throws(()=>ledgerForCard('../../sensitive'),e=>e.status===404);
 }finally{
  for(const [key,value] of [['WALLET_PRIVATE_DIR',before.privateDir],['GOOGLE_WALLET_CONFIG',before.config]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
test('A point update preserves the member birth date in the ledger and the Wallet payload',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bn-birthday-'));
 try{
  const file=path.join(dir,'ledger.json');
  writePrivate(file,{objectId:'123.member',accountName:'Miembro',birthDate:'2004-02-29',cents:0,events:[],syncStatus:'synced'});
  let payload;
  const pilot=new WalletPilot({request:async(resource,{body})=>{payload=body;return{};}},{ledgerFile:file});
  await pilot.purchase('500','TICKET-001');
  assert.equal(pilot.summary().birthDate,'2004-02-29');
  assert.equal(payload.textModulesData.find(m=>m.id==='nacimiento').body,'29 de febrero de 2004');
  assert.equal(payload.loyaltyPoints.balance.double,500);
  assert.equal(JSON.parse(fs.readFileSync(file,'utf8')).birthDate,'2004-02-29');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
