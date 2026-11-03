# Decisiones del design kit de NEXO

Estas son las decisiones finales del equipo sobre la [auditoría](auditoria-design-kit.md). La columna "n.º" remite a la fila de la auditoría. Los nombres son los que quedaron en `css/tokens.css` y `css/components.css`.

**Decisiones generales del equipo**
- Se queda una sola paleta: "Lima y tinta". Se eliminan "Coral y ciruela", "Mar y menta" y "Sol y noche", y el selector de colores de Perfil.
- El azul IA suave se conserva.
- Los demás valores de la auditoría se aprueban como se propusieron, con tres ajustes: tarjeta con relleno de 20 px, chips de 44 px, y campo de texto de 52 px y campo del chat de 44 px.

## 1. Colores

| n.º | elemento | decisión final | por qué |
|---|---|---|---|
| 1 | Fondo base | `#F6F2EA` como `--color-fondo` | Es el fondo de toda la app |
| 2 | Blanco | `#FFFFFF` como `--color-superficie` (tarjetas y campos) y `--color-texto-inverso` (texto sobre oscuro) | Era el mismo valor escrito de dos maneras |
| 3 | Tinta | `#14142B` como `--color-primario` y `--color-texto` | Es el color más usado y marca el botón principal |
| 4 | Tinta al pasar el mouse | `#2A2A4A` como `--color-primario-hover` | Hover del botón principal |
| 5 | Texto secundario | `#5B5B73` como `--color-texto-suave`. La categoría "Otro" usa el mismo token | Evita dos nombres para el mismo gris |
| 6 | Texto terciario | Se elimina (`#686880`) | Casi igual al texto secundario y sin uso |
| 7 | Borde y separadores | `#E4DFD3` como `--color-borde`. Reemplaza a `#E6E0D2` | Diferían 2 niveles y nadie lo decidió |
| 8 | Arena | `#ECE7DB` como `--color-fondo-suave` | Fondo suave distinto del borde |
| 9 | Marco de la app en computador | Usa `--color-borde` (se elimina `#d8d1bf`) | Estaba escrito a mano, fuera de los tokens |
| 10 | Lima | `#C9F25C` como `--color-secundario` | Acento de la marca |
| 11 | Lima al pasar el mouse | `#B8E23F` como `--color-secundario-hover` | Hover del botón secundario |
| 12 | Lima suave | `#F1FAD6` como `--color-secundario-suave` | Fondo de notas de ayuda |
| 13 | Azul IA | `#3A4BFF` como `--color-ia` | Identifica a NEXO y marca el foco del teclado |
| 14 | Azul IA suave | Se conserva: `#E8EBFF` como `--color-ia-suave`. Se usa en `.etiqueta--ia` | El equipo decidió mantenerlo |
| 15 | Éxito | `#0B7A55` como `--color-exito` y `#DDF1E8` como `--color-exito-suave` | Verde de las alertas de éxito |
| 16 | Advertencia | `#8A5600` como `--color-aviso` y `#FBEBCB` como `--color-aviso-suave` | Amarillo de las alertas |
| 17 | Error | `#C73B3F` como `--color-error` y `#FBE3E3` como `--color-error-suave` | Rojo de errores y acciones peligrosas |
| 18 | Rojo claro sobre fondo oscuro | `#FF8A8E` como `--color-error-claro` | Estaba escrito a mano, ahora tiene nombre |
| 19 | Blancos translúcidos sobre oscuro | `--color-inverso-texto` (`#FFFFFFC7`) y `--color-inverso-fondo` (`#FFFFFF2E`) | Había cuatro opacidades casi iguales |
| 20 | Colores de categorías | `--color-cat-comida` `#C2561C`, `-transporte` `#1F6FC2`, `-salidas` `#7A3FC4`, `-compras` `#C22A66`, `-educacion` `#12795F`, `-otro` (el gris suave) | Cada categoría necesita su color propio |
| 21 | Alias sin uso | Se eliminan `--bg`, `--pri`, `--pri-d`, `--pri-50`, `--pri-100`, `--sec`, `--sec-50`, `--in`, `--in-50` | Eran nombres duplicados que nadie usaba |
| 22 | Paletas alternativas | Una sola paleta: "Lima y tinta" | Decisión del equipo: una sola identidad visual |

## 2. Tipografía

