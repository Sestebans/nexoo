## Qué es este proyecto

NEXO: copiloto financiero que ayuda a entender y manejar el dinero con respuestas basadas en los propios gastos y el salario, para jóvenes de 18 a 25 años con ingresos propios. Es el MVP de un equipo del curso Lenguajes Digitales 3. Más contexto en README.md.

## Documentos que debes leer antes de construir

- spec.md: qué se construye (flujo, datos y pantallas). Si no existe o algo no está ahí, pregunta antes de inventar.
- css/tokens.css y css/components.css: el design kit. componentes.html muestra todos los componentes.

## Tecnología (no cambiar sin preguntar)

- HTML, CSS y JavaScript puro. Sin frameworks ni librerías (nada de React, Vue, Tailwind ni TypeScript) y sin paso de compilación: todo debe funcionar abriendo los archivos en el navegador.
- La app se publicará en Vercel, conectada a este repositorio.
- Más adelante, la base de datos será Supabase. Por ahora, los datos son simulados.

## Estructura del proyecto

- disenos/: diseños originales. Solo de referencia: nunca los modifiques.
- assets/: todas las imágenes, logos e íconos de la app. Usa siempre las de aquí, nunca links de imágenes de internet.
- css/: estilos. tokens.css (decisiones base), components.css (componentes) y styles.css (estilos generales de las pantallas).
- js/: código. app.js (comportamiento) y data.js (datos simulados, separados del diseño).
- index.html: la pantalla de inicio, la puerta de entrada de la app. Las demás pantallas van en la carpeta pages/.
- Nombres de archivos y carpetas: minúsculas, sin tildes, ñ ni espacios, con guiones.

## Reglas de trabajo

1. Antes de crear o modificar archivos, explica tu plan en pocas líneas y espera aprobación.
2. Trabaja una pantalla o una función a la vez.
3. Usa solo los tokens y componentes del design kit. Si necesitas un estilo o componente que no existe, pregunta: primero se agrega al kit y a componentes.html, y después se usa.
4. Nunca escribas claves, contraseñas ni tokens de acceso en el código: este repositorio es público.
5. Si algo que te pedimos contradice spec.md, avísanos antes de hacerlo.
6. Al terminar cada tarea, explica en lenguaje simple qué cambiaste y por qué. Somos un equipo aprendiendo.
7. Antes de cada comando de git, explica en una frase qué hace.

## Componentes disponibles

Todos viven en css/components.css y usan solo variables de css/tokens.css. Cada página enlaza primero tokens.css y después components.css. En componentes.html están todos con sus variantes y el HTML para copiar. Una variante se suma a la clase base (por ejemplo `class="boton boton--secundario"`). Las partes internas usan `__` (por ejemplo `tarjeta__...`).

**Distribución**
- `.pagina-app` (en `<body>`) y `.pantalla` con `.pantalla__contenido`: la columna de celular centrada. `<main class="pantalla"><div class="pantalla__contenido">…</div></main>`
- `.pila`: apila elementos con espacio. `<div class="pila">…</div>`
- `.fila` (y `.fila--ajusta`): pone elementos en línea. `<div class="fila"><span>Texto</span><span class="espaciador"></span><button class="boton boton--pequeno">Ver</button></div>`
- `.espaciador`: empuja lo que sigue al extremo opuesto de una `.fila`.

**Texto**
- `.titulo-pantalla` (30 px), `.titulo-interno` (22 px), `.titulo-tarjeta` o `.subtitulo` (18 px). `<h1 class="titulo-pantalla">Gastos</h1>`
- `.etiqueta-mayuscula`: etiqueta pequeña en mayúsculas. `<p class="etiqueta-mayuscula">Tu copiloto financiero</p>`
- `.logotipo`: la palabra NEXO. `<span class="logotipo">NEXO</span>`
- `.texto-suave`, `.texto-pequeno`, `.texto-ia`: ayudas de texto. `<p class="texto-suave texto-pequeno">Ayuda</p>`
- `.cifra` (`--xl`, `--m`): cifras de dinero. `<span class="cifra cifra--xl">$ 620.000</span>`

**Íconos y marca**
- `.icono` (`--sm`, `--lg`, `--xl`): ícono SVG que toma el color del texto. `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>`
- `.logo` (`--sm`, `--lg`) con `.logo__linea`, `.logo__nodo`, `.logo__nodo--acento`: el logo de NEXO. Copia el SVG de componentes.html.
- `.icono-recuadro` (`--pequeno`, `--acento`, `--categoria` con `--comida`, `--transporte`, `--salidas`, `--compras`, `--educacion`, `--otro`): `<span class="icono-recuadro icono-recuadro--categoria icono-recuadro--comida">…</span>`
- `.marca-exito`: círculo de éxito. `<div class="marca-exito">…</div>`

