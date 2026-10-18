# Fotos de los arreglos

En el panel `/admin.html`, abre **Editar → Foto del arreglo**.

- **Buscar en mis archivos** abre el selector habitual del navegador. Puedes recorrer las carpetas de tu computadora y elegir una foto JPG, PNG o WebP de hasta 8 MB.
- **Imágenes guardadas** muestra las fotos existentes en la carpeta `img/` del proyecto. Permite buscar por nombre y seleccionar una sin volver a subirla.
- La vista previa muestra la foto elegida. Pulsa **Guardar** para asignarla al arreglo. Cambiar la selección o cancelar no modifica el producto.
- La ruta manual sigue disponible en **Ver o escribir la ruta de la imagen**.

El navegador decide la carpeta inicial de su selector de archivos; no permite que una web fuerce una ruta privada del equipo. La galería del panel permite llegar directamente a las fotos del proyecto.

## Almacenamiento y validación

Las nuevas fotos se guardan con un nombre único en `img/`, convertidas a WebP, orientadas según la foto y con un máximo de 2,400 píxeles por lado. No se conserva EXIF/GPS. Las fotos anteriores no se sobrescriben ni se eliminan. Una foto subida y después cancelada permanece disponible en la galería.

El servidor exige una sesión válida antes de recibir el archivo, limita la carga a una foto de 8 MB y valida el contenido decodificando la imagen. Rechaza formatos ajenos a fotos, archivos corruptos y más de 40 megapíxeles. Las rutas de destino las genera el servidor. La galería solo enumera archivos de imágenes del proyecto, sin recorrer otras carpetas ni enlaces simbólicos.

Se usan Multer 2.4.0 y Sharp 0.35.5. El servidor requiere Node.js 20.9 o posterior. Las sesiones y el acceso del panel conservan el mecanismo existente; esta mejora no constituye una auditoría completa ni habilita administración en GitHub Pages.

En un hosting Node, `img/` y `data/products.json` deben mantenerse en almacenamiento persistente y con respaldo. Los cambios locales no publican por sí solos el catálogo en GitHub Pages.

## Verificación

- `npm run test:images`: autorización, imágenes falsas, tamaño, metadatos, nombres seguros y límites de la galería.
- Verificación visual realizada en escritorio y móvil: selector nativo, galería, vista previa, guardado y recarga sobre un catálogo temporal, sin modificar los productos reales.
