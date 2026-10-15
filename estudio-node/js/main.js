/* ============================================================
   BLANCO NARCISO · Estudio Floral
   main.js — Versión HTML/CSS/JS
   ============================================================ */

'use strict';

/* ── SVG Icons ─────────────────────────────────────────────── */
const SVG = {
  arrowDownRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  xSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  flower2: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/><circle cx="12" cy="12" r="3"/><path d="m8 16 1.5-1.5"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  repeat: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  gift: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.92 12 19.79 19.79 0 0 1 1.85 3.36a2 2 0 0 1 1.995-2.185l3 .001a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
};

/* ── Data ──────────────────────────────────────────────────── */
// Los productos se cargan desde la API (editables en /admin.html)
let arrangements = [];

const SIZES = [
  { key: 'chico',   label: 'Chico'   },
  { key: 'mediano', label: 'Mediano' },
  { key: 'grande',  label: 'Grande'  },
];

const fmtMXN = n => '$' + Number(n).toLocaleString('es-MX') + ' MXN';

// Escapa HTML para prevenir XSS al insertar datos de productos
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error();
    arrangements = await res.json();
  } catch {
    arrangements = [];
    console.error('No se pudieron cargar los productos. ¿Está corriendo el servidor (node server.js)?');
  }
}

const services = [
  { icon: 'flower2',  title: 'Bride',               desc: 'El ramo de la novia: una pieza única compuesta a mano con flor de temporada, diseñada para acompañarte al altar y permanecer en la memoria.', cta: 'Agendar consulta' },
  { icon: 'calendar', title: 'Eventos privados',    desc: 'Composiciones para cenas corporativas, inauguraciones, cumpleaños y lanzamientos.',                    cta: 'Hablemos de tu evento' },
  { icon: 'repeat',   title: 'Suscripción semanal', desc: 'Un arreglo nuevo cada semana, entregado en casa u oficina. Ideal para espacios de marca.',             cta: 'Pedir información' },
  { icon: 'gift',     title: 'Regalos curados',     desc: 'Flores, velas y esencias reunidas en una sola caja: un regalo que se siente y deja eco. Entrega el mismo día dentro de ZMG.', cta: 'Cotizar a la medida' },
];

const testimonials = [
  { name: 'Mariana Gómez',    role: 'Cliente recurrente',    quote: 'Excelente florería. Los arreglos son espectaculares: flores fresquísimas, combinaciones de colores muy bien pensadas y un diseño moderno y elegante que se nota hecho con muchísimo cuidado. Cada arreglo se siente único y de altísima calidad.' },
  { name: 'Juan Carlos',      role: 'Arreglo personalizado', quote: 'Excelente atención, se ve que dominan su negocio al 100%. Me asesoraron en un arreglo floral y estuvo muy bien; además las flores duraron bastantes días, lo que deja ver que usan flor fresca. Súper recomendado, calidad-precio inmejorable.' },
  { name: 'Ana Lorely Treviño', role: 'Envío fuera del estado', quote: 'Hice un pedido a ciegas porque vivo en otro estado. No solo tienen una excelente atención al cliente, también hacen cosas maravillosas. Me daban actualizaciones de mi pedido y este fue el resultado. Son mi florería de confianza en Guadalajara ❤️' },
];

/* ── Render Collection ─────────────────────────────────────── */
function renderCollection() {
  const grid = document.getElementById('collection-grid');
  if (!grid) return;
  grid.innerHTML = arrangements.map((a, i) => `
    <div class="reveal" style="transition-delay:${(i % 3) * 80}ms">
      <article class="card-article ${a.enabled ? '' : 'sold-out'}" data-id="${esc(a.id)}">
        <div class="card-img-wrap">
          <img src="${esc(a.img)}" alt="Arreglo floral ${esc(a.name)}" loading="lazy">
          <span class="card-tagline">${esc(a.tagline)}</span>
          ${a.enabled ? '' : '<span class="sold-out-badge">Sold out</span>'}
        </div>
        <div class="card-meta">
          <h3 class="card-name">${esc(a.name)}</h3>
          <span class="card-price" data-price>${fmtMXN(a.prices.mediano)}</span>
        </div>
        <p class="card-desc">${esc(a.desc)}</p>
        <div class="card-sizes" role="group" aria-label="Tamaño del arreglo">
          ${SIZES.map(s => `
            <button type="button" class="size-btn ${s.key === 'mediano' ? 'active' : ''}" data-size="${s.key}" ${a.enabled ? '' : 'disabled'}>${s.label}</button>
          `).join('')}
        </div>
        <div class="card-footer">
          ${a.enabled
            ? `<button class="card-reserve-btn add-to-cart" data-id="${esc(a.id)}" type="button">Agregar al carrito →</button>`
            : `<span class="card-reserve-btn sold-out-label">Agotado por ahora</span>`}
          <span class="card-made">Hecho a mano</span>
        </div>
      </article>
    </div>
  `).join('');
}

