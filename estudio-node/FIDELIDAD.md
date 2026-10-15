# Blanco Narciso · Fidelidad y Google Wallet


## Estado de la integración Google Wallet

Se comprobó acceso real por API al emisor y a la plantilla original. La clase original `blanco_narciso_fidelidad` se conserva en borrador. Se creó una clase independiente `bn_prueba_tecnica_v1`, aprobada por Google, y una tarjeta ficticia `bn_prueba_local_0001`, con ID visible `BNTEST0001`. No se solicitó publicación general del emisor ni se modificó la plantilla original.

La clave se trasladó fuera del repositorio a la carpeta privada `~/.config/blanco-narciso/`, con directorio 700 y archivo 600. Nunca subir credenciales, configuración privada ni el historial local a GitHub. No se usan credenciales en frontend.

### Usar el piloto local

```sh
node scripts/start-wallet-pilot.js
```

Abrir http://localhost:3101/wallet-pilot. El piloto solo escucha en la interfaz local de esta Mac y sus rutas están desactivadas por defecto en el servidor normal. No es el panel definitivo de empleados ni se debe publicar como tal. Emite un enlace firmado y un QR para guardar una única tarjeta ficticia. Usar en Android con la cuenta administradora del emisor o una cuenta de prueba autorizada en Wallet Console. El usuario confirma que quiere guardar el pase. El mismo QR de prueba no sirve como alta pública de varios clientes: todos sus usos apuntan a la misma tarjeta de prueba.

El formulario de compras ficticias guarda el importe y referencia de ticket en un registro privado local y actualiza el objeto remoto de Google. Rechaza tickets duplicados y conserva el registro para reintentar si falla la sincronización. El piloto limita el saldo a 2,500 puntos; falta decidir reglas para excedentes y canjes de producción. El panel muestra el resultado de enviar el saldo, no una confirmación de que el teléfono ya lo haya recibido.

### Validación realizada

- Autenticación con cuenta de servicio y lectura de la clase real.
- Creación del pase técnico y QR/enlace firmado.
- Compra ficticia de $500: la API de Google confirmó 500 puntos y un sello; el ticket duplicado fue rechazado.
- Saldo de prueba restaurado a cero antes de entregar el panel.
- Pruebas de firma, caché de token, cálculos, tickets duplicados, operaciones simultáneas y conservación del movimiento cuando falla la red.
- Bloqueo de solicitudes sin origen/cabecera local y de Host ajeno; panel comprobado en escritorio y móvil.
- Sin validación todavía en Android físico, sin integración de Apple Wallet ni registro real de clientes.

El sitio público en GitHub Pages sigue siendo una muestra estática. La tarjeta del formulario público no está enlazada al piloto ni crea miembros; hace falta backend HTTPS, persistencia de clientes, autenticación del personal y revisión de privacidad antes de operar con datos reales.


## Qué se identificó en las capturas

Es un pase de fidelidad de Google Wallet: aparece dentro de la billetera, contiene ID de miembro, un código de barras, sellos, recompensas y mensajes. La cuenta de muestra de Garbanzo tiene 2 sellos y necesita 8 más para alcanzar su premio de 10 sellos. Sus reglas indican un sello por compra y media libra gratis al reunir 10.

Las capturas no identifican la empresa que administra el programa, ni demuestran cómo acredita el comercio cada compra. No es posible atribuirlo a un proveedor concreto sin el enlace del QR o información del comercio. El código de barras de la tarjeta identifica a un miembro; es distinto del QR público que permite darse de alta.

## Qué se entregó aquí

Página independiente `/fidelidad`, con verde salvia `#6f917e` del sitio, logo de Blanco Narciso en cinco sellos y encabezado, límite visual de 2,500 puntos, código de barras Code 39 con ID de muestra y logo separado de las barras. Incluye nombre, puntos, sellos, ID, recompensas y resumen de compras pendiente de conexión. La página principal quedó sin los enlaces de fidelidad añadidos en la primera propuesta; se conservaron las modificaciones del usuario que ya existían.

Se retiraron la portada editorial, simulador y preguntas frecuentes. Solo se conserva la tarjeta, sus datos esenciales, estado de descarga y términos y condiciones. Es una vista previa con datos de muestra; no se guardan clientes ni compras. Los botones Wallet están deshabilitados porque faltan cuentas y credenciales de emisión. No se genera un QR de descarga hasta que exista un enlace público que emita pases reales. El código de barras identifica un miembro de muestra y no descarga un pase ni acredita compras.

Para verlo:

```sh
cd "RUTA_LOCAL/Blanco-Narciso"
npm start
```

Abre `http://localhost:3000/fidelidad`. Si el servidor ya estaba abierto antes de este cambio, reinícialo para cargar la ruta nueva. El servidor de revisión de esta sesión usa `http://localhost:3100/fidelidad`.

## Reglas solicitadas

