# Auditoría del design kit de NEXO

Esta auditoría revisa los estilos de `disenos/prototipo.html`, el único HTML de `disenos/`. No cambia ningún archivo: solo describe lo que hay y propone qué unificar.

## Qué se revisó y cómo leer las tablas

- **Dónde están los estilos:** un solo bloque `<style>` (17.548 caracteres) y 87 estilos en línea dentro del JavaScript. No hay CSS enlazado.
- **Cómo se contó:** los conteos son de usos en las reglas CSS. "0 usos" significa que está definido pero ninguna regla ni pantalla lo usa.
- **Tipo:** *accidental* son valores casi iguales que nadie decidió. *Intencional* son versiones distintas a propósito.
- **Numeración:** los números de fila siguen de corrido en todas las tablas, para responder por número.
- **Nombres propuestos:** son sugerencias en español para los tokens. Se pueden cambiar.

## 1. Colores

La paleta activa es "Lima y tinta". Los valores de abajo son los de esa paleta.

| n.º | elemento | versiones encontradas | dónde | tipo | propuesta |
|---|---|---|---|---|---|
| 1 | Fondo base | `#F6F2EA` (`--paper`), 6 usos | Fondo de la app, barra inferior, caja del chat, opciones de paleta | Intencional | Conservar como `--color-fondo` |
| 2 | Blanco | `#FFFFFF` (`--sf`), 11 usos; `#fff` escrito a mano, 13 usos | `--sf`: fondo de tarjetas, campos, chips, botones redondos. `#fff`: texto sobre fondo oscuro, borde de avatares | Accidental (mismo valor con dos nombres) | Un solo valor `#FFFFFF` con dos nombres de uso: `--color-superficie` y `--color-texto-inverso` |
| 3 | Tinta (texto principal) | `#14142B` (`--ink`), 42 usos | Texto, botón principal, tarjeta oscura de Inicio, burbuja del usuario, pestaña activa | Intencional | Conservar como `--color-tinta` |
| 4 | Tinta al pasar el mouse | `#2A2A4A` (`--ink-hover`), 1 uso | Hover del botón principal | Intencional | Conservar como `--color-tinta-hover` |
| 5 | Texto secundario | `#5B5B73` (`--ink2`), 12 usos. El mismo valor se repite como `--cat-other` | Textos grises, etiquetas, íconos de apoyo, categoría "Otro" | Intencional | Conservar como `--color-texto-suave`. "Otro" usa ese token |
| 6 | Texto terciario | `#686880` (`--ink3`), 0 usos | En ninguna parte | Accidental (casi igual a la fila 5 y sin uso) | Eliminar |
| 7 | Borde y separadores | `#E4DFD3` (`--line`), 19 usos. Casi igual: `#E6E0D2` (`--outer`, 1 uso, fondo fuera de la app en computador) | Bordes de tarjetas y campos, separadores de listas, fondo de las barras de progreso | Accidental (`--outer` difiere 2 niveles por canal) | Un solo valor `#E4DFD3` como `--color-borde` |
| 8 | Arena (fondo suave) | `#ECE7DB` (`--sand`), 4 usos | Recuadros de íconos, etiqueta "Ejemplo", ilustración del onboarding | Intencional | Conservar como `--color-arena` |
| 9 | Marco de la app en computador | `#d8d1bf` escrito a mano, 1 uso | Línea alrededor de la app en pantallas anchas | Accidental (casi igual al borde y fuera de los tokens) | Usar `--color-borde` |
| 10 | Lima (acento) | `#C9F25C` (`--lime`), 18 usos | Botón secundario, chip activo, racha, avatares, etiquetas, barra del hero, ícono de éxito | Intencional | Conservar como `--color-acento` |
| 11 | Lima al pasar el mouse | `#B8E23F` (`--lime-d`), 1 uso | Hover del botón secundario | Intencional | Conservar como `--color-acento-hover` |
| 12 | Lima suave | `#F1FAD6` (`--lime-50`), 2 usos | Notas de ayuda ("?") y "Acción sugerida" del chat | Intencional | Conservar como `--color-acento-suave` |
| 13 | Azul IA | `#3A4BFF` (`--ai`), 5 usos | Círculo del logo, nombre "NEXO" en mensajes, borde de foco de teclado, subrayado del monto | Intencional | Conservar como `--color-ia` |
| 14 | Azul IA suave | `#E8EBFF` (`--ai-50`), 0 usos | En ninguna parte | Accidental (definido y sin uso) | Eliminar o decidir dónde usarlo |
| 15 | Éxito | `#0B7A55` texto y `#DDF1E8` fondo, 1 uso cada uno | Alerta verde | Intencional | `--color-exito` y `--color-exito-suave` |
| 16 | Advertencia | `#8A5600` texto y `#FBEBCB` fondo, 1 uso cada uno | Alerta amarilla y aviso "Este monto es mayor que lo que recibes" | Intencional | `--color-aviso` y `--color-aviso-suave` |
| 17 | Error | `#C73B3F`, 9 usos; fondo `#FBE3E3`, 3 usos | Campo con error, botón "Eliminar", contador de avisos, grabando voz | Intencional | `--color-error` y `--color-error-suave` |
| 18 | Rojo claro sobre fondo oscuro | `#ff8a8e` escrito a mano, 1 uso | Barra del hero cuando te pasaste del mes | Accidental (fuera de los tokens) | Crear `--color-error-claro` |
| 19 | Blancos translúcidos sobre fondo oscuro | `#ffffffc7` (2 usos), `#ffffff9e` (1), `#ffffff2e` (1), `#ffffff1f` (1). Todos escritos a mano | Texto del hero, pista de la barra del hero, notas de ayuda sobre fondo oscuro o lima | Accidental (cuatro opacidades distintas: 78 %, 62 %, 18 % y 12 %) | Dos valores: `--color-inverso-texto` (`#ffffffc7`) y `--color-inverso-fondo` (`#ffffff2e`) |
| 20 | Colores de categorías | Comida `#C2561C`, Transporte `#1F6FC2`, Salidas `#7A3FC4`, Compras `#C22A66`, Educación `#12795F`, Otro `#5B5B73`. 1 uso cada uno | Recuadros de íconos en Gastos, Inicio y Gasto registrado (fondo al 14 % del color) | Intencional (revisar: Educación se parece al verde de éxito y Compras al rojo de error) | Conservar como `--color-cat-comida`, etc. |
| 21 | Alias sin uso | `--bg`, `--pri`, `--pri-d`, `--pri-50`, `--pri-100`, `--sec`, `--sec-50`, `--in`, `--in-50`. 0 usos | En ninguna parte | Accidental (nombres duplicados que nadie usa) | Eliminar |
| 22 | Paletas alternativas | "Lima y tinta" (activa), "Coral y ciruela", "Mar y menta" y "Sol y noche". Cada una redefine 11 colores. Los hex de las muestras se repiten escritos a mano en el JavaScript | Selector de colores en Perfil | Intencional (pendiente de decidir) | Decidir si se quedan las 4 o solo "Lima y tinta". Los hex deben tener una sola fuente |