| n.º | elemento | decisión final | por qué |
|---|---|---|---|
| 23 | Fuente de títulos y cifras | Bricolage Grotesque como `--fuente-titulos`, cargada desde Google Fonts con `@import` al inicio de `tokens.css` | Está en Google Fonts, así que no se depende de que esté instalada |
| 24 | Fuente de texto | DM Sans como `--fuente-texto`, cargada igual desde Google Fonts | Mismo motivo que la fila 23 |
| 25 | Fuentes de respaldo | Cada fuente termina en `Arial, sans-serif` | Si no hay internet, el texto sigue legible |
| 26 | Peso 800 en DM Sans | Se pide 700 | DM Sans solo se carga hasta 700 |
| 27 | Pesos | `--peso-normal` 400 y `--peso-fuerte` 700. El 600 pasa a 700. `--peso-cifra` 800 solo para cifras y logotipo | Quedan pesos fáciles de distinguir |
| 28 | Cifras grandes | `--texto-cifra-xl` 52 px, `--texto-cifra-l` 44 px y `--texto-cifra-m` 32 px, peso 800. Las dos grandes se achican en pantallas angostas | Tres tamaños bastan |
| 29 | Título de pantalla | `--texto-2xl`: 30 px | Se unifican el 30 y el 34 |
| 30 | Títulos secundarios y logotipo | `--texto-xl`: 22 px | Se unifican el 22, 23 y 24 |
| 31 | Subtítulos y títulos de tarjeta | `--texto-lg`: 18 px. El 20 y el 17 pasan a 18 | Se unifican en un solo tamaño. `.subtitulo` y `.titulo-tarjeta` se ven igual |
| 32 | Texto base | `--texto-base`: 16 px, declarado en `body` | Hoy lo hereda el navegador sin que esté escrito |
| 33 | Texto pequeño | `--texto-sm`: 14 px | Se unifican el 13 y el 14 |
| 34 | Texto mínimo | `--texto-xs`: 12 px | Se unifican el 11 y el 12 |
| 35 | Altura de línea | `--linea-titulo` 1,1 (títulos y cifras) y `--linea-texto` 1,45 (texto, declarada en `body`) | Pasamos de 7 valores a 2 |
| 36 | Espaciado entre letras | `--letras-cifra` −0,04em, `--letras-titulo` −0,025em y `--letras-mayuscula` 0,04em | Pasamos de 5 valores a 3 |
| 37 | Etiqueta pequeña en mayúsculas | Una sola: `.etiqueta-mayuscula` | `.eyebrow` y `.group-title` eran lo mismo |

## 3. Espaciados

| n.º | elemento | decisión final | por qué |
|---|---|---|---|
| 38 | Separación entre elementos | `--espacio-1` a `--espacio-8`: 4, 8, 12, 16, 20, 24, 28 y 32 px | Reemplaza 9 valores casi iguales. El 28 se incluye para llegar al `--espacio-8` |
| 39 | Relleno interno | Pantalla 16 px, tarjeta 20 px, hero 24 px, estado vacío 32 px | Cada valor sale de la escala |
| 40 | Márgenes | Misma escala. h1–h3 y p pierden el margen por defecto | Evita estilos en línea de `margin: 0` |
| 41 | Ancho de la app | `--ancho-app` 480 px, centrada. Mínimo `--ancho-minimo` 320 px | Se conserva tal cual |
| 42 | Barra de navegación inferior | `.navegacion` se pega al fondo de la pantalla (sticky) | Con eso ya no hace falta reservar 112 px de espacio |

## 4. Bordes y sombras

| n.º | elemento | decisión final | por qué |
|---|---|---|---|
| 43 | Radios | `--radio-sm` 8, `--radio-md` 12, `--radio-lg` 16 y `--radio-xl` 20 (tarjetas) | Había dos tokens definidos y sin uso |
| 44 | Radios escritos a mano | 6 y 10 pasan a 8. 11, 13 y 14 pasan a 12. 18 pasa a 16 | Todos eran casi iguales a un token |
| 45 | Círculo completo | `--radio-total` 999 px | El 50 % y el 99 px hacían lo mismo |
| 46 | Grosor de borde | `--borde-fino` 1 px (contenedores), `--borde-grueso` 2 px (controles) y `--borde-foco` 3 px | El 1,5 y el 2 eran casi iguales |
| 47 | Sombras | `--sombra-suave`: anillo de 1 px del color de borde (marco de la app). `--sombra-media`: halo de 4 px del color de fondo (logo de la barra inferior) | El diseño es plano: solo hay anillos sin desenfoque |
| 48 | Foco de teclado | Línea de 3 px en `--color-ia`, separada 2 px | Se conserva tal cual |
| 49 | Animaciones | `--duracion-barra` 0,3 s y `--duracion-boton` 0,12 s. Se mantiene el apagado con "reducir movimiento" | Había 0,2 s y 0,3 s sin motivo |

## 5. Componentes