Cinco sellos y límite de 2,500 puntos. Al completar los cinco sellos, canje por un arreglo mediano o un arreglo equivalente al precio del mediano vigente el día del canje. Tarjeta y premio personales e intransferibles; no acumulables con otras promociones, descuentos o cupones; sin canje por efectivo. El canje debe quedar registrado y consumir los cinco sellos utilizados. Disponibilidad de flores sujeta a existencias; pedidos cancelados o reembolsados no acreditan beneficios.

Relación confirmada por el usuario: $1 MXN comprado = 1 punto; cada 500 puntos completa un sello; 2,500 puntos completa cinco sellos y habilita el premio. La tarjeta muestra esa equivalencia. Los $1,000 MXN, 1,000 puntos y dos sellos son datos de muestra, no saldo real. Falta definir vigencia, diferencias de precio y tratamiento del excedente de compras que superen la meta de 2,500 puntos. Ya existe una cuenta de emisor Google y una cuenta de servicio autorizada. Se configuró emisión y actualización de una tarjeta técnica de prueba; el registro público y Apple Wallet continúan pendientes.

## Cómo funcionaría para el cliente y el equipo

1. Un QR impreso en mostrador/empaque abre `https://DOMINIO-CONFIRMADO/fidelidad`.
2. El cliente acepta las reglas y el aviso de privacidad; se registra con los datos mínimos necesarios. El sistema genera un ID único y su tarjeta individual.
3. Pulsa el botón oficial de Google Wallet o Apple Wallet y guarda el pase.
4. Al pagar, muestra el código de su tarjeta. El personal lo escanea con un teléfono autorizado o un lector compatible, o busca el ID.
5. En un panel privado, el personal vincula el pedido pagado y acredita un sello. El servidor guarda el movimiento y actualiza el pase.
6. Con cinco sellos, la cuenta queda lista para el canje. El canje debe validarse una sola vez, descontar los sellos utilizados y quedar registrado en el panel.

Escanear un código no confirma que se haya pagado. El QR público tampoco puede conceder sellos. El historial de compras y recompensas debe vivir en el servidor, no en el teléfono del cliente. No usar el número de miembro como contraseña: cualquiera que vea el pase podría copiarlo.

Para compras en línea, vincular miembro y pedido y acreditar únicamente cuando el servidor comprueba el pago aprobado con Mercado Pago. El parámetro `?pago=exito` de una página de retorno no es evidencia de pago. Esa integración no está implementada en el proyecto actual ni se añadió en esta propuesta.

## ¿Se necesita servidor? ¿Se aloja en otra web?

Se necesita un servicio en línea que emita y actualice las tarjetas, pero no necesariamente contratar un servidor exclusivo. El sitio ya usa Node/Express: un desarrollo propio podría añadir ahí el servicio y una base de datos. No debe depender de que esta Mac permanezca encendida.

| Alternativa | Dónde se administra | Qué pagas | Cuándo conviene |
| --- | --- | --- | --- |
| Plataforma de fidelidad | Panel del proveedor; el QR abre su registro o una página enlazada desde tu dominio | Plan, límites de clientes/tarjetas y posibles extras | Piloto con poco trabajo técnico y operación manual en mostrador |
| Desarrollo propio | Web de Blanco Narciso + backend + base de datos + APIs de Wallet | Hosting, dominio, base de datos, desarrollo, mantenimiento y credenciales necesarias | Control del historial e integración directa con tienda/pagos |

Recomendación para empezar: validar premio y operación con un piloto en una plataforma administrada, conservando esta página como entrada de marca. Elegir el proveedor después de comprobar soporte Apple/Google, panel para empleados, canje, exportación de clientes e historial, permisos y costos al crecer. Si se busca integración estrecha con pedidos y Mercado Pago, desarrollar el backend propio sobre este proyecto.

La página de marca puede estar en el mismo dominio. El botón de Google termina en un enlace firmado de Google; Apple recibe un archivo de pase firmado. Esto no implica que toda tu web tenga que alojarse fuera. En un proveedor administrado, parte del servicio sí depende de su infraestructura.

No se contrató ningún proveedor ni se verificaron precios de planes comerciales. No hace falta pagar un servidor adicional si el hosting actual soporta el backend y almacenamiento requerido; debe verificarse con el plan real. Un hosting con disco efímero requiere almacenamiento persistente o base de datos externa. El JSON de productos actual no constituye una base de clientes preparada para concurrencia, historial y recuperación.

## Requisitos para emisión propia

**Google Wallet:** cuenta de emisor en Google Pay & Wallet Console, proyecto Google Cloud/API habilitada, cuenta de servicio autorizada y claves protegidas en el servidor. Definir una clase del programa y un objeto por miembro. El botón usa un JWT firmado. Las cuentas nuevas comienzan en modo demo; solicitar acceso de publicación para emitir al público. Actualizar los objetos por API cuando cambien sellos o recompensas. No se necesita desarrollar una app Android.

