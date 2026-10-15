'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const API = 'https://walletobjects.googleapis.com/walletobjects/v1/';
const OAUTH = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/wallet_object.issuer';
const privateDirectory = () => process.env.WALLET_PRIVATE_DIR || path.join(os.homedir(), '.config', 'blanco-narciso');
function readConfig() {
  const file = process.env.GOOGLE_WALLET_CONFIG || path.join(privateDirectory(), 'google-wallet.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}
class WalletError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
class GoogleWallet {
  constructor(options = {}) {
    this.keyFile = options.keyFile || process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(privateDirectory(), 'google-wallet-key.json');
    this.fetch = options.fetch || global.fetch;
    this.clock = options.clock || Date.now;
    this.token = null; this.expiresAt = 0;
  }
  credentials() {
    const key = JSON.parse(fs.readFileSync(this.keyFile, 'utf8'));
    if (key.type !== 'service_account' || !key.client_email || !key.private_key) throw new WalletError(503, 'Credencial de servicio no válida.');
    return key;
  }
  sign(payload, includeKeyId=true) {
    const key = this.credentials();
    const header = Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT',...(includeKeyId ? {kid:key.private_key_id} : {})})).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const input = `${header}.${body}`;
    return `${input}.${crypto.sign('RSA-SHA256', Buffer.from(input), key.private_key).toString('base64url')}`;
  }
  async accessToken() {
    if (this.token && this.expiresAt > this.clock() + 60000) return this.token;
    const now = Math.floor(this.clock() / 1000);
    const assertion = this.sign({iss:this.credentials().client_email,scope:SCOPE,aud:OAUTH,iat:now,exp:now+3600});
    const res = await this.fetch(OAUTH, {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(15000)});
    const data = await res.json();
    if (!res.ok || !data.access_token) throw new WalletError(res.status, 'Google rechazó la autenticación de la cuenta de servicio.');
    this.token = data.access_token;
    this.expiresAt = this.clock() + Number(data.expires_in || 3600) * 1000;
    return this.token;
  }
  async request(resource, {method='GET',body} = {}) {
    if (!/^(loyaltyclass|loyaltyobject)(?:\/[^/?]+)?(?:\?[^#]*)?$/.test(resource)) throw new WalletError(400, 'Recurso Wallet no permitido.');
    const res = await this.fetch(API + resource.replace(/^loyaltyclass/, 'loyaltyClass').replace(/^loyaltyobject/, 'loyaltyObject'), {method,headers:{Authorization:`Bearer ${await this.accessToken()}`,'Content-Type':'application/json'},body:body === undefined ? undefined : JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    if (!res.ok) {
      // No devolver tokens, claves ni respuestas completas de autenticación a la interfaz.
      throw new WalletError(res.status, `Google Wallet devolvió HTTP ${res.status} al ${method === 'GET' ? 'consultar' : 'guardar'} ${resource.split('?')[0]}.`);
    }
    return res.status === 204 ? {} : res.json();
  }
  saveUrl(objectId, origins, classId) {
    const now = Math.floor(this.clock()/1000);
    const jwt = this.sign({iss:this.credentials().client_email,aud:'google',typ:'savetowallet',iat:now,origins,payload:{loyaltyObjects:[{id:objectId,...(classId ? {classId} : {})}]}},false);
    return 'https://pay.google.com/gp/v/save/' + jwt;
  }
}
module.exports = {GoogleWallet,WalletError,readConfig,privateDirectory};
