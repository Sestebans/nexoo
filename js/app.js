/* =========================================================
   NEXO · Comportamiento de la app
   ---------------------------------------------------------
   Scripts normales (sin import ni export) para que todo
   funcione al abrir la página con doble clic.
   Cada pantalla tiene su función; el <body> dice cuál es con
   data-pantalla="nombre-del-archivo-sin-.html".
   ========================================================= */


/* ---------- Datos ---------- */

/* Los datos se leen SOLO con obtenerDatos(). Hoy devuelve lo que la persona
   guardó en este navegador (Simulado) o, si no hay nada, los datos de ejemplo
   de data.js. El día que conectemos Supabase, solo cambian estas dos funciones. */
function obtenerDatos(nombre) {
  try {
    var guardado = window.localStorage.getItem("nexo:" + nombre);
    if (guardado) return JSON.parse(guardado);
  } catch (e) { /* sin guardado: se usan los datos de ejemplo */ }
  return JSON.parse(JSON.stringify(DATOS[nombre] || []));
}

function guardarDatos(nombre, lista) {
  try {
    window.localStorage.setItem("nexo:" + nombre, JSON.stringify(lista));
  } catch (e) { /* el navegador no deja guardar: la demo sigue sin guardado */ }
}


/* ---------- Ayudas ---------- */

function soloNumeros(texto) {
  return String(texto || "").replace(/\D/g, "").slice(0, 10);
}