**Botones**
- `.boton` (`--secundario`, `--terciario`, `--texto`, `--peligro`, `--pequeno`, `--completo`): `<button class="boton boton--completo">Guardar gasto</button>`. Para deshabilitar, usa el atributo `disabled`.
- `.boton-icono` (`--activo`, `--primario`, `--compacto`): botón redondo con ícono. `<button class="boton-icono" aria-label="Avisos">…</button>`
- `.modos` con `.boton-modo` (`--principal`, `--grabando`): `<div class="modos"><button class="boton-modo">Escribir</button>…</div>`
- `.boton-util` (`--activo`): `<button class="boton-util">Marcar como útil · 3</button>`
- `.chip-racha`: `<button class="chip-racha">5</button>`

**Chips y etiquetas**
- `.chips` (`--desliza`) con `.chip` (`--activo` o `aria-pressed="true"`): `<div class="chips"><button class="chip" aria-pressed="true">Comida</button></div>`
- `.etiqueta` (`--oscura`, `--suave`, `--ia`): `<span class="etiqueta etiqueta--oscura">Lista</span>`
- `.insignia-pro`: `<span class="insignia-pro">PRO</span>`
- `.contador`: contador rojo dentro de un `.boton-icono`. `<span class="contador">2</span>`

**Tarjetas**
- `.tarjeta` (`--acento`, `--oscura`, `--boton`, `--vacia`, `--bloqueada`): `<section class="tarjeta pila"><h3 class="titulo-tarjeta">Tu meta</h3></section>`
- `.nota-ayuda` (`--oscura`): `<p class="nota-ayuda">Explicación corta.</p>`

**Formularios**
- `.grupo-campo` con `.etiqueta-campo`, `.campo` y `.mensaje-error`: `<div class="grupo-campo"><label class="etiqueta-campo" for="x">Ingresos</label><input class="campo" id="x"></div>`
- `.campo` (`--error`, `--area`, `--chat`): `<input class="campo campo--error" aria-invalid="true">`
- `.campo-monto` (`--error`) con `.campo-monto__simbolo` y `.campo-monto__entrada`: campo de monto grande.
- `.buscador` con `.buscador__icono` y `.campo`: campo con lupa.

**Avisos y chat**
- `.alerta` (`--exito`, `--aviso`, `--error`): `<div class="alerta alerta--error" role="alert">…</div>`
- `.aviso-temporal` con `.aviso-temporal__accion`: `<div class="aviso-temporal"><span>Gasto eliminado</span><button class="aviso-temporal__accion">Deshacer</button></div>`
- `.chat` con `.burbuja` (`--usuario`, `--nexo`) y `.burbuja__encabezado`: `<div class="chat"><div class="burbuja burbuja--usuario">Hola</div></div>`

**Navegación**
- `.barra-pestana`, `.barra-interna`, `.barra-onboarding`: las tres barras superiores. `<header class="barra-interna"><button class="boton-icono">…</button><h1 class="titulo-interno">Registrar gasto</h1></header>`
- `.navegacion` con `.navegacion__item` (`--activo`), `.navegacion__icono` y `.navegacion__logo`: barra inferior de 5 secciones. Se pega abajo sola.

**Listas, progreso y racha**
- `.lista` con `.fila-lista` (`--boton`), `.fila-lista__cuerpo`, `.fila-lista__titulo` y `.fila-lista__importe`: `<div class="fila-lista"><span class="icono-recuadro">…</span><div class="fila-lista__cuerpo"><span class="fila-lista__titulo">Almuerzo</span></div><span class="fila-lista__importe">$ 15.000</span></div>`
- `.barra-progreso` (`--sobre-oscuro`, `--excedida`) con `.barra-progreso__relleno`: el ancho se pasa con la variable `--progreso`. `<div class="barra-progreso" style="--progreso: 60%"><span class="barra-progreso__relleno"></span></div>`
- `.racha-dias` con `.racha-dias__dia` (`--activo`, `--hoy`) y `.racha-dias__punto`: `<div class="racha-dias"><div class="racha-dias__dia racha-dias__dia--activo"><span class="racha-dias__punto"></span>L</div></div>`