/* ── Render Services ───────────────────────────────────────── */
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = services.map((s, i) => `
    <div class="reveal" style="transition-delay:${i * 60}ms">
      <article class="service-card">
        <div>
          <div class="service-icon">${SVG[s.icon]}</div>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>
        <a href="#contacto" class="service-cta">
          <span>${s.cta}</span>
          <span aria-hidden="true">→</span>
        </a>
      </article>
    </div>
  `).join('');
}

/* ── Render Testimonials ───────────────────────────────────── */
function renderTestimonials() {
  const grid = document.getElementById('testi-grid');
  if (!grid) return;
  const stars = Array.from({length: 5}).map(() => SVG.star).join('');
  grid.innerHTML = testimonials.map((t, i) => `
    <div class="reveal" style="transition-delay:${i * 80}ms">
      <figure class="testi-card">
        <div class="stars" aria-label="5 estrellas">${stars}</div>
        <blockquote class="testi-quote">"${t.quote}"</blockquote>
        <figcaption class="testi-author">
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </figcaption>
      </figure>
    </div>
  `).join('');
}

/* ── Navbar ────────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobile-drawer');
  const hamIcon = document.getElementById('ham-icon');

  // Scroll behavior
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile drawer
  let drawerOpen = false;
  hamburger.addEventListener('click', () => {
    drawerOpen = !drawerOpen;
    drawer.classList.toggle('open', drawerOpen);
    hamIcon.innerHTML = drawerOpen ? SVG.x : SVG.menu;
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', drawerOpen);
  });

  // Close drawer on nav link click
  drawer.querySelectorAll('a, button.drawer-reserve').forEach(el => {
    el.addEventListener('click', () => {
      drawerOpen = false;
      drawer.classList.remove('open');
      hamIcon.innerHTML = SVG.menu;
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Modal ─────────────────────────────────────────────────── */
function initModal() {
  const modal     = document.getElementById('modal');
  const titleEl   = document.getElementById('modal-title');
  const backdrop  = document.getElementById('modal-backdrop');
  const closeBtn  = document.getElementById('modal-close');

  function openModal(productName) {
    titleEl.textContent = productName ? `Reservar: ${productName}` : 'Hablemos en privado';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // All triggers
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.product || ''));
  });
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Contact Form ──────────────────────────────────────────── */
function initForm() {
  const form       = document.getElementById('contact-form');
  const success    = document.getElementById('form-success');
  const successMsg = document.getElementById('success-name');
  const successEmail = document.getElementById('success-email');
  const resetBtn   = document.getElementById('form-reset');

  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('show', Boolean(msg));
    el.previousElementSibling.setAttribute('aria-invalid', Boolean(msg));
  }

  function validate(name, email, message) {
    const errors = {};
    if (name.trim().length < 2)  errors.name = 'Indícanos tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Necesitamos un correo válido.';
    if (message.trim().length < 10) errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
    return errors;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#form-name').value;
    const email   = form.querySelector('#form-email').value;
    const message = form.querySelector('#form-message').value;

    const errors = validate(name, email, message);
    showError('error-name',    errors.name    || '');
    showError('error-email',   errors.email   || '');
    showError('error-message', errors.message || '');

    if (Object.keys(errors).length === 0) {
      form.style.display = 'none';
      success.classList.add('show');
      successMsg.textContent   = name.split(' ')[0];
      successEmail.textContent = email;
    }
  });

  resetBtn && resetBtn.addEventListener('click', () => {
    form.reset();
    form.style.display = '';
    success.classList.remove('show');
    ['error-name','error-email','error-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('show'); }
    });
  });
}

