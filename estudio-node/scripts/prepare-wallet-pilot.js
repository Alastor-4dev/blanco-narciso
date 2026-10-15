'use strict';
const {preparePilot}=require('../lib/wallet-pilot');
preparePilot().then(result=>console.log(JSON.stringify(result,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