## 2. Tipografía

| n.º | elemento | versiones encontradas | dónde | tipo | propuesta |
|---|---|---|---|---|---|
| 23 | Fuente de títulos y cifras | Bricolage Grotesque, pesos 500–800. Se carga desde **Google Fonts** (`fonts.googleapis.com`) | Títulos h1–h3, cifras de dinero, logotipo "NEXO" | Intencional. **Riesgo:** necesita internet para verse | Descargarla a `assets/` y cargarla con archivo propio |
| 24 | Fuente de texto | DM Sans, pesos 400–700. Se carga desde **Google Fonts** | Todo el texto corriente, botones, etiquetas | Intencional. **Riesgo:** necesita internet | Igual que la fila 23 |
| 25 | Fuentes de respaldo | "Segoe UI", `system-ui`, `sans-serif`. **No se cargan de ningún lado** | Se usan solo si falla Google Fonts | Accidental. **Riesgo:** sin internet, Windows muestra Segoe UI y Mac o celular muestran otra fuente | Al tener archivos propios (filas 23 y 24), dejar solo `sans-serif` de respaldo |
| 26 | Peso 800 en DM Sans | 6 elementos piden 800 pero DM Sans se carga solo hasta 700 | Contador de avisos, etiqueta PRO, chip de racha, avatares, "Deshacer" del aviso, botón "?" | Accidental (se verá en 700) | Pedir 700 |
| 27 | Pesos usados | 400 (texto), 500 (1 uso), 600 (4), 700 (12), 800 (8) | Todo el diseño | Accidental (500 y 600 casi no se distinguen) | Texto 400, destacado 600, negrita 700. El 800 solo en Bricolage para cifras |
| 28 | Cifras grandes | 52 px (racha), 44 px (monto de Inicio y campo de monto), 32 px (cifra de meta y símbolo $). Peso 800, altura de línea 1,05 o 1,1 | Racha, Inicio, Registrar gasto, Tu meta | Intencional (el 1,05 y el 1,1 son accidental) | Tres tamaños: `cifra-xl` 52, `cifra-l` 44, `cifra-m` 32, con altura de línea 1,1 |
| 29 | Título de pantalla de pestaña y de bienvenida | 30 px (h1: Gastos, Metas, Comunidad, Copiloto) y 34 px (título del onboarding), altura de línea 1,08 | Pantallas de pestañas y onboarding | Accidental (30 y 34 casi iguales) | Un solo tamaño de 30 px |
| 30 | Títulos secundarios y logotipo | 22 px (título de pantallas internas, 4 usos), 23 px (logotipo "NEXO"), 24 px (título "Copiloto", escrito en línea) | Pantallas internas, barra superior, Copiloto | Accidental (22, 23 y 24 casi iguales) | Un solo tamaño de 22 px |
| 31 | Subtítulos y cifras medias | 20 px (h2), 18 px (cifras del hero, texto del onboarding), 17 px (h3 y párrafo del mensaje de NEXO) | Tarjetas, hero de Inicio, onboarding | Accidental (17 y 18 casi iguales) | Dos tamaños: 20 px y 18 px |
| 32 | Texto base | 16 px. No está declarado: lo hereda el navegador | Burbujas del chat, botones, campos | Intencional | Declararlo en `body` como `texto-base` |
| 33 | Texto pequeño | 14 px (11 usos) y 13 px (9 usos) | 14: etiquetas de campo, alertas, chips, hero. 13: texto gris `.small`, errores de campo, metadatos de publicaciones | Accidental (14 y 13 casi iguales) | Un solo tamaño de 14 px |
| 34 | Texto mínimo | 12 px (3 usos) y 11 px (3 usos) | 12: etiquetas, días de racha. 11: contadores y nombres de la barra inferior | Accidental (casi iguales; 11 px es muy chico para leer) | Un solo tamaño de 12 px |
| 35 | Altura de línea | 1 (logotipo), 1,05 (cifras), 1,08 (h1), 1,1 (campo monto), 1,4 (mensaje de NEXO), 1,45 (burbujas, notas), 1,5 (onboarding, en línea). El resto no la define | Todo el texto | Accidental | Tres valores: 1 (logotipo), 1,1 (títulos y cifras), 1,45 (texto). Declarar la del texto en `body` |
| 36 | Espaciado entre letras | −0,04em (logotipo, cifras), −0,03em (importes, campo monto), −0,025em (h1–h3), 0,04em (etiquetas en mayúscula), 0,06em (etiqueta PRO) | Títulos, cifras, etiquetas | Accidental (tres valores negativos casi iguales) | −0,04em (cifras y logotipo), −0,025em (títulos) y 0,04em (mayúsculas) |
| 37 | Etiqueta pequeña en mayúsculas | `.eyebrow` y `.group-title` tienen el mismo estilo: 13 px, 700, 0,04em, gris, mayúsculas | Onboarding y Racha; fechas de la lista de Gastos | Accidental (dos nombres para lo mismo) | Un solo estilo `etiqueta-mayuscula` |