**Apple Wallet:** cuenta del Apple Developer Program, Pass Type ID y certificado de firma; crear un `.pkpass` individual. Para actualizarlo tras compras, implementar el servicio de registro/actualizaciones y notificaciones correspondiente, protegiendo certificados y tokens en el servidor. La membresía estándar publicada por Apple es de **99 USD por año**, o moneda local donde esté disponible; verificar el cobro aplicable al inscribirse. Una plataforma externa puede gestionar firma y emisión bajo su servicio: confirmar condiciones con ella.

**Operación y datos:** dominio HTTPS, base de datos persistente, altas y recuperación de cuenta, reglas versionadas, panel autenticado con permisos por empleado, registro de compras/canjes/reversiones, prevención de pedidos duplicados, copias de seguridad y sincronización con Wallet con reintentos. El cliente solo consulta: nunca autoriza sus propios sellos. Definir un aviso de privacidad, datos mínimos y proceso de atención/borrado antes de recopilar información real.

Para mostrador basta un teléfono/tableta/computadora con internet y acceso al panel; un escáner dedicado es opcional. No exige terminal NFC. La autorización de empleados y lectura de cámara requieren implementación adicional. No prometer anuncios ilimitados: los mensajes/notificaciones están sujetos a los mecanismos y límites de cada Wallet.

## Secuencia para activar

1. Confirmar premio, mínimo, vigencia, exclusiones y política de canje.
2. Confirmar dominio/hosting y elegir proveedor o emisión propia.
3. Configurar las cuentas de emisión y credenciales, sin publicarlas en frontend ni Git.
4. Implementar registro, base de datos y panel de compras/canjes con historial.
5. Emitir pases de prueba y comprobar actualización en un Android y un iPhone físicos; probar reinicios, compras duplicadas y canje simultáneo.
6. Publicar reglas/aviso, activar emisión pública y generar el QR permanente.
7. Capacitar al equipo y comenzar con un grupo reducido de clientes.

## Fuentes oficiales consultadas

- Google: https://developers.google.com/wallet/retail/loyalty-cards/getting-started/issuer-onboarding
- Emisión web Google: https://developers.google.com/wallet/retail/loyalty-cards/web
- Apple, certificados de pases: https://developer.apple.com/wallet/get-started/
- Apple, actualizaciones: https://developer.apple.com/documentation/WalletPasses/adding-a-web-service-to-update-passes
- Apple Developer Program y costo: https://developer.apple.com/programs/

## Revisión visual y pruebas en otros teléfonos

El usuario confirmó que pudo guardar la tarjeta en Google Wallet con su cuenta administradora. Otras cuentas recibieron restricciones de autorización. El emisor requiere cuentas de prueba en modo demo y acceso de publicación aprobado para uso público. Además, cada pase es personal (`ONE_USER_ALL_DEVICES`): no reutilizar la tarjeta ya guardada por una persona para otro usuario.

El piloto ahora muestra la identidad del sitio: verde salvia con trama, marco blanco, Avoda, Brittany Signature y Cormorant, y cinco sellos con el logo original. La tarjeta visual se alimenta del saldo del registro local. Google Wallet usa tipografía y distribución nativas para sus campos; las imágenes de marca conservan la tipografía y los sellos del estudio. Se prepararon un logo de 660 px, un logotipo horizontal transparente y seis imágenes de sellos, de cero a cinco, para alojar públicamente.

El QR incorpora el narciso en el centro con corrección de errores Q, zona de silencio y botón para ampliarlo. Conserva estructura QR estándar para que se pueda leer: no se recorta la matriz con la silueta completa de la flor. El QR de cada tarjeta sigue siendo un enlace de guardado individual, no el formulario público de registro.

El selector permite crear otra tarjeta de prueba con alias ficticio. Cada tarjeta tiene su propio identificador, código de barras, registro y saldo. Los nuevos correos deben agregarse a las cuentas de prueba desde Wallet Console antes de usarlos; no es necesario otorgarles administración del negocio. La cuenta debe completar su perfil empresarial y solicitar el acceso de publicación antes del lanzamiento. La aprobación de una clase no equivale a aprobación pública del emisor.

Validación visual de esta revisión: se decodificaron los QR con narciso en escritorio y en pantallas de 768 y 390 px a escala 2x; en 320 px se usa el diálogo ampliado. Se verificaron los estados gráficos de los sellos, los saldos e identificadores por tarjeta y las pestañas de guardado/compra. La tipografía del logotipo se rasteriza a PNG desde las mismas fuentes del sitio; el servidor de pruebas no publica claves ni historial en Pages. Se actualizaron por API el diseño de la clase técnica y la imagen de sellos de la tarjeta ya guardada, conservando el saldo. Se crearon dos ejemplos ficticios de 1,500 y 2,500 puntos para comparar los diseños de tres y cinco sellos.
