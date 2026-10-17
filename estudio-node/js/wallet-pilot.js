'use strict';
const $=id=>document.getElementById(id);
let activeCard='';let generation=0;
async function api(route,body,card=activeCard) {
  const query=card?'?card='+encodeURIComponent(card):'';
  const res=await fetch('/api/wallet-pilot'+route+query,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json','X-BN-Pilot':'1'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
  const data=await res.json();if(!res.ok)throw Error(data.error || 'No se pudo completar la operación.');return data;
}
function render(data) {
  $('pilot-points').textContent=data.points.toLocaleString('es-MX');
  $('pilot-stamps').textContent=`${data.stamps} de 5`;
  $('pilot-remaining').textContent=data.remaining.toLocaleString('es-MX');
  $('pilot-remaining-line').textContent=data.stamps===5?'Tu detalle está listo':`Faltan ${5-data.stamps} sellos`;
  $('pilot-progress').value=data.points;$('pilot-progress').textContent=`${data.points} de 2,500`;
  $('member-name').textContent=data.accountName;$('member-id').textContent=data.accountId;
  $('member-birth').textContent=data.birthDate?new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.birthDate+'T12:00:00Z')):'Por completar';
  $('pilot-rewards').textContent=`${data.rewards} disponibles`;
  $('pilot-seals').replaceChildren(...Array.from({length:5},(_,i)=>{
    const seal=document.createElement('span');seal.className='stamp'+(i<data.stamps?' filled':'');
    const logo=document.createElement('img');logo.src=i<data.stamps?'/img/logo-navy.png':'/img/logo-white.png';logo.alt=`Sello ${i+1}: ${i<data.stamps?'obtenido':'pendiente'}`;seal.append(logo);return seal;
  }));
  $('pilot-seals').setAttribute('aria-label',`${data.stamps} de cinco sellos obtenidos`);
  $('sync-state').textContent=data.syncStatus==='synced'?'Saldo enviado a Google Wallet.':'Sincronización pendiente. El movimiento está guardado.';
  $('history').replaceChildren(...(data.events.length?data.events.slice().reverse().map(event=>{
    const li=document.createElement('li');li.textContent=`${event.reference} · ${(event.cents/100).toLocaleString('es-MX')} puntos · ${new Date(event.at).toLocaleString('es-MX')}`;return li;
  }):[Object.assign(document.createElement('li'),{textContent:'Sin movimientos.'})]));
}
async function loadCard(id) {
  activeCard=id;const current=++generation;
  $('save-wallet').setAttribute('aria-disabled','true');$('save-wallet').removeAttribute('href');
  $('status').textContent='';
  const url=new URL(location.href);url.searchParams.set('card',id);history.replaceState(null,'',url);
  const query='?card='+encodeURIComponent(id);
  document.querySelector('.qr').src='/api/wallet-pilot/qr.svg'+query;
  $('qr-large').src='/api/wallet-pilot/qr.svg'+query;
  $('pilot-barcode').src='/api/wallet-pilot/barcode.svg'+query;
  try {
    const [data,save]=await Promise.all([api('',undefined,id),api('/save',undefined,id)]);
    if(current!==generation)return;
    render(data);const parsed=new URL(save.url);if(parsed.origin!=='https://pay.google.com')throw Error('El enlace de Wallet no es válido.');
    $('save-wallet').href=save.url;$('save-wallet').textContent='Añadir a Google Wallet';$('save-wallet').removeAttribute('aria-disabled');
  }catch(e){if(current===generation)$('status').textContent=e.message;}
}
async function loadCards(selected) {
  const {cards}=await api('/cards');
  $('card-select').replaceChildren(...cards.map(card=>{const o=document.createElement('option');o.value=card.objectId;o.textContent=card.accountName;return o;}));
  const chosen=cards.find(c=>c.objectId===selected) || cards[0];
  if(!chosen)throw Error('No hay tarjetas configuradas.');
  $('card-select').value=chosen.objectId;await loadCard(chosen.objectId);
}
function switchTab(name,focus=false) {
  for(const tab of ['save','purchase']){
    const on=tab===name;$('tab-'+tab).setAttribute('aria-selected',String(on));$('tab-'+tab).tabIndex=on?0:-1;$('panel-'+tab).hidden=!on;
  }
  if(focus)$('tab-'+name).focus();
}
for(const name of ['save','purchase']){
  $('tab-'+name).addEventListener('click',()=>switchTab(name));
  $('tab-'+name).addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();switchTab(e.key==='Home'?'save':e.key==='End'?'purchase':name==='save'?'purchase':'save',true);}});
}
$('card-select').addEventListener('change',e=>loadCard(e.target.value));
$('purchase-form').addEventListener('submit',async event=>{
  event.preventDefault();$('purchase-submit').disabled=true;$('card-select').disabled=true;$('status').textContent='Guardando y enviando saldo a Google Wallet…';
  try{const data=await api('/purchases',{amount:$('amount').value,reference:$('ticket').value.trim()});render(data);$('status').textContent=data.warning || 'Puntos registrados. El nuevo saldo se envió a tu tarjeta.';$('purchase-form').reset();}
  catch(e){$('status').textContent=e.message;}finally{$('purchase-submit').disabled=false;$('card-select').disabled=false;}
});
$('new-card-form').addEventListener('submit',async event=>{
  event.preventDefault();const button=event.target.querySelector('button');button.disabled=true;$('card-select').disabled=true;$('status').textContent='Creando una tarjeta individual…';
  try{const card=await api('/cards',{alias:$('card-alias').value.trim()});await loadCards(card.objectId);$('status').textContent='Tarjeta individual creada. Ya puedes abrir su enlace de Google Wallet.';$('new-card-form').reset();document.querySelector('.new-card').open=false;switchTab('save');}
  catch(e){$('status').textContent=e.message;}finally{button.disabled=false;$('card-select').disabled=false;}
});
$('sync').addEventListener('click',async()=>{ $('sync').disabled=true;$('card-select').disabled=true;try{render(await api('/sync',{}));$('status').textContent='Saldo enviado de nuevo a Google Wallet.';}catch(e){$('status').textContent=e.message;}finally{$('sync').disabled=false;$('card-select').disabled=false;} });
loadCards(new URL(location.href).searchParams.get('card')).catch(e=>$('status').textContent=e.message);
setInterval(async()=>{if(document.hidden||!activeCard)return;const id=activeCard;try{const data=await api('',undefined,id);if(id===activeCard)render(data);}catch{}},15000);

$('qr-enlarge').addEventListener('click',()=>$('qr-dialog').showModal());
$('qr-close').addEventListener('click',()=>$('qr-dialog').close());
