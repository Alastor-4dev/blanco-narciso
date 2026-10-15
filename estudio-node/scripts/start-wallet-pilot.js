'use strict';
// El piloto solo escucha en loopback; no habilita registro de clientes en producción.
process.env.PORT=process.env.WALLET_PILOT_PORT || '3101';
process.env.WALLET_PILOT_ENABLED='1';
process.env.ADMIN_PASSWORD=process.env.ADMIN_PASSWORD || require('node:crypto').randomBytes(32).toString('hex');
require('../server');
console.log(`Piloto Google Wallet: http://localhost:${process.env.PORT}/wallet-pilot`);
