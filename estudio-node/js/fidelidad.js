'use strict';
// Identidad de muestra: sustituir por datos del servidor autenticado al activar emisión.
const stamps = document.getElementById('stamps');
for (let i = 0; i < 5; i++) {
  const seal = document.createElement('span');
  seal.className = 'stamp' + (i < 2 ? ' filled' : '');
  const logo = document.createElement('img');
  logo.src = i < 2 ? '/img/logo-navy.png' : '/img/logo-white.png';
  logo.alt = `Sello ${i + 1}: ${i < 2 ? 'obtenido' : 'pendiente'}`;
  seal.append(logo); stamps.append(seal);
}
// Code 39 válido, con zonas de silencio. No superponer el logo sobre las barras.
const patterns = { '0':'nnnwwnwnn', '1':'wnnwnnnnw', '*':'nwnnwnwnn' };
const svg = document.getElementById('member-barcode');
const code = '*0000000001*';
let x = 16;
for (const character of code) {
  [...patterns[character]].forEach((unit, i) => {
    const width = unit === 'w' ? 3 : 1;
    if (i % 2 === 0) {
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x); bar.setAttribute('y', '0');
      bar.setAttribute('width', width); bar.setAttribute('height', '66');
      bar.setAttribute('fill', '#111'); svg.append(bar);
    }
    x += width;
  });
  x += 1;
}
svg.setAttribute('viewBox', `0 0 ${x+16} 66`);

// La muestra nunca transmite ni persiste información personal.
const form = document.getElementById('registration-form');
const birth = document.getElementById('member-birth');
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
birth.max = today;
birth.addEventListener('input', () => birth.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('member-name');
  const phone = document.getElementById('member-phone');
  name.setCustomValidity(name.value.trim().length < 2 ? 'Escribe tu nombre completo.' : '');
  const digits = phone.value.replace(/\D/g, '');
  phone.setCustomValidity(digits.length < 10 || digits.length > 15 ? 'Escribe un teléfono de entre 10 y 15 dígitos, incluyendo la lada.' : '');
  birth.setCustomValidity(birth.value > today ? 'La fecha de nacimiento no puede estar en el futuro.' : '');
  if (!form.reportValidity()) return;
  document.getElementById('card-member-name').textContent = name.value.trim();
  document.getElementById('point-count').textContent = '0';
  const progress = document.querySelector('progress');
  progress.value = 0; progress.textContent = '0 de 2,500';
  document.querySelectorAll('.stamp').forEach((seal,i) => {
    seal.classList.remove('filled');
    seal.querySelector('img').src = '/img/logo-white.png';
    seal.querySelector('img').alt = `Sello ${i+1}: pendiente`;
  });
  stamps.setAttribute('aria-label','Cero de cinco sellos obtenidos');
  document.querySelector('.pass-progress strong').textContent = '0 de 5';
  document.querySelector('.pass-progress>span:last-child').textContent = 'Faltan 5 sellos';
  const fields = document.querySelectorAll('.purchase-summary dd');
  fields[1].textContent = '$0 MXN · muestra'; fields[2].textContent = '5 sellos';
  document.getElementById('registration-status').textContent = 'Tu vista previa está lista. No se creó una cuenta real; la descarga a Wallet sigue pendiente de activar.';
  document.getElementById('card-preview').focus({preventScroll:true});
  document.getElementById('card-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
for (const id of ['member-name','member-phone']) document.getElementById(id).addEventListener('input',e=>e.target.setCustomValidity(''));
document.querySelector('.consent a').addEventListener('click',()=>document.querySelector('#terms details').open=true);
