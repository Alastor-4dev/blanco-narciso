# Blanco Narciso · versión Node/Express

Copia de la versión local con tienda, administración y prototipo de fidelidad. No reemplaza la web Next.js ubicada en la raíz de este repositorio.

## Iniciar

Requiere Node 22 o superior recomendado.

```sh
cd estudio-node
npm ci
export ADMIN_PASSWORD="$(openssl rand -hex 24)"
npm start
```

- Tienda: http://localhost:3000/
- Muestra de registro y tarjeta: http://localhost:3000/fidelidad
- Administración: http://localhost:3000/admin.html

Las variables están documentadas en `.env.example`; el servidor lee variables del proceso. No carga `.env` automáticamente. Define una contraseña privada propia en tu hosting. No hay contraseña predeterminada en esta copia publicada.

## Estado funcional

El catálogo requiere `/api/products`, servido por Express. El checkout requiere credenciales de Mercado Pago. La fidelidad solo es una muestra en memoria: no registra miembros, no emite pases ni sincroniza Wallet. El formulario de contacto tampoco envía mensajes. Publicar el código no activa estas integraciones.

## Hosting

GitHub almacena el código. GitHub Pages solo publica la versión estática Next.js de la raíz; no ejecuta esta aplicación. No sirve como alojamiento del backend o de una tienda transaccional. Usa un proveedor de Node para esta carpeta. No se contrató ni activó hosting adicional.

Se incluye `render.yaml` en la raíz como configuración inicial opcional. Usa almacenamiento persistente antes de operar el administrador con datos reales: `data/products.json` es local al disco y puede perderse en un hosting efímero. Para producción, migrar compras y clientes a una base de datos, completar controles de acceso, privacidad y copias de seguridad y probar emisión y actualización en dispositivos físicos.

## Logo público para Google Wallet

https://alastor-4dev.github.io/blanco-narciso/img/logo-navy.png

Coincide con el archivo local `img/logo-navy.png` y se comprobó accesible por HTTPS.


## Piloto local de Google Wallet

La conexión por cuenta de servicio ya permite emitir y actualizar una tarjeta técnica independiente. Ejecuta `npm run wallet:prepare` con tus credenciales privadas configuradas para preparar el piloto; `npm run wallet:pilot` abre un servidor exclusivo en `http://localhost:3101/wallet-pilot`. Solo escucha en loopback y sus rutas están deshabilitadas por defecto. Los datos de prueba y la configuración viven fuera del repositorio. El QR es de una tarjeta ficticia única, no un enlace de alta pública. Nunca configurar este piloto como panel de producción.

Validación automática sin credenciales: `npm run test:wallet`. El registro de clientes, el panel de empleados de producción y Apple Wallet siguen pendientes. Ver `FIDELIDAD.md` para detalles de validación y límites.