| n.º | elemento | decisión final | por qué |
|---|---|---|---|
| 50 | Botón principal | `.boton`: fondo tinta, texto blanco, 52 px, radio 16 | Acción principal de cada pantalla |
| 51 | Botón secundario | `.boton--secundario`: fondo lima | Acción de apoyo destacada |
| 52 | Botón terciario | `.boton--terciario`: fondo blanco con borde | Acción alternativa discreta |
| 53 | Botón de texto | `.boton--texto`: sin fondo, subrayado | Acción de menor peso, como Cancelar |
| 54 | Botón de peligro | `.boton--peligro`: fondo error suave, texto rojo | Para acciones que borran |
| 55 | Botón `.btn.on-dark` | Se elimina | Era igual al secundario y no se usaba |
| 56 | Tamaños de botón | Normal 52 px y `.boton--pequeno` 44 px. `.boton--completo` ocupa todo el ancho | Alturas de la escala de controles |
| 57 | Botones redondos de ícono | `.boton-icono` de 44 px, `--compacto` de 32 px, `--activo` y `--primario`. Se elimina el botón de micrófono grande | Había 5 tamaños casi iguales y uno sin uso |
| 58 | Chips | `.chip`: 44 px de alto, pastilla, borde de 2 px. Estados normal y activo | Mismo alto que los demás controles |
| 59 | Otros controles tipo botón | `.boton-modo` 52 px, `.boton-util` y `.chip-racha` 36 px. Se eliminan `.tabs` y `.tab` | Alturas de la escala 36, 44 y 52. Las pestañas no se usaban |
| 60 | Tarjeta base | `.tarjeta`: fondo blanco, borde 1 px, radio 20, relleno 20 | Es el contenedor más repetido |
| 61 | Variantes de tarjeta | `--acento`, `--oscura`, `--boton`, `--vacia` y `--bloqueada` | Cada una tiene un propósito distinto |
| 62 | Mensaje de NEXO en Inicio | Se elimina `.insight`. Se usa `.tarjeta` con un título `.texto-ia` | Duplicaba la tarjeta base |
| 63 | Burbujas de chat | `.burbuja--usuario` y `.burbuja--nexo`, radio 16 | Distinguen quién habla |
| 64 | Alertas y avisos | `.alerta--exito`, `.alerta--aviso`, `.alerta--error` y `.aviso-temporal` (radio 12) | Cada alerta tiene su color |
| 65 | Barra superior | `.barra-pestana`, `.barra-interna` y `.barra-onboarding`, con separación de 12 px | Tres contextos distintos, mismo espacio |
| 66 | Barra de navegación inferior | `.navegacion`: 5 ítems, etiqueta de 12 px, ítem activo con píldora lima | Se conserva, con la letra de 12 px |
| 67 | Campos de texto | `.campo` (52 px), `--area`, `--chat` (44 px), `.campo-monto` y `.buscador` | Cada uno sirve para un tipo de dato |
| 68 | Etiquetas de campo | Una sola: `.etiqueta-campo` (14 px, 700) | Había dos estilos para lo mismo |
| 69 | Mensaje de error de campo | `.mensaje-error`: texto rojo de 14 px, peso 700 | Se conserva, con la letra de 14 px |
| 70 | Etiquetas pequeñas | `.etiqueta` (`--oscura`, `--suave`, `--ia`), `.insignia-pro` (radio 8) y `.contador` | Cada una tiene su uso |
| 71 | Barras de progreso | `.barra-progreso` de 10 px con `--sobre-oscuro` y `--excedida`. Se eliminan `.progress` y `.bar.lime` | Había tres alturas casi iguales y dos sin uso |
| 72 | Filas de lista | `.fila-lista`: recuadro de ícono, título, importe y flecha | Se conserva tal cual |
| 73 | Íconos en recuadro | `.icono-recuadro` de 44 px y `--pequeno` de 36 px, radio 12 | Se unifican los radios 11 y 13 |
| 74 | Íconos | Librería Lucide dibujada con SVG. `.icono` de 16, 20 y 24 px, más `--xl` de 36 px. Trazo de 2 | Pasamos de 12 tamaños a 4 |
| 75 | Logo | `.logo` en tres tamaños: 28, 46 y 96 px | El 42 se une al 46 |
| 76 | Ilustraciones | Las 3 del onboarding pasarán a archivos SVG dentro de `assets/` | Así las imágenes quedan dentro de `assets/` |
| 77 | Encabezados | `.titulo-pantalla` (30), `.titulo-interno` (22) y `.titulo-tarjeta` o `.subtitulo` (18) | Tres niveles claros |
| 78 | Racha de 7 días | `.racha-dias`: puntos de 26 px, borde 2 px, hoy punteado | Se conserva tal cual |