/* 1500000 -> "1.500.000" */
function conPuntos(numeros) {
  return String(numeros).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function marcarChip(chip, activo) {
  chip.setAttribute("aria-pressed", activo ? "true" : "false");
}


/* ---------- Pantalla: index.html (F1.1, F1.2 y F1.2b) ---------- */

function pantallaIndex() {
  var diapositivas = obtenerDatos("diapositivas");
  var ideasMeta = obtenerDatos("ideasMeta");
  var formasDePlata = obtenerDatos("formasDePlata");

  var pasoBienvenida = document.getElementById("paso-bienvenida");
  var pasoSituacion = document.getElementById("paso-situacion");

  /* --- Carrusel de bienvenida (F1.1) --- */
  var imagen = document.getElementById("diapositiva-imagen");
  var etiqueta = document.getElementById("diapositiva-etiqueta");
  var titulo = document.getElementById("diapositiva-titulo");
  var texto = document.getElementById("diapositiva-texto");
  var puntos = document.getElementById("diapositiva-puntos");
  var botonSiguiente = document.getElementById("boton-siguiente");
  var textoSiguiente = document.getElementById("boton-siguiente-texto");
  var botonSaltar = document.getElementById("boton-saltar");
  var actual = 0;

  diapositivas.forEach(function () {
    var punto = document.createElement("span");
    punto.className = "puntos__punto";
    puntos.appendChild(punto);
  });

  function pintarDiapositiva() {
    var d = diapositivas[actual];
    imagen.src = d.imagen;
    imagen.alt = d.alt;
    etiqueta.textContent = d.etiqueta;
    etiqueta.hidden = !d.etiqueta;
    titulo.textContent = d.titulo;
    texto.textContent = d.texto;
    textoSiguiente.textContent = actual === diapositivas.length - 1 ? "Empezar" : "Siguiente";
    puntos.setAttribute("aria-label", "Diapositiva " + (actual + 1) + " de " + diapositivas.length);
    Array.prototype.forEach.call(puntos.children, function (punto, i) {
      punto.classList.toggle("puntos__punto--activo", i === actual);
    });
  }

  botonSiguiente.addEventListener("click", function () {
    if (actual < diapositivas.length - 1) {
      actual += 1;
      pintarDiapositiva();
    } else {
      mostrarSituacion(false);
    }
  });
  botonSaltar.addEventListener("click", function () { mostrarSituacion(false); });

  /* --- Situación inicial (F1.2) y campos pendientes (F1.2b) --- */
  var alerta = document.getElementById("alerta-pendientes");
  var introduccion = document.getElementById("situacion-introduccion");
  var campos = {
    ingreso: document.getElementById("campo-ingreso"),
    nombre: document.getElementById("campo-meta-nombre"),
    monto: document.getElementById("campo-meta-monto")
  };
  var validadores = {
    ingreso: function () { return Number(soloNumeros(campos.ingreso.value)) > 0; },
    nombre: function () { return campos.nombre.value.trim().length >= 2; },
    monto: function () { return Number(soloNumeros(campos.monto.value)) > 0; }
  };
  var conError = {};

  var chipsForma = document.getElementById("chips-forma");
  formasDePlata.forEach(function (forma) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = forma.nombre;
    marcarChip(chip, false);
    chip.addEventListener("click", function () {
      marcarChip(chip, chip.getAttribute("aria-pressed") !== "true");
    });
    chipsForma.appendChild(chip);
  });

  var chipsIdeas = document.getElementById("chips-ideas");
  ideasMeta.forEach(function (idea) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = idea.nombre;
    marcarChip(chip, false);
    chip.addEventListener("click", function () {
      Array.prototype.forEach.call(chipsIdeas.children, function (otro) { marcarChip(otro, otro === chip); });
      campos.nombre.value = idea.nombre;
      quitarErrorSiYaEsValido("nombre");
    });
    chipsIdeas.appendChild(chip);
  });

  function pintarCampo(clave, hayError) {
    var campo = campos[clave];
    var grupo = campo.closest(".grupo-campo");
    var mensaje = grupo.querySelector(".mensaje-error");
    var ayuda = grupo.querySelector("[data-ayuda]");
    campo.classList.toggle("campo--error", hayError);
    campo.setAttribute("aria-invalid", hayError ? "true" : "false");
    if (hayError) campo.setAttribute("aria-describedby", mensaje.id);
    else campo.removeAttribute("aria-describedby");
    mensaje.hidden = !hayError;
    if (ayuda) ayuda.hidden = hayError;
  }

  function pintarErrores() {
    var hay = false;
    Object.keys(campos).forEach(function (clave) {
      pintarCampo(clave, !!conError[clave]);
      if (conError[clave]) hay = true;
    });
    alerta.hidden = !hay;
    introduccion.hidden = hay;
  }

  function quitarErrorSiYaEsValido(clave) {
    if (conError[clave] && validadores[clave]()) {
      conError[clave] = false;
      pintarErrores();
    }
  }

  /* Los montos se escriben con formato de pesos: $ 1.500.000 */
  [campos.ingreso, campos.monto].forEach(function (campo) {
    campo.addEventListener("input", function () {
      var numeros = soloNumeros(campo.value);
      campo.value = numeros ? "$ " + conPuntos(numeros) : "";
    });
  });
  Object.keys(campos).forEach(function (clave) {
    campos[clave].addEventListener("input", function () { quitarErrorSiYaEsValido(clave); });
  });

  function mostrarSituacion(conPendientes) {
    pasoBienvenida.hidden = true;
    pasoSituacion.hidden = false;
    if (conPendientes) {
      Object.keys(campos).forEach(function (clave) { conError[clave] = true; });
    }
    pintarErrores();
    window.scrollTo(0, 0);
  }

  document.getElementById("boton-volver").addEventListener("click", function () {
    pasoSituacion.hidden = true;
    pasoBienvenida.hidden = false;
    actual = diapositivas.length - 1;
    pintarDiapositiva();
    window.scrollTo(0, 0);
  });

  pasoSituacion.addEventListener("submit", function (e) {
    e.preventDefault();
    var primero = null;
    Object.keys(campos).forEach(function (clave) {
      conError[clave] = !validadores[clave]();
      if (conError[clave] && !primero) primero = campos[clave];
    });
    pintarErrores();
    if (primero) { primero.focus(); return; }

    /* Todo bien: se guarda en este navegador (Simulado) y se pasa a Inicio */
    var perfil = obtenerDatos("perfil");
    perfil[0].ingresoMensual = Number(soloNumeros(campos.ingreso.value));
    perfil[0].comoManejaPlata = Array.prototype.filter.call(chipsForma.children, function (chip) {
      return chip.getAttribute("aria-pressed") === "true";
    }).map(function (chip) { return chip.textContent; });
    perfil[0].onboardingCompletado = true;
    guardarDatos("perfil", perfil);

    var metas = obtenerDatos("metas");
    var primeraMeta = {
      id: metas.length ? metas[0].id : 1,
      nombre: campos.nombre.value.trim(),
      montoObjetivo: Number(soloNumeros(campos.monto.value)),
      ahorrado: metas.length ? metas[0].ahorrado : 0
    };
    if (metas.length) metas[0] = primeraMeta; else metas.push(primeraMeta);
    guardarDatos("metas", metas);

    window.location.href = "pages/inicio.html";
  });

  /* Al abrir: index.html#situacion y index.html#pendientes llevan directo al formulario */
  pintarDiapositiva();
  var pedido = window.location.hash.replace("#", "");
  if (pedido === "situacion") mostrarSituacion(false);
  else if (pedido === "pendientes") mostrarSituacion(true);
}