## 3. Espaciados

| n.º | elemento | versiones encontradas | dónde | tipo | propuesta |
|---|---|---|---|---|---|
| 38 | Separación entre elementos (gap) | 4 (3 usos), 5 (1), 6 (4), 8 (13), 9 (2), 10 (2, en línea), 12 (6), 14 (3), 16 (2) | Filas, chips, tarjetas, formularios | Accidental (5, 6, 9, 10 y 14 son casi iguales a sus vecinos) | Escala de 4: 4, 8, 12, 16, 20, 24, 32 |
| 39 | Relleno interno (padding) | Pantalla `14px 16px`. Tarjeta 18. Mensaje de NEXO `18px 20px`. Hero `24px 22px`. Estado vacío `30px 20px`. Campos `14px 16px`. Filas de lista `13px 0` | Todo el diseño | Accidental (13, 14, 18, 20, 22 y 30 casi iguales entre sí) | Misma escala de la fila 38: pantalla `16`, tarjeta `16` o `20`, hero `24`, vacío `32` |
| 40 | Márgenes | 2, 4, 6, 8, 10, 12, 14, 16 y 18 px. Hay 87 estilos en línea en el JavaScript: 29 son `margin: 0` para quitar márgenes de títulos y párrafos, y unos 30 son márgenes sueltos | Títulos y párrafos de todas las pantallas | Accidental | Quitar el margen por defecto de h1–h3 y p, y usar solo valores de la escala de la fila 38 |
| 41 | Ancho de la app | Máximo 480 px, centrada. En pantallas de 520 px o más se ve con marco. Ancho mínimo 320 px | Todas las pantallas | Intencional | Conservar como `--ancho-app` |
| 42 | Espacio inferior para la barra de navegación | 112 px (+ zona segura) en pestañas, 32 px en pantallas internas | Todas las pantallas | Intencional | Conservar |

