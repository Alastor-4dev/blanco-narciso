'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {GoogleWallet,readConfig,privateDirectory,WalletError} = require('./google-wallet');
const crypto = require('node:crypto');
const files = {
  config: () => process.env.GOOGLE_WALLET_CONFIG || path.join(privateDirectory(),'google-wallet.json'),
  ledger: () => process.env.WALLET_PILOT_LEDGER || path.join(privateDirectory(),'wallet-pilot-ledger.json')
};
function writePrivate(file,data) {
  fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  const temporary = file + '.tmp';
  fs.writeFileSync(temporary,JSON.stringify(data,null,2),{mode:0o600});
  fs.chmodSync(temporary,0o600); fs.renameSync(temporary,file);
}
function balance(cents) {
  const points = cents / 100;
  const stamps = Math.min(5,Math.floor(points / 500));
  return {points,stamps,remaining:Math.max(0,2500-points),nextStamp:stamps===5?0:500-points%500,rewards:points>=2500?1:0};
}
function objectFields(cents) {
  const b = balance(cents);
  return {
    loyaltyPoints:{label:'Puntos',balance:{double:b.points}},
    secondaryLoyaltyPoints:{label:'Sellos',balance:{string:`${b.stamps} de 5`}},
    heroImage:{sourceUri:{uri:`https://alastor-4dev.github.io/blanco-narciso/img/wallet-sellos-v2-${b.stamps}.png`},contentDescription:{defaultValue:{language:'es-419',value:`${b.stamps} de cinco sellos de Blanco Narciso`}}},
    textModulesData:[
      {id:'compras',header:'Compras de prueba acumuladas',body:`$${b.points.toFixed(2)} MXN`},
      {id:'faltante',header:'Para tu recompensa',body:b.remaining===0?'Cinco sellos completos. Premio de prueba disponible.':`${b.remaining.toLocaleString('es-MX')} puntos pendientes de 2,500.`},
      {id:'premios',header:'Recompensas de prueba',body:`${b.rewards} disponibles`},
      {id:'prueba',header:'Tarjeta de prueba',body:'Prueba técnica sin compras reales ni validez comercial.'}
    ]
  };
}
async function preparePilot(wallet = new GoogleWallet()) {
  const config = readConfig();
  if(!config.issuerId) throw new WalletError(503,'Falta el identificador de emisor.');
  const sourceId = `${config.issuerId}.blanco_narciso_fidelidad`;
  const original = await wallet.request('loyaltyclass/'+sourceId);
  const classId = `${config.issuerId}.bn_prueba_tecnica_v1`;
  const objectId = `${config.issuerId}.bn_prueba_local_0001`;
  let cls;
  try {cls = await wallet.request('loyaltyclass/'+classId);} catch(e) {
    if(e.status!==404) throw e;
    cls = await wallet.request('loyaltyclass',{method:'POST',body:{
      id:classId,issuerName:'Blanco Narciso',programName:'Flores que vuelven',
      programLogo:original.programLogo,hexBackgroundColor:original.hexBackgroundColor || '#6f917e',
      accountNameLabel:'Nombre',accountIdLabel:'ID de miembro',reviewStatus:'UNDER_REVIEW',
      countryCode:'MX',multipleDevicesAndHoldersAllowedStatus:'ONE_USER_ALL_DEVICES',
      textModulesData:original.textModulesData || [],
      homepageUri:{uri:'https://alastor-4dev.github.io/blanco-narciso/',description:'Blanco Narciso'}
    }});
  }
  let obj;
  try {obj = await wallet.request('loyaltyobject/'+objectId);} catch(e) {
    if(e.status!==404) throw e;
    obj = await wallet.request('loyaltyobject',{method:'POST',body:{id:objectId,classId,state:'ACTIVE',accountName:'Cliente de prueba',accountId:'BNTEST0001',barcode:{type:'CODE_128',value:'BNTEST0001',alternateText:'BNTEST0001'},...objectFields(0)}});
  }
  config.classId = sourceId; config.pilotClassId = classId; config.pilotObjectId = objectId;
  writePrivate(files.config(),config);
  if(!fs.existsSync(files.ledger())) writePrivate(files.ledger(),{objectId,cents:0,events:[],syncStatus:'synced'});
  return {originalClassId:sourceId,originalStatus:original.reviewStatus,pilotClassId:classId,pilotStatus:cls.reviewStatus,objectId:obj.id};
}
class WalletPilot {
  constructor(wallet=new GoogleWallet(), options={}) {this.wallet=wallet;this.queue=Promise.resolve();this.ledgerFile=options.ledgerFile || files.ledger();}
  ledger() {
    if(!fs.existsSync(this.ledgerFile)) throw new WalletError(503,'Primero prepara la tarjeta piloto desde el servidor.');
    return JSON.parse(fs.readFileSync(this.ledgerFile,'utf8'));
  }
  summary() {
    const data=this.ledger();
    return {objectId:data.objectId,accountName:data.accountName || 'Cliente de prueba',accountId:data.accountId || 'BNTEST0001',...balance(data.cents),syncStatus:data.syncStatus,events:data.events};
  }
  async synchronize() {
    const data=this.ledger();
    try {
      await this.wallet.request('loyaltyobject/'+data.objectId,{method:'PATCH',body:objectFields(data.cents)});
      data.syncStatus='synced';
    } catch(e) {data.syncStatus='pending';writePrivate(this.ledgerFile,data);throw e;}
    writePrivate(this.ledgerFile,data);
    return this.summary();
  }
  enqueue(action) {
    const next=this.queue.then(action); this.queue=next.catch(()=>{}); return next;
  }
  purchase(amount,reference) {
    return this.enqueue(async()=>{
      const raw=String(amount ?? '');
      if(!/^\d{1,4}(?:\.\d{1,2})?$/.test(raw)) throw new WalletError(400,'Introduce un importe válido con hasta dos decimales.');
      const cents=Math.round(Number(raw)*100);
      if(cents<=0) throw new WalletError(400,'El importe debe ser mayor a cero.');
      if(typeof reference!=='string' || !/^[A-Za-z0-9_-]{3,40}$/.test(reference)) throw new WalletError(400,'Usa una referencia de 3 a 40 letras, números, guiones o guion bajo.');
      const data=this.ledger();
      if(data.events.some(e=>e.reference===reference)) throw new WalletError(409,'Ese ticket de prueba ya está registrado.');
      if(data.cents+cents>250000) throw new WalletError(400,'Este piloto admite hasta 2,500 puntos. Falta definir las reglas para excedentes.');
      data.cents+=cents; data.events.push({reference,cents,at:new Date().toISOString()}); data.syncStatus='pending';
      writePrivate(this.ledgerFile,data);
      try {return await this.synchronize();} catch {return {...this.summary(),warning:'La compra quedó guardada; la sincronización con Google está pendiente. Reintenta la sincronización sin registrar otra vez el ticket.'};}
    });
  }
}