/* ---------- Ayudas de Inicio: íconos, dinero y fechas ---------- */

/* Íconos que se dibujan desde JavaScript (los fijos van en el HTML) */
var ICONOS = {
  ojo: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  ojoTachado: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  comida: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  transporte: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  salidas: '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
  compras: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  educacion: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  otro: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  meta: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  flechaDer: '<path d="m9 18 6-6-6-6"/>'
};

/* Cómo se ve cada categoría: su clase del kit y su ícono */
var ESTILO_CATEGORIA = {
  "Comida": { clase: "comida", icono: "comida" },
  "Transporte": { clase: "transporte", icono: "transporte" },
  "Salidas": { clase: "salidas", icono: "salidas" },
  "Compras": { clase: "compras", icono: "compras" },
  "Educación": { clase: "educacion", icono: "educacion" },
  "Otro": { clase: "otro", icono: "otro" }
};

function crearIcono(nombre, extra) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icono" + (extra ? " " + extra : ""));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICONOS[nombre];
  return svg;
}

/* Crea un elemento con clase y texto (sirve para armar listas) */
function crearElemento(etiqueta, clase, texto) {
  var el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/* 1500000 -> "$ 1.500.000" */
function pesos(numero) {
  return "$ " + conPuntos(Math.abs(Math.round(numero)));
}

/* Fecha -> "AAAA-MM-DD" (así se guarda el día de un gasto) */
function claveDia(fecha) {
  var mes = String(fecha.getMonth() + 1).padStart(2, "0");
  var dia = String(fecha.getDate()).padStart(2, "0");
  return fecha.getFullYear() + "-" + mes + "-" + dia;
}

function diaHaceN(hoy, n) {
  var fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - n);
  return { fecha: fecha, clave: claveDia(fecha) };
}


/* ---------- Pantalla: pages/inicio.html (F1.3) ---------- */