## 4. Bordes y sombras

| n.º | elemento | versiones encontradas | dónde | tipo | propuesta |
|---|---|---|---|---|---|
| 43 | Radios con token | 8 px (`--r-s`, 0 usos), 12 px (`--r-m`, 0 usos), 16 px (`--r-l` 1 uso y `--r-btn` 2 usos), 20 px (`--r-card`, 5 usos) | Tarjetas, botones, campos, alertas | Accidental (dos tokens definidos y sin uso) | Mantener 8, 12, 16 y 20, y usarlos |
| 44 | Radios escritos a mano | 6 (etiqueta PRO), 10 (pestaña), 11 (ícono pequeño), 13 (ícono grande), 14 (4 usos), 16 (opción de paleta), 18 (burbuja) | Etiquetas, íconos, aviso, burbujas | Accidental (casi iguales a los tokens) | 6 y 10 pasan a 8. 11, 13 y 14 pasan a 12. 16 usa el token. 18 pasa a 16 |
| 45 | Círculo completo | `50%` (14 usos) y `99px` (11 usos) | Botones redondos, avatares, pastillas, barras | Accidental (misma intención) | Un solo `--radio-total` de 999 px |
| 46 | Grosor de borde | 1 px (8 usos), 1,5 px (9), 2 px (3), 3 px (foco de teclado) | 1 px: tarjetas, filas, barra inferior. 1,5 px: campos, chips, botones redondos. 2 px: subrayado del monto, puntos de racha | Accidental (1,5 y 2 casi iguales) | Tres valores: 1 px (contenedores), 2 px (controles) y 3 px (foco) |
| 47 | Sombras | 4 anillos sin desenfoque: marco de la app (`0 0 0 1px #d8d1bf`), contorno de barra lima (sin uso), halo del logo central de la barra inferior (`0 0 0 4px`), anillo de las muestras de paleta (`#0000001f`) | Pantallas anchas, barra inferior, Perfil | Intencional (no hay sombras flotantes: diseño plano) | Conservar como `--anillo-*`. Eliminar el anillo sin uso |
| 48 | Foco de teclado | Línea de 3 px en azul IA, separada 2 px | Botones y campos | Intencional | Conservar como `--foco` |
| 49 | Animaciones | Barras de 0,2 s y 0,3 s, botón 0,12 s, puntos del chat 1 s. Se apagan con "reducir movimiento" | Barras de progreso, botones, chat | Accidental (0,2 s y 0,3 s) | Una duración para barras (0,3 s) y otra para botones (0,12 s) |

## 5. Componentes que se repiten