function cardsFile() {return path.join(privateDirectory(),'wallet-pilot-cards.json');}
function listCards() {
  const config=readConfig();
  const initial={objectId:config.pilotObjectId,accountName:'Mi tarjeta de prueba',accountId:'BNTEST0001',original:true};
  const extra=fs.existsSync(cardsFile())?JSON.parse(fs.readFileSync(cardsFile(),'utf8')):[];
  return [initial,...extra].filter(c=>c.objectId);
}
function ledgerForCard(objectId) {
  const card=listCards().find(c=>c.objectId===objectId);
  if(!card)throw new WalletError(404,'Tarjeta de prueba no encontrada.');
  return card.original ? files.ledger() : path.join(privateDirectory(),'pilot-cards',card.accountId+'.json');
}
async function createCard(wallet,alias) {
  if(typeof alias!=='string' || alias.trim().length<2 || alias.trim().length>40)throw new WalletError(400,'Escribe un alias de prueba de 2 a 40 caracteres.');
  const name=alias.trim();
  const config=readConfig();
  const suffix=crypto.randomBytes(6).toString('hex');
  const objectId=config.issuerId+'.bn_prueba_'+suffix;
  const accountId='BN'+suffix.toUpperCase();
  await wallet.request('loyaltyobject',{method:'POST',body:{id:objectId,classId:config.pilotClassId,state:'ACTIVE',accountName:name,accountId,barcode:{type:'CODE_128',value:accountId,alternateText:accountId},...objectFields(0)}});
  const card={objectId,accountName:name,accountId};
  const existing=fs.existsSync(cardsFile())?JSON.parse(fs.readFileSync(cardsFile(),'utf8')):[];
  writePrivate(path.join(privateDirectory(),'pilot-cards',accountId+'.json'),{objectId,accountName:name,accountId,cents:0,events:[],syncStatus:'synced'});
  writePrivate(cardsFile(),[...existing,card]);
  return card;
}

module.exports={preparePilot,WalletPilot,balance,objectFields,writePrivate,listCards,ledgerForCard,createCard};