function pantallaInicio() {
  /* Solo mientras no exista el botón "Cargar datos de ejemplo" de Perfil:
     inicio.html#ejemplo carga los gastos de ejemplo e inicio.html#vacio los borra. */
  var pedido = window.location.hash.replace("#", "");
  if (pedido === "ejemplo" || pedido === "vacio") {
    guardarDatos("gastos", pedido === "ejemplo" ? obtenerDatos("gastosEjemplo") : []);
    window.history.replaceState(null, "", window.location.pathname);
  }

  var perfil = obtenerDatos("perfil");
  var metas = obtenerDatos("metas");
  var gastos = obtenerDatos("gastos");
  var avisos = obtenerDatos("avisos");
  var ayudas = obtenerDatos("ayudas");
  var hoy = new Date();

  /* --- Números que se calculan (no se guardan) --- */
  var ingreso = perfil[0].ingresoMensual;
  var mes = claveDia(hoy).slice(0, 7);
  var gastado = gastos.reduce(function (suma, g) {
    return g.dia.slice(0, 7) === mes ? suma + g.monto : suma;
  }, 0);
  var quedan = ingreso - gastado;
  var ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  var diasQueFaltan = ultimoDiaDelMes - hoy.getDate() + 1;   /* contando hoy */
  var porDia = quedan > 0 ? Math.floor(quedan / diasQueFaltan) : 0;
  var porcentajeGastado = ingreso > 0 ? Math.min(100, Math.round(gastado / ingreso * 100)) : (gastado > 0 ? 100 : 0);

  /* --- Resumen del mes --- */
  var titulo = document.getElementById("resumen-titulo");
  var cifra = document.getElementById("resumen-cifra");
  var barra = document.getElementById("resumen-barra");
  var textoGastado = document.getElementById("resumen-gastado");
  var textoPorDia = document.getElementById("resumen-por-dia");
  var botonOjo = document.getElementById("boton-ojo");

  function pintarResumen() {
    var ocultar = perfil[0].ocultarMontos;
    function monto(elemento, numero) {
      elemento.textContent = ocultar ? "$ ****" : pesos(numero);
      if (ocultar) elemento.setAttribute("aria-label", "Monto oculto");
      else elemento.removeAttribute("aria-label");
    }
    titulo.textContent = quedan >= 0 ? "Te quedan este mes" : "Te pasaste este mes por";
    monto(cifra, quedan);
    monto(textoGastado, gastado);
    monto(textoPorDia, porDia);
    barra.style.setProperty("--progreso", porcentajeGastado + "%");
    barra.classList.toggle("barra-progreso--excedida", quedan < 0);
    barra.setAttribute("aria-label", "Has gastado el " + porcentajeGastado + "% de tus ingresos");
    botonOjo.setAttribute("aria-pressed", ocultar ? "true" : "false");
    botonOjo.setAttribute("aria-label", ocultar ? "Mostrar montos" : "Ocultar montos");
    botonOjo.replaceChildren(crearIcono(ocultar ? "ojoTachado" : "ojo"));
  }
  botonOjo.addEventListener("click", function () {
    perfil[0].ocultarMontos = !perfil[0].ocultarMontos;
    guardarDatos("perfil", perfil);
    pintarResumen();
  });
  pintarResumen();

  /* --- Botones "?" que abren y cierran su nota --- */
  function conectarAyuda(idBoton, idNota, idAyuda) {
    var boton = document.getElementById(idBoton);
    var nota = document.getElementById(idNota);
    var ayuda = ayudas.filter(function (a) { return a.id === idAyuda; })[0];
    nota.textContent = ayuda ? ayuda.texto : "";
    boton.addEventListener("click", function () {
      var abierta = nota.hidden;
      nota.hidden = !abierta;
      boton.setAttribute("aria-expanded", abierta ? "true" : "false");
    });
  }
  conectarAyuda("boton-ayuda-calculo", "ayuda-calculo", "calculo");
  conectarAyuda("boton-ayuda-racha", "ayuda-racha", "racha");

  /* --- Avisos sin ver (campana) --- */
  var sinVer = avisos.filter(function (a) { return !a.visto; }).length;
  var contador = document.getElementById("contador-avisos");
  contador.hidden = sinVer === 0;
  contador.textContent = sinVer;
  document.getElementById("enlace-avisos").setAttribute("aria-label", sinVer ? "Avisos, " + sinVer + " nuevos" : "Avisos");

  /* --- Racha: días seguidos con al menos un gasto --- */
  var diasConGasto = {};
  gastos.forEach(function (g) { diasConGasto[g.dia] = true; });
  var racha = 0;
  var desde = diasConGasto[diaHaceN(hoy, 0).clave] ? 0 : 1;   /* si hoy aún no registra, cuenta desde ayer */
  while (diasConGasto[diaHaceN(hoy, desde + racha).clave]) racha += 1;

  document.getElementById("racha-chip").textContent = racha;
  document.getElementById("racha-titulo").textContent = racha + (racha === 1 ? " día" : " días") + " de racha";

  var letras = ["D", "L", "M", "M", "J", "V", "S"];
  var contenedorRacha = document.getElementById("racha-dias");
  for (var i = 6; i >= 0; i--) {
    var dia = diaHaceN(hoy, i);
    var activo = !!diasConGasto[dia.clave];
    var celda = crearElemento("div", "racha-dias__dia" + (activo ? " racha-dias__dia--activo" : "") + (i === 0 ? " racha-dias__dia--hoy" : ""));
    var punto = crearElemento("span", "racha-dias__punto");
    if (activo) punto.appendChild(crearIcono("check", "icono--sm"));
    celda.appendChild(punto);
    celda.appendChild(document.createTextNode(letras[dia.fecha.getDay()]));
    contenedorRacha.appendChild(celda);
  }

  /* --- Mensaje de NEXO (se calcula con los números, no usa la IA) --- */
  var mensaje = document.getElementById("mensaje-nexo");
  if (gastos.length === 0) {
    mensaje.textContent = "Registra tu primer gasto de hoy y te cuento cómo vas.";
  } else if (gastos.length < 3) {
    var faltan = 3 - gastos.length;
    mensaje.textContent = "Registra " + faltan + (faltan === 1 ? " gasto más" : " gastos más") + " y te cuento qué pesa más en tu mes.";
  } else {
    var porCategoria = {};
    var total = 0;
    gastos.forEach(function (g) {
      porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
      total += g.monto;
    });
    var mayor = Object.keys(porCategoria).sort(function (a, b) { return porCategoria[b] - porCategoria[a]; })[0];
    mensaje.textContent = "Lo que más pesa este mes es " + mayor.toLowerCase() + ": " + Math.round(porCategoria[mayor] / total * 100) + "% de lo que has registrado.";
  }

  /* --- Meta activa: la primera que todavía no está cumplida --- */
  var contenidoMeta = document.getElementById("meta-contenido");
  var meta = metas.filter(function (m) { return m.ahorrado < m.montoObjetivo; })[0] || metas[0];
  if (!meta) {
    contenidoMeta.appendChild(crearElemento("p", "texto-suave", "Todavía no has creado una meta"));
    var crear = crearElemento("a", "boton boton--secundario boton--completo", "Crear una meta");
    crear.href = "crear-meta.html";
    contenidoMeta.appendChild(crear);
  } else {
    var porcentajeMeta = Math.min(100, Math.round(meta.ahorrado / meta.montoObjetivo * 100));
    var enlaceMeta = crearElemento("a", "fila-lista fila-lista--boton");
    enlaceMeta.href = "meta-detalle.html";
    var iconoMeta = crearElemento("span", "icono-recuadro icono-recuadro--acento");
    iconoMeta.appendChild(crearIcono("meta"));
    var cuerpoMeta = crearElemento("div", "fila-lista__cuerpo pila");
    var filaMeta = crearElemento("div", "fila");
    filaMeta.appendChild(crearElemento("span", "fila-lista__titulo", meta.nombre));
    filaMeta.appendChild(crearElemento("span", "espaciador"));
    filaMeta.appendChild(crearElemento("span", "texto-suave texto-pequeno", porcentajeMeta + "%"));
    var barraMeta = crearElemento("div", "barra-progreso");
    barraMeta.style.setProperty("--progreso", porcentajeMeta + "%");
    barraMeta.setAttribute("role", "img");
    barraMeta.setAttribute("aria-label", "Llevas el " + porcentajeMeta + "% de tu meta");
    barraMeta.appendChild(crearElemento("span", "barra-progreso__relleno"));
    cuerpoMeta.appendChild(filaMeta);
    cuerpoMeta.appendChild(barraMeta);
    cuerpoMeta.appendChild(crearElemento("span", "texto-suave texto-pequeno", pesos(meta.ahorrado) + " de " + pesos(meta.montoObjetivo)));
    enlaceMeta.appendChild(iconoMeta);
    enlaceMeta.appendChild(cuerpoMeta);
    contenidoMeta.appendChild(enlaceMeta);
  }

  /* --- Últimos 3 gastos (los más recientes primero) --- */
  var lista = document.getElementById("lista-gastos");
  var recientes = gastos.slice().sort(function (a, b) {
    return (b.dia + b.creado).localeCompare(a.dia + a.creado);
  }).slice(0, 3);
  if (recientes.length === 0) {
    lista.appendChild(crearElemento("p", "texto-suave", "Aquí aparecerán tus últimos gastos."));
  }
  recientes.forEach(function (g) {
    var estilo = ESTILO_CATEGORIA[g.categoria] || ESTILO_CATEGORIA["Otro"];
    var nombre = g.nota || g.categoria;
    var fila = crearElemento("a", "fila-lista fila-lista--boton");
    fila.href = "gastos.html#editar";
    fila.setAttribute("aria-label", nombre + ", " + pesos(g.monto) + ". Toca para editar");
    var icono = crearElemento("span", "icono-recuadro icono-recuadro--categoria icono-recuadro--" + estilo.clase);
    icono.appendChild(crearIcono(estilo.icono));
    var cuerpo = crearElemento("span", "fila-lista__cuerpo");
    cuerpo.appendChild(crearElemento("span", "fila-lista__titulo", nombre));
    cuerpo.appendChild(crearElemento("span", "texto-suave texto-pequeno", g.categoria));
    fila.appendChild(icono);
    fila.appendChild(cuerpo);
    fila.appendChild(crearElemento("span", "fila-lista__importe", pesos(g.monto)));
    fila.appendChild(crearIcono("flechaDer", "icono--sm"));
    lista.appendChild(fila);
  });
}


/* ---------- Arranque: cada página ejecuta solo la función de su pantalla ---------- */

var PANTALLAS = {
  "index": pantallaIndex,
  "inicio": pantallaInicio
};

document.addEventListener("DOMContentLoaded", function () {
  var nombre = document.body.getAttribute("data-pantalla");
  if (PANTALLAS[nombre]) PANTALLAS[nombre]();
});
