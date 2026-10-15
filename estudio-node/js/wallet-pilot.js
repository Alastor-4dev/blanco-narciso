'use strict';
const $=id=>document.getElementById(id);
async function api(route,body) {
  const res=await fetch('/api/wallet-pilot'+route,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json','X-BN-Pilot':'1'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
  const data=await res.json();if(!res.ok)throw Error(data.error || 'No se pudo completar la operación.');return data;
}
function render(data) {
  $('pilot-points').textContent=data.points.toLocaleString('es-MX');
  $('pilot-stamps').textContent=`${data.stamps}/5`;
  $('pilot-remaining').textContent=data.remaining.toLocaleString('es-MX');
  $('sync-state').textContent=data.syncStatus==='synced'?'Saldo enviado a Google Wallet.':'Sincronización pendiente. El movimiento está guardado.';
  $('history').replaceChildren(...(data.events.length?data.events.slice().reverse().map(event=>{
    const li=document.createElement('li');li.textContent=`${event.reference} · $${(event.cents/100).toLocaleString('es-MX')} MXN · ${new Date(event.at).toLocaleString('es-MX')}`;return li;
  }):[Object.assign(document.createElement('li'),{textContent:'Sin movimientos.'})]));
}
async function initialize() {
  try {
    render(await api(''));
    const {url}=await api('/save');
    const parsed=new URL(url);
    if(parsed.origin!=='https://pay.google.com')throw Error('El enlace de Wallet no es válido.');
    $('save-wallet').href=url;$('save-wallet').textContent='Abrir tarjeta en Google Wallet';$('save-wallet').removeAttribute('aria-disabled');
  }catch(e){$('status').textContent=e.message;}
}
$('purchase-form').addEventListener('submit',async event=>{
  event.preventDefault();$('purchase-submit').disabled=true;$('status').textContent='Guardando y enviando saldo a Google Wallet…';
  try{const data=await api('/purchases',{amount:$('amount').value,reference:$('ticket').value.trim()});render(data);$('status').textContent=data.warning || 'Compra de prueba guardada y saldo enviado. Comprueba la tarjeta en tu teléfono.';$('purchase-form').reset();}
  catch(e){$('status').textContent=e.message;}finally{$('purchase-submit').disabled=false;}
});
$('sync').addEventListener('click',async()=>{ $('sync').disabled=true;try{render(await api('/sync',{}));$('status').textContent='Saldo enviado de nuevo a Google Wallet.';}catch(e){$('status').textContent=e.message;}finally{$('sync').disabled=false;} });
initialize();
