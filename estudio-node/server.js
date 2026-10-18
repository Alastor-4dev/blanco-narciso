/* ============================================================
   BLANCO NARCISO · Servidor
   API de productos + panel admin + checkout Mercado Pago
   ============================================================ */
'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// ── Configuración ──────────────────────────────────────────
// En producción SIEMPRE configura ADMIN_PASSWORD y MP_ACCESS_TOKEN
// como variables de entorno en el panel de tu hosting.
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || Boolean(process.env.PORT);
if (!process.env.ADMIN_PASSWORD) {
  console.error('ERROR: en producción debes configurar la variable de entorno ADMIN_PASSWORD. El servidor no arrancará sin ella.');
  process.exit(1);
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || ''; // Token de Mercado Pago
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.set('trust proxy', 1); // necesario en hosting con proxy para ver la IP real (rate limit)
app.use(express.json());

// Headers de seguridad básicos (antes de cualquier ruta)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Servir SOLO los archivos públicos (nunca el código del servidor, data/ ni respaldos)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get(['/fidelidad', '/fidelidad.html'], (req, res) => res.sendFile(path.join(__dirname, 'fidelidad.html')));

// Piloto Wallet: rutas locales desactivadas por defecto.
require('./lib/wallet-pilot-routes')(app);

// ── Productos: lectura/escritura ───────────────────────────
function readProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// ── Auth admin ─────────────────────────────────────────────
// Sesiones con expiración (8 horas)
const SESSION_TTL = 8 * 60 * 60 * 1000;
const sessions = new Map(); // token → expiración

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const expires = sessions.get(token);
  if (!expires || expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

// Límite de intentos de login: 5 cada 15 minutos por IP (contra fuerza bruta)
const LOGIN_WINDOW = 15 * 60 * 1000;
const loginAttempts = new Map(); // ip → { count, resetAt }

function rateLimitLogin(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress;
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= 5) {
    return res.status(429).json({ error: 'Demasiados intentos. Espera 15 minutos.' });
  }
  if (!entry || entry.resetAt <= now) loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW });
  else entry.count++;
  next();
}

// Comparación en tiempo constante (contra timing attacks)
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

app.post('/api/admin/login', rateLimitLogin, (req, res) => {
  if (!safeEqual(req.body.password || '', ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  loginAttempts.delete(req.ip || req.socket.remoteAddress);
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL);
  res.json({ token });
});

// ── API pública ────────────────────────────────────────────
// Devuelve todos: los deshabilitados se muestran como "Sold out" en la tienda
app.get('/api/products', (req, res) => {
  res.json(readProducts());
});

// ── API admin ──────────────────────────────────────────────
app.get('/api/admin/products', requireAuth, (req, res) => {
  res.json(readProducts());
});

require('./lib/product-images')(app,{requireAuth,imageDirectory:path.join(__dirname,'img')});

// Solo se aceptan imágenes locales de la carpeta img/
function validImg(img) {
  return typeof img === 'string' && /^img\/[\w. -]+\.(png|jpe?g|webp|gif)$/i.test(img);
}

app.post('/api/admin/products', requireAuth, (req, res) => {
  const { name, tagline, desc, img, prices } = req.body;
  if (!name || !prices) return res.status(400).json({ error: 'Faltan nombre o precios' });
  if (img && !validImg(img)) return res.status(400).json({ error: 'La imagen debe ser una ruta local, ej. img/ramo01.png' });
  const products = readProducts();
  const id = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  const product = {
    id,
    name,
    tagline: tagline || '',
    desc: desc || '',
    img: img || 'img/principal.png',
    enabled: true,
    prices: {
      chico: Number(prices.chico) || 0,
      mediano: Number(prices.mediano) || 0,
      grande: Number(prices.grande) || 0
    }
  };
  products.push(product);
  writeProducts(products);
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const products = readProducts();
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  const { name, tagline, desc, img, enabled, prices } = req.body;
  if (img !== undefined && !validImg(img)) return res.status(400).json({ error: 'La imagen debe ser una ruta local, ej. img/ramo01.png' });
  if (name !== undefined) p.name = name;
  if (tagline !== undefined) p.tagline = tagline;
  if (desc !== undefined) p.desc = desc;
  if (img !== undefined) p.img = img;
  if (enabled !== undefined) p.enabled = Boolean(enabled);
  if (prices !== undefined) {
    p.prices = {
      chico: Number(prices.chico) || 0,
      mediano: Number(prices.mediano) || 0,
      grande: Number(prices.grande) || 0
    };
  }
  writeProducts(products);
  res.json(p);
});

app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  const products = readProducts();
  const idx = products.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  products.splice(idx, 1);
  writeProducts(products);
  res.json({ ok: true });
});

// ── Checkout con Mercado Pago ──────────────────────────────
// El cliente manda [{id, size, qty}]; los precios se validan en el servidor.
app.post('/api/checkout', async (req, res) => {
  try {
    const cart = req.body.items;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }
    if (!MP_ACCESS_TOKEN) {
      return res.status(503).json({
        error: 'Pagos no configurados aún. Falta el MP_ACCESS_TOKEN de Mercado Pago.'
      });
    }

    const products = readProducts();
    const items = cart.map(item => {
      const p = products.find(x => x.id === item.id && x.enabled);
      const size = ['chico', 'mediano', 'grande'].includes(item.size) ? item.size : null;
      if (!p || !size) throw new Error('Producto o tamaño inválido');
      return {
        title: `${p.name} (${size})`,
        quantity: Math.max(1, Math.min(20, Number(item.qty) || 1)),
        unit_price: p.prices[size],
        currency_id: 'MXN'
      };
    });

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        back_urls: {
          success: `${BASE_URL}/?pago=exito`,
          failure: `${BASE_URL}/?pago=error`,
          pending: `${BASE_URL}/?pago=pendiente`
        },
        auto_return: 'approved',
        statement_descriptor: 'BLANCO NARCISO'
      })
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      console.error('Mercado Pago error:', data);
      return res.status(502).json({ error: 'Error al crear el pago en Mercado Pago' });
    }
    res.json({ init_point: data.init_point });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, process.env.WALLET_PILOT_ENABLED === '1' ? '127.0.0.1' : undefined, () => {
  console.log(`Blanco Narciso corriendo en http://localhost:${PORT}`);
  console.log(`Panel admin: http://localhost:${PORT}/admin.html`);
  if (!MP_ACCESS_TOKEN) console.log('⚠ MP_ACCESS_TOKEN no configurado: el checkout devolverá error hasta que lo agregues.');
});