| n.º | elemento | versiones encontradas | dónde | tipo | propuesta |
|---|---|---|---|---|---|
| 50 | Botón principal | Fondo tinta, texto blanco, 52 px de alto, radio 16, hover `#2A2A4A` | "Registrar gasto de hoy" (Inicio), Guardar gasto, Guardar cambios, Continuar, Siguiente, Crear meta, Abonar, Publicar, Responder, Volver al inicio | Intencional | `boton` (principal) |
| 51 | Botón secundario | Fondo lima, 3 usos explícitos | "Registrar un gasto" (chat), "Hacer una pregunta nueva" (Comunidad vacía), "Ver mi recompensa" (Gasto registrado) | Intencional | `boton-secundario` |
| 52 | Botón terciario | Fondo blanco con borde, 6 usos | "Corregir monto", Deshacer, Ajustar meta, Mantener meta, "Ver mi consejo", "Cargar datos de ejemplo" | Intencional | `boton-terciario` |
| 53 | Botón de texto | Sin fondo, subrayado, 10 usos | Saltar, Cancelar (2), "Ver racha", "Ver metas", "Ver todos", "Volver a mis metas", "Volver a la comunidad", "Marcar todo como visto", "Registrar otro gasto" | Intencional | `boton-texto` |
| 54 | Botón de peligro | Fondo error suave, texto rojo, 2 usos | "Eliminar gasto" (Editar gasto), "Reiniciar demo" (Perfil) | Intencional | `boton-peligro` |
| 55 | Botón `.btn.on-dark` | Es igual al botón secundario y tiene 0 usos | En ninguna parte | Accidental (duplicado sin uso) | Eliminar |
| 56 | Tamaños de botón | Normal 52 px (29 de ancho completo) y pequeño 42 px (15 usos) | Todos los botones | Intencional | `normal` (52 px) y `pequeno` (42 px, ajustado al múltiplo de 4: 44 px) |
| 57 | Botones redondos de ícono | 24 px (ayuda "?"), 32 px (ojo de Inicio), 40 px (campana, perfil, nueva conversación), 44 px (volver), 48 px (enviar), 96 px (micrófono, sin uso) | Barra superior, chat, Inicio | Accidental (40 y 44 tienen el mismo diseño; sin uso el de 96) | Un tamaño de 44 px y uno compacto de 32 px. Eliminar `.mic-btn` |
| 58 | Chips (opciones seleccionables) | Alto 40 px, pastilla, borde 1,5 px. Estados: normal y activo (fondo lima, borde tinta). Con o sin ícono; en fila que se desliza | Cuentas y ideas de meta (onboarding), categoría y "¿Cuándo fue?" (Registrar gasto), filtros de Comunidad, preguntas sugeridas del chat | Intencional | `chip` |
| 59 | Otros controles tipo botón | "Grabar audio" y "Escribir" (52 px, radio 14), "Marcar como útil" (36 px), chip de racha (36 px). Pestañas `.tabs` y `.tab` (42 px) existen pero no se usan | Registrar gasto, Pregunta, barra superior | Accidental (alturas 36, 42 y 52 casi iguales a otros controles; pestañas sin uso) | Alturas de control 36, 44 y 52. Eliminar `.tabs` y `.tab` |
| 60 | Tarjeta base | Fondo blanco, borde 1 px, radio 20, relleno 18 | Inicio, Gastos, Metas, Perfil, Racha, Comunidad, Avisos | Intencional | `tarjeta` |
| 61 | Variantes de tarjeta | Lima (racha), oscura (resumen del mes de Inicio), tocable como botón (metas, preguntas, avisos), vacía con borde punteado, recompensa bloqueada (opacidad 0,72), tarjeta con borde (opciones de paleta) | Inicio, Racha, Metas, Comunidad, Avisos, Perfil | Intencional | `tarjeta-acento`, `tarjeta-oscura`, `tarjeta-boton`, `tarjeta-vacia` |
| 62 | Mensaje de NEXO en Inicio (`.insight`) | Igual a la tarjeta base, pero con relleno `18px 20px` y título en azul | Solo Inicio | Accidental (duplica la tarjeta) | Usar `tarjeta` con un subtítulo azul |
| 63 | Burbujas de chat | Usuario: fondo tinta, radio 18, cola de 6. NEXO: fondo blanco con borde, ancho máximo 94 % (usuario 86 %) | Copiloto | Intencional | `burbuja-usuario` y `burbuja-nexo` (radio de 16) |
| 64 | Alertas y avisos | Alertas verde, amarilla y roja (radio 16, 14 px, peso 600). Aviso "Este monto es mayor…" (tarjeta con fondo amarillo y dos botones). Aviso temporal (fondo tinta, radio 14) | Formularios, Registrar y Editar gasto, Perfil, toda la app | Intencional (el radio 14 del aviso es accidental) | `alerta-exito`, `alerta-aviso`, `alerta-error` y `aviso-temporal` (radio 12) |
| 65 | Barra superior | Tres versiones: pestañas (logo, NEXO, campana, racha, perfil; separación 8), pantallas internas (volver y título; separación 12) y onboarding (logo y Saltar, o volver y título; separación 14). Todas de 44 px de alto mínimo | Todas las pantallas | Intencional (la separación 8, 12 y 14 es accidental) | `barra-pestana`, `barra-interna` y `barra-onboarding`, con separación de 12 |
| 66 | Barra de navegación inferior | Una versión: 5 ítems (Inicio, Gastos, Copiloto con el logo al centro, Metas, Comunidad). Etiqueta de 11 px. Ítem activo con píldora lima de 52×30 | Pantallas de pestañas | Intencional | `barra-navegacion` (etiqueta de 12 px) |
| 67 | Campos de texto | Texto (54 px, borde 1,5 px, radio 16), área de texto (120 px; 90 px en Responder), monto grande (44 px con subrayado), chat (pastilla de 48 px), buscador (ícono a la izquierda) | Onboarding, Registrar y Editar gasto, Crear meta, Abonar, Perfil, Nueva pregunta, Copiloto, Comunidad | Intencional | `campo`, `campo-area`, `campo-monto`, `campo-chat` y `campo-buscar` |
| 68 | Etiquetas de campo | Una en negrita de 14 px (`.field label`) y otra gris de 13 px (`.small.muted`) | Negrita: onboarding, Crear meta, categoría. Gris: "Monto", "Ingresos mensuales" en Perfil | Accidental | Una sola `etiqueta-campo` |
| 69 | Mensaje de error de campo | Texto rojo de 13 px, peso 600, y campo con borde y fondo de error | Todos los formularios | Intencional | `campo-error` (14 px) |
| 70 | Etiquetas pequeñas | Pastilla lima (porcentaje de meta), pastilla oscura ("Lista", "Canjeada"), pastilla arena ("Ejemplo"), etiqueta PRO (radio 6), contador de avisos (círculo rojo), chip de racha | Metas, Racha, Comunidad, barra superior | Intencional (el radio 6 de PRO es accidental) | `etiqueta`, `etiqueta-oscura`, `etiqueta-suave`, `insignia-pro` (radio 8), `contador` |
| 71 | Barras de progreso | `.bar` (10 px, relleno tinta), `.hero-bar` (8 px, relleno lima, rojo claro si te pasaste), `.progress` (6 px, sin uso), `.bar.lime` (sin uso) | Metas, Gastos por categoría, Inicio | Accidental (alturas 6, 8 y 10 casi iguales; dos sin uso) | Una `barra-progreso` de 10 px y una variante `sobre-oscuro`. Eliminar las dos sin uso |
| 72 | Filas de lista | Recuadro de ícono de 44 px, título, importe y flecha. Relleno `13px 0`, separador de 1 px | Gastos, "Últimos gastos" de Inicio | Intencional | `fila-lista` |
| 73 | Íconos en recuadro | 44 px (radio 13), 36 px (radio 11), lima, tintado por categoría y círculo de éxito de 72 px | Gastos, Metas, Racha, Avisos, Gasto registrado | Intencional (los radios 13 y 11 son accidental, ver fila 44) | `icono-recuadro` (44 y 36, radio 12) |
| 74 | Íconos | Librería Lucide dibujada con código, 37 íconos distintos. Tamaños de 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 34 y 36 px (12 tamaños; los más usados son 18 con 12 usos y 20 con 11). Trazo de 2, y en la barra inferior 1,8 o 2,2 | Todas las pantallas | Accidental (12 tamaños casi iguales) | Tres tamaños: 16, 20 y 24 px, más 36 px para íconos de éxito. Trazo de 2 |
| 75 | Logo | Círculo azul IA con dos nodos unidos (uno blanco y uno lima). Tamaños de 28, 42, 46 y 96 px | Barra superior, chat, onboarding, barra inferior | Intencional | `logo` con tres tamaños (28, 46 y 96) |
| 76 | Ilustraciones | 3 dibujos SVG de 320×200 hechos con formas simples (tinta, lima y azul) | Las 3 diapositivas del onboarding | Intencional | Conservar. Pasarlos a archivos SVG dentro de `assets/` |
| 77 | Encabezados | h1 30 px, título de pantalla interna 22 px, h2 20 px, h3 17 px, título de bienvenida 34 px, logotipo 23 px. Tamaños en filas 29 a 31 | Todas las pantallas | Intencional (los tamaños casi iguales son accidental) | `titulo-pantalla` (30), `titulo-interno` (22), `subtitulo` (20), `titulo-tarjeta` (18) |
| 78 | Racha de 7 días | Siete puntos de 26 px, borde de 2 px. El de hoy es punteado y los activos son tinta con una marca lima | Inicio, Gasto registrado, Racha | Intencional | `racha-dias` |

## Notas

- **Contraste:** no se midió el contraste entre colores de texto y de fondo. Queda fuera de esta auditoría.
- **Estilos creados por JavaScript:** el color de las categorías y el ajuste de tamaño de cifras largas (`--k`) se calculan en el JavaScript. El design kit tendrá que definirlos aparte.
- **Siguiente paso:** esta auditoría no crea `css/tokens.css` ni `css/components.css`. Eso espera las decisiones del equipo.
