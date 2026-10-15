'use strict';
const path = require('node:path');
const {GoogleWallet,readConfig} = require('./google-wallet');
const {WalletPilot} = require('./wallet-pilot');
const QRCode = require('qrcode');
module.exports = function mountWalletPilot(app) {
  if(process.env.WALLET_PILOT_ENABLED !== '1') return;
  const wallet = new GoogleWallet();
  const pilot = new WalletPilot(wallet);
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
  app.get('/api/wallet-pilot',(req,res)=>{
    try {res.json(pilot.summary());} catch(e) {res.status(e.status || 503).json({error:e.message});}
  });
  app.get('/api/wallet-pilot/save',(req,res)=>{
    try {res.json({url:wallet.saveUrl(pilot.summary().objectId,[`http://${req.headers.host}`,'https://alastor-4dev.github.io'],readConfig().pilotClassId)});} catch(e) {res.status(e.status || 503).json({error:e.message});}
  });
  app.get('/api/wallet-pilot/qr.svg',async(req,res)=>{
    try {
      const url=wallet.saveUrl(pilot.summary().objectId,[`http://${req.headers.host}`,'https://alastor-4dev.github.io'],readConfig().pilotClassId);
      res.type('image/svg+xml').send(await QRCode.toString(url,{type:'svg',width:420,margin:4,errorCorrectionLevel:'M'}));
    } catch(e) {res.status(e.status || 503).json({error:e.message});}
  });
  app.post('/api/wallet-pilot/purchases',async(req,res)=>{
    try {res.json(await pilot.purchase(req.body.amount,req.body.reference));} catch(e) {res.status(e.status || 503).json({error:e.message});}
  });
  app.post('/api/wallet-pilot/sync',async(req,res)=>{
    try {res.json(await pilot.enqueue(()=>pilot.synchronize()));} catch(e) {res.status(e.status || 503).json({error:e.message});}
  });
};