/* ── Carrito ───────────────────────────────────────────────── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('bn_cart') || '[]'); } catch { cart = []; }

function saveCart() { localStorage.setItem('bn_cart', JSON.stringify(cart)); }

function cartTotal() {
  return cart.reduce((sum, item) => {
    const p = arrangements.find(a => a.id === item.id);
    return p ? sum + p.prices[item.size] * item.qty : sum;
  }, 0);
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (!itemsEl) return;

  // Quita del carrito productos que ya no existen o fueron deshabilitados
  cart = cart.filter(item => arrangements.some(a => a.id === item.id && a.enabled));

  const count = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = count;
  countEl.hidden = count === 0;
  totalEl.textContent = fmtMXN(cartTotal());

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío.<br>Explora la colección de la semana.</p>`;
    return;
  }

  const sizeLabel = k => (SIZES.find(s => s.key === k) || {}).label || k;
  itemsEl.innerHTML = cart.map((item, idx) => {
    const p = arrangements.find(a => a.id === item.id);
    return `
      <div class="cart-item">
        <img src="${esc(p.img)}" alt="">
        <div class="cart-item-info">
          <div class="cart-item-name">${esc(p.name)}</div>
          <div class="cart-item-size">${sizeLabel(item.size)} · ${fmtMXN(p.prices[item.size])}</div>
          <div class="cart-qty">
            <button type="button" data-cart-dec="${idx}" aria-label="Quitar uno">−</button>
            <span>${item.qty}</span>
            <button type="button" data-cart-inc="${idx}" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <button class="cart-item-remove" type="button" data-cart-remove="${idx}" aria-label="Eliminar del carrito">${SVG.xSmall}</button>
      </div>`;
  }).join('');
}

function addToCart(id, size) {
  const existing = cart.find(i => i.id === id && i.size === size);
  if (existing) existing.qty++;
  else cart.push({ id, size, qty: 1 });
  saveCart();
  renderCart();
  openCart();
}

function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

async function checkout() {
  const errEl = document.getElementById('cart-error');
  const btn = document.getElementById('cart-checkout');
  errEl.textContent = '';
  if (cart.length === 0) { errEl.textContent = 'Tu carrito está vacío.'; return; }
  btn.disabled = true;
  btn.textContent = 'Preparando pago…';
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No se pudo iniciar el pago.');
    window.location.href = data.init_point;
  } catch (e) {
    errEl.textContent = e.message;
    btn.disabled = false;
    btn.textContent = 'Pagar con Mercado Pago';
  }
}

function initCart() {
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('cart-checkout').addEventListener('click', checkout);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  // Delegación: tamaños, agregar al carrito y controles del carrito
  document.body.addEventListener('click', e => {
    const sizeBtn = e.target.closest('.size-btn');
    if (sizeBtn) {
      const card = sizeBtn.closest('.card-article');
      card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      sizeBtn.classList.add('active');
      const p = arrangements.find(a => a.id === card.dataset.id);
      if (p) card.querySelector('[data-price]').textContent = fmtMXN(p.prices[sizeBtn.dataset.size]);
      return;
    }

    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const card = addBtn.closest('.card-article');
      const size = card.querySelector('.size-btn.active').dataset.size;
      addToCart(addBtn.dataset.id, size);
      return;
    }

    const dec = e.target.closest('[data-cart-dec]');
    const inc = e.target.closest('[data-cart-inc]');
    const rem = e.target.closest('[data-cart-remove]');
    if (dec || inc || rem) {
      const idx = Number((dec || inc || rem).dataset.cartDec ?? (dec || inc || rem).dataset.cartInc ?? (dec || inc || rem).dataset.cartRemove);
      if (rem) cart.splice(idx, 1);
      else if (inc) cart[idx].qty++;
      else if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
      saveCart();
      renderCart();
    }
  });

  // Mensaje al volver de Mercado Pago
  const pago = new URLSearchParams(window.location.search).get('pago');
  if (pago === 'exito') {
    cart = [];
    saveCart();
    renderCart();
    alert('¡Gracias por tu compra! Recibimos tu pago y te contactaremos para coordinar la entrega.');
  } else if (pago === 'error') {
    alert('El pago no se completó. Tu carrito sigue guardado, puedes intentarlo de nuevo.');
  }
}

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  renderCollection();
  renderServices();
  renderTestimonials();
  initNavbar();
  initReveal();
  initModal();
  initForm();
  initCart();
  renderCart();

  // Hamburger initial icon
  const hamIcon = document.getElementById('ham-icon');
  if (hamIcon) hamIcon.innerHTML = SVG.menu;

  // Open-modal buttons injected by JS need re-binding via delegation
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.open-modal');
    if (!btn) return;
    const modal = document.getElementById('modal');
    const titleEl = document.getElementById('modal-title');
    if (modal && titleEl) {
      titleEl.textContent = btn.dataset.product
        ? `Reservar: ${btn.dataset.product}`
        : 'Hablemos en privado';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});
