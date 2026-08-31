# Instagram Followers/Following Exporter

Script para ejecutar en la consola del navegador que extrae la lista completa de seguidores o seguidos de tu perfil de Instagram.

## ¿Qué hace?

Cuando lo pegás en la consola estando en tu propio perfil de Instagram, el script recorre el modal de seguidores/seguidos, hace scroll automáticamente hasta cargar toda la lista, y te devuelve el listado completo de usuarios (sin los límites que impone la interfaz normal de Instagram al mostrar solo de a poco).

## Requisitos

- Estar logueado en Instagram desde el navegador (Chrome, Firefox, Edge, etc.)
- Estar parado en tu propio perfil

## Cómo usarlo

1. Entrá a tu perfil de Instagram desde el navegador en la computadora (no la app).
2. Abrí el panel de tu perfil (click en la foto de perfil en el menu izquierdo del Home).
3. Abrí la consola del navegador con **F12** (o clic derecho → Inspeccionar → pestaña Console).
4. La primera vez que pegás código, el navegador va a bloquearlo por seguridad. Escribí `allow pasting` en la consola y presioná Enter para habilitarlo.
5. Pegá el script completo (encontrado en `script.js`) y presioná Enter.
6. Esperá — el script va a hacer scroll solo hasta cargar todos los usuarios. Cuanto más grande la lista, más tarda.
7. Al terminar, te va a mostrar la lista completa en la consola (generalmente como una tabla).

## Exportar a Excel

Para pasar la lista de seguidos a una planilla:

1. Seleccioná y copiá la tabla que aparece en la consola al terminar.
2. Pegala directamente en Excel o Google Sheets.
3. Si viene todo en una sola columna, usá **Datos → Texto en columnas** para separar los campos.

## Notas

- Es un script de uso personal: corre en tu propio navegador, sobre tu propia sesión, y no envía datos a ningún servidor externo.
- Instagram puede cambiar la estructura de su página en cualquier momento, lo que podría romper el script hasta que se actualice.
- Usalo bajo tu propio criterio respecto a los Términos de Servicio de Instagram.

## Licencia

Este proyecto se distribuye bajo licencia CC BY-NC 4.0 (Atribución - No Comercial). Ver el archivo `LICENSE` para más detalles.