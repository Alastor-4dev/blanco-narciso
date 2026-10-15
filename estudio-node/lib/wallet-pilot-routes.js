'use strict';
const path = require('node:path');
const {GoogleWallet,readConfig} = require('./google-wallet');
const {WalletPilot,listCards,ledgerForCard,createCard} = require('./wallet-pilot');
const {brandedQr} = require('./branded-qr');
const bwip = require('bwip-js');
module.exports = function mountWalletPilot(app) {
  if(process.env.WALLET_PILOT_ENABLED !== '1') return;
  const wallet = new GoogleWallet();
  const pilots = new Map();
  function selected(req) {
    const id=typeof req.query.card==='string'?req.query.card:readConfig().pilotObjectId;
    const ledgerFile=ledgerForCard(id);
    if(!pilots.has(id))pilots.set(id,new WalletPilot(wallet,{ledgerFile}));
    return pilots.get(id);
  }
  function localOnly(req,res,next) {
    const local = ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
    const host = req.headers.host || '';
    if(!local || !/^(localhost|127\.0\.0\.1):\d+$/.test(host) || req.headers['sec-fetch-site']==='cross-site') return res.status(403).json({error:'Piloto disponible únicamente en esta computadora.'});
    const origin = `http://${host}`;
    if(req.headers.origin && req.headers.origin !== origin) return res.status(403).json({error:'Origen no permitido.'});
    if(req.method!=='GET' && (req.headers.origin!==origin || req.headers['x-bn-pilot']!=='1' || !req.is('application/json'))) return res.status(403).json({error:'Solicitud local no válida.'});
    res.setHeader('Cache-Control','no-store'); res.setHeader('Referrer-Policy','no-referrer');
    next();
  }
  app.use(['/wallet-pilot','/api/wallet-pilot'],localOnly);
  app.get('/wallet-pilot',(req,res)=>res.sendFile(path.join(__dirname,'..','wallet-pilot.html')));
  const handle=fn=>async(req,res)=>{try{await fn(req,res);}catch(e){res.status(e.status || 503).json({error:e.message});}};
  app.get('/api/wallet-pilot',handle((req,res)=>res.json(selected(req).summary())));
  app.get('/api/wallet-pilot/cards',handle((req,res)=>res.json({cards:listCards()})));
  let createQueue=Promise.resolve();
  app.post('/api/wallet-pilot/cards',handle(async(req,res)=>{
    const action=createQueue.then(()=>createCard(wallet,req.body.alias));createQueue=action.catch(()=>{});
    res.status(201).json(await action);
  }));
  function saveUrl(req) {return wallet.saveUrl(selected(req).summary().objectId,[`http://${req.headers.host}`],readConfig().pilotClassId);}
  app.get('/api/wallet-pilot/save',handle((req,res)=>res.json({url:saveUrl(req)})));
  app.get('/api/wallet-pilot/qr.svg',handle(async(req,res)=>res.type('image/svg+xml').send(await brandedQr(saveUrl(req)))));
  app.get('/api/wallet-pilot/barcode.svg',handle((req,res)=>res.type('image/svg+xml').send(bwip.toSVG({bcid:'code128',text:selected(req).summary().accountId,scale:2,height:11,includetext:false,padding:10}))));
  app.post('/api/wallet-pilot/purchases',handle(async(req,res)=>res.json(await selected(req).purchase(req.body.amount,req.body.reference))));
  app.post('/api/wallet-pilot/sync',handle(async(req,res)=>{const pilot=selected(req);res.json(await pilot.enqueue(()=>pilot.synchronize()));}));
};
