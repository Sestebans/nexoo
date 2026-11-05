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
  mensaje: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  pulgar: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  candado: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  regalo: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  alerta: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  circuloCheck: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
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


/* ---------- Racha (la usan Inicio y Registrar gasto) ---------- */

/* Días seguidos con al menos un gasto, y los últimos 7 días marcados.
   Si hoy todavía no hay gasto, la racha se cuenta desde ayer. */
function calcularRacha(gastos, hoy) {
  var diasConGasto = {};
  gastos.forEach(function (g) { diasConGasto[g.dia] = true; });
  var racha = 0;
  var desde = diasConGasto[diaHaceN(hoy, 0).clave] ? 0 : 1;
  while (diasConGasto[diaHaceN(hoy, desde + racha).clave]) racha += 1;

  var letras = ["D", "L", "M", "M", "J", "V", "S"];
  var semana = [];
  for (var i = 6; i >= 0; i--) {
    var dia = diaHaceN(hoy, i);
    semana.push({ letra: letras[dia.fecha.getDay()], activo: !!diasConGasto[dia.clave], hoy: i === 0 });
  }
  return { racha: racha, semana: semana };
}

/* Dibuja los 7 días de la racha dentro de un .racha-dias */
function pintarSemana(contenedor, semana) {
  contenedor.replaceChildren();
  semana.forEach(function (d) {
    var celda = crearElemento("div", "racha-dias__dia" + (d.activo ? " racha-dias__dia--activo" : "") + (d.hoy ? " racha-dias__dia--hoy" : ""));
    var punto = crearElemento("span", "racha-dias__punto");
    if (d.activo) punto.appendChild(crearIcono("check", "icono--sm"));
    celda.appendChild(punto);
    celda.appendChild(document.createTextNode(d.letra));
    contenedor.appendChild(celda);
  });
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
  var datosRacha = calcularRacha(gastos, hoy);
  document.getElementById("racha-chip").textContent = datosRacha.racha;
  document.getElementById("racha-titulo").textContent = datosRacha.racha + (datosRacha.racha === 1 ? " día" : " días") + " de racha";
  pintarSemana(document.getElementById("racha-dias"), datosRacha.semana);

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


/* ---------- Copiloto: el motor que responde con tus números (sin IA) ---------- */

/* Las cuentas del mes que necesita el chat. Se calcula, no se guarda. */
function resumenFinanciero(perfil, gastos, metas, hoy) {
  var ingreso = perfil[0].ingresoMensual;
  var mes = claveDia(hoy).slice(0, 7);
  var delMes = gastos.filter(function (g) { return g.dia.slice(0, 7) === mes; });
  var gastado = delMes.reduce(function (suma, g) { return suma + g.monto; }, 0);
  var disponible = ingreso > 0 ? ingreso - gastado : null;
  var diasQueFaltan = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate() - hoy.getDate() + 1;

  var porCategoria = {};
  delMes.forEach(function (g) { porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto; });
  var categorias = Object.keys(porCategoria).map(function (nombre) {
    return { categoria: nombre, monto: porCategoria[nombre], pct: Math.round(porCategoria[nombre] / gastado * 100) };
  }).sort(function (a, b) { return b.monto - a.monto; });

  var metasConPct = metas.map(function (m) {
    return { id: m.id, nombre: m.nombre, objetivo: m.montoObjetivo, ahorrado: m.ahorrado,
             pct: Math.min(100, Math.round(m.ahorrado / m.montoObjetivo * 100)), cumplida: m.ahorrado >= m.montoObjetivo };
  });

  return {
    ingreso: ingreso,
    gastado: gastado,
    disponible: disponible,
    diasQueFaltan: diasQueFaltan,
    porDia: disponible !== null && disponible > 0 ? Math.floor(disponible / diasQueFaltan) : 0,
    pasado: disponible !== null && disponible < 0,
    categorias: categorias,
    top: categorias[0] || null,
    metaActiva: metasConPct.filter(function (m) { return !m.cumplida; })[0] || metasConPct[0] || null,
    racha: calcularRacha(gastos, hoy).racha,
    mejorRacha: calcularMejorRacha(gastos),
    cantidadGastos: gastos.length,
    hayDatosSuficientes: ingreso > 0 && gastos.length >= 3     /* con 3 gastos o más */
  };
}

/* De qué trata la pregunta: meta, categoria, presupuesto, racha o general */
function detectarIntencion(pregunta) {
  var t = pregunta.toLowerCase();
  if (/meta|ahorr|voy bien|logro|alcanz/.test(t)) return "meta";
  if (/m[aá]s gast|categor[ií]a|en qu[eé] gast|donde se me va|d[oó]nde se me va/.test(t)) return "categoria";
  if (/gastar|semana|al d[ií]a|me queda|disponible|presupuesto|alcanza|este mes/.test(t)) return "presupuesto";
  if (/racha|d[ií]as seguidos/.test(t)) return "racha";
  return "general";
}

/* Estas preguntas necesitan datos para responder bien */
function necesitaDatos(intencion) {
  return intencion === "meta" || intencion === "categoria" || intencion === "presupuesto";
}

/* La respuesta, escrita con los números de la persona. Con Pro suma un análisis ampliado. */
function responderLocal(intencion, r, conPro) {
  var texto;
  if (intencion === "presupuesto") {
    texto = r.pasado
      ? "Este mes ya te pasaste por " + pesos(-r.disponible) + " frente a lo que recibes. Lo mejor es pausar gastos no esenciales hasta fin de mes."
      : "Este mes te quedan " + pesos(r.disponible) + " y faltan " + r.diasQueFaltan + " días. Eso da unos " + pesos(r.porDia) + " al día.";
  } else if (intencion === "meta") {
    var m = r.metaActiva;
    texto = m
      ? "Vas en " + m.pct + '% de "' + m.nombre + '": ' + pesos(m.ahorrado) + " de " + pesos(m.objetivo) + ". Te faltan " + pesos(Math.max(0, m.objetivo - m.ahorrado)) + "."
      : "Todavía no tienes una meta creada. Crea una y te ayudo a seguirla.";
  } else if (intencion === "categoria") {
    texto = r.top
      ? "Lo que más pesa este mes es " + r.top.categoria.toLowerCase() + ": " + pesos(r.top.monto) + ", el " + r.top.pct + "% de lo que has registrado."
      : "Aún no tengo gastos de este mes para comparar.";
  } else if (intencion === "racha") {
    texto = r.racha > 0
      ? "Llevas " + r.racha + (r.racha === 1 ? " día" : " días") + " seguidos registrando. Tu mejor racha es de " + r.mejorRacha + "."
      : "Hoy puedes empezar una racha nueva registrando un gasto.";
  } else {
    texto = r.ingreso > 0
      ? "Te puedo ayudar con tu presupuesto, tus metas o tus gastos. Por ahora llevas " + pesos(r.gastado) + " gastados este mes y te quedan " + pesos(r.disponible) + "."
      : "Te puedo ayudar con tu presupuesto, tus metas o tus gastos.";
  }
  if (conPro && r.categorias.length > 1) {
    texto += " Análisis ampliado: " + r.categorias.slice(0, 3).map(function (c) {
      return c.categoria + " " + pesos(c.monto) + " (" + c.pct + "%)";
    }).join(", ") + ".";
  }
  return texto;
}

/* La "Acción sugerida" que acompaña a la respuesta sobre la meta (o null si no aplica) */
function accionSugerida(r) {
  var m = r.metaActiva;
  if (!m || !r.ingreso || m.cumplida) return null;
  var faltan = m.objetivo - m.ahorrado;
  var cuota = Math.max(10000, Math.round(r.ingreso * 0.2 / 1000) * 1000);
  var meses = Math.ceil(faltan / cuota);
  return {
    texto: "Te faltan " + pesos(faltan) + ' para "' + m.nombre + '". Si apartas ' + pesos(cuota) + " al mes (el 20% de lo que recibes), la logras en unos " + meses + (meses === 1 ? " mes." : " meses."),
    metaId: m.id
  };
}


/* ---------- Pantalla: pages/copiloto.html (F2.1, F2.1b y F2.2) ---------- */

/* El logo de NEXO pequeño, para el encabezado de cada mensaje */
function crearLogoPequeno() {
  var logo = crearElemento("span", "logo logo--sm");
  logo.setAttribute("role", "img");
  logo.setAttribute("aria-label", "NEXO");
  logo.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="logo__linea" d="M15 32L33 16" stroke-width="3.5" stroke-linecap="round"/><circle class="logo__nodo" cx="15" cy="32" r="5.5"/><circle class="logo__nodo logo__nodo--acento" cx="33" cy="16" r="5.5"/></svg>';
  return logo;
}

function pantallaCopiloto() {
  var hoy = new Date();
  var perfil = obtenerDatos("perfil");
  var gastos = obtenerDatos("gastos");
  var metas = obtenerDatos("metas");
  var avisos = obtenerDatos("avisos");
  var mensajes = obtenerDatos("mensajes");
  var conPro = diasDePro(obtenerDatos("planPro"), hoy) > 0;

  var chat = document.getElementById("chat");
  var campo = document.getElementById("campo-pregunta");
  var botonEnviar = document.getElementById("boton-enviar");
  var botonNueva = document.getElementById("boton-nueva");
  var aviso = document.getElementById("aviso-copiloto");

  /* --- Barra superior: racha y avisos sin ver --- */
  document.getElementById("racha-chip").textContent = calcularRacha(gastos, hoy).racha;
  var sinVer = avisos.filter(function (a) { return !a.visto; }).length;
  var contador = document.getElementById("contador-avisos");
  contador.hidden = sinVer === 0;
  contador.textContent = sinVer;
  document.getElementById("enlace-avisos").setAttribute("aria-label", sinVer ? "Avisos, " + sinVer + " nuevos" : "Avisos");
  if (conPro) document.getElementById("copiloto-subtitulo").textContent = "NEXO Pro activo";

  /* --- Dibujar la conversación --- */
  function guardarMensajes() { guardarDatos("mensajes", mensajes); }

  function nuevoMensaje(de, texto, extra) {
    var m = {
      id: mensajes.reduce(function (mayor, x) { return Math.max(mayor, x.id); }, 0) + 1,
      de: de,
      texto: texto,
      fuente: "",
      faltanDatos: false,
      accionSugerida: null,
      resuelta: ""
    };
    Object.keys(extra || {}).forEach(function (clave) { m[clave] = extra[clave]; });
    mensajes.push(m);
    return m;
  }

  function cuerpoDeNexo(m) {
    var cuerpo = crearElemento("div", "pila");
    if (m.faltanDatos) {
      cuerpo.appendChild(crearElemento("strong", "", "Me faltan datos para responder bien"));
      cuerpo.appendChild(crearElemento("span", "", "Con al menos 3 gastos registrados puedo decirte algo útil. Hoy llevas " + gastos.length + "."));
      var registrar = crearElemento("a", "boton boton--secundario boton--pequeno alinear-inicio", "Registrar un gasto");
      registrar.href = "registrar-gasto.html";
      cuerpo.appendChild(registrar);
      return cuerpo;
    }
    cuerpo.appendChild(crearElemento("span", "", m.texto));
    if (m.fuente === "cálculo local") {
      cuerpo.appendChild(crearElemento("span", "texto-suave texto-pequeno", "Respuesta con tus números, sin usar la IA."));
    }
    if (m.accionSugerida) {
      var tarjeta = crearElemento("div", "nota-ayuda pila");
      tarjeta.appendChild(crearElemento("strong", "", "Acción sugerida"));
      tarjeta.appendChild(crearElemento("p", "", m.accionSugerida.texto));
      if (m.resuelta) {
        tarjeta.appendChild(crearElemento("span", "texto-suave texto-pequeno", m.resuelta === "mantener" ? "Mantienes tu meta como está." : "Vas a ajustar tu meta."));
      } else {
        var botones = crearElemento("div", "fila");
        var mantener = crearElemento("button", "boton boton--terciario boton--pequeno", "Mantener meta");
        mantener.type = "button";
        mantener.addEventListener("click", function () {
          m.resuelta = "mantener";
          guardarMensajes();
          pintarConversacion();
          mostrarAvisoTemporal(aviso, "Listo, mantienes tu meta");
        });
        var ajustar = crearElemento("button", "boton boton--pequeno", "Ajustar meta");
        ajustar.type = "button";
        ajustar.addEventListener("click", function () {
          m.resuelta = "ajustar";
          guardarMensajes();
          window.location.href = "meta-detalle.html?id=" + m.accionSugerida.metaId + "#editar";
        });
        botones.appendChild(mantener);
        botones.appendChild(ajustar);
        tarjeta.appendChild(botones);
      }
      cuerpo.appendChild(tarjeta);
    }
    return cuerpo;
  }

  function pintarConversacion() {
    while (chat.children.length > 1) chat.removeChild(chat.lastChild);   /* el primero es el saludo */
    mensajes.forEach(function (m) {
      if (m.de === "persona") {
        chat.appendChild(crearElemento("div", "burbuja burbuja--usuario", m.texto));
        return;
      }
      var burbuja = crearElemento("div", "burbuja burbuja--nexo");
      var encabezado = crearElemento("div", "burbuja__encabezado");
      encabezado.appendChild(crearLogoPequeno());
      encabezado.appendChild(document.createTextNode("NEXO"));
      burbuja.appendChild(encabezado);
      burbuja.appendChild(cuerpoDeNexo(m));
      chat.appendChild(burbuja);
    });
    botonNueva.hidden = mensajes.length === 0;
  }

  function irAlFinal() {
    if (chat.lastElementChild && chat.lastElementChild.scrollIntoView) chat.lastElementChild.scrollIntoView({ block: "end" });
  }

  /* --- Preguntar --- */
  function preguntar(texto) {
    var pregunta = texto.trim();
    if (!pregunta) return;
    nuevoMensaje("persona", pregunta);
    var intencion = detectarIntencion(pregunta);
    var resumen = resumenFinanciero(perfil, gastos, metas, hoy);
    if (necesitaDatos(intencion) && !resumen.hayDatosSuficientes) {
      nuevoMensaje("NEXO", "Me faltan datos para responder bien.", { faltanDatos: true });
    } else {
      nuevoMensaje("NEXO", responderLocal(intencion, resumen, conPro), {
        fuente: "cálculo local",
        accionSugerida: intencion === "meta" ? accionSugerida(resumen) : null
      });
    }
    guardarMensajes();
    pintarConversacion();
    irAlFinal();
  }

  var contenedorPreguntas = document.getElementById("preguntas-sugeridas");
  obtenerDatos("preguntasSugeridas").forEach(function (p) {
    var chip = crearElemento("button", "chip", p.texto);
    chip.type = "button";
    chip.addEventListener("click", function () { preguntar(p.texto); });
    contenedorPreguntas.appendChild(chip);
  });

  campo.addEventListener("input", function () { botonEnviar.disabled = !campo.value.trim(); });
  document.getElementById("formulario-pregunta").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!campo.value.trim()) return;
    var texto = campo.value;
    campo.value = "";
    botonEnviar.disabled = true;
    preguntar(texto);
  });

  botonNueva.addEventListener("click", function () {
    mensajes = [];
    guardarMensajes();
    pintarConversacion();
  });

  /* --- Al abrir: copiloto.html#insuficiente y #meta hacen la pregunta de ejemplo --- */
  pintarConversacion();
  var pedido = window.location.hash.replace("#", "");
  if (pedido === "insuficiente" || pedido === "meta") {
    window.history.replaceState(null, "", window.location.pathname);
    preguntar(pedido === "meta" ? "¿Voy bien con mi meta?" : "¿Cuánto puedo gastar al día?");
  } else {
    irAlFinal();
  }
}


/* ---------- Entregas programadas: la respuesta de ejemplo y su aviso ---------- */

var SEGUNDOS_PARA_LA_RESPUESTA = 7;      /* a los pocos segundos de publicar llega la respuesta de ejemplo */
var entregasEnEspera = {};               /* para no programar dos veces la misma entrega */

/* Pone al día el número rojo de la campana, si la página tiene campana */
function actualizarContadorAvisos() {
  var contador = document.getElementById("contador-avisos");
  var enlace = document.getElementById("enlace-avisos");
  if (!contador || !enlace) return;
  var sinVer = obtenerDatos("avisos").filter(function (a) { return !a.visto; }).length;
  contador.hidden = sinVer === 0;
  contador.textContent = sinVer;
  enlace.setAttribute("aria-label", sinVer ? "Avisos, " + sinVer + " nuevos" : "Avisos");
}

/* Entrega las respuestas y avisos cuyo momento ya llegó. Corre al abrir cualquier página,
   así que si la persona cambió de pantalla antes de tiempo, igual le llegan. */
function entregarPendientes() {
  var cola = obtenerDatos("entregasProgramadas");
  var ahora = Date.now();
  var vencidas = cola.filter(function (e) { return e.entregarEn <= ahora; });
  if (vencidas.length === 0) return false;

  var respuestas = obtenerDatos("respuestas");
  var avisos = obtenerDatos("avisos");
  var plantilla = obtenerDatos("respuestasDeEjemplo")[0];
  vencidas.forEach(function (e) {
    respuestas.push({
      id: "r" + ahora.toString(36) + e.id,
      preguntaId: e.preguntaId,
      autor: plantilla.autor,
      texto: plantilla.texto,
      utiles: 0,
      marcadaPorMi: false,
      ejemplo: true
    });
    avisos.unshift({
      id: avisos.reduce(function (mayor, a) { return Math.max(mayor, a.id); }, 0) + 1,
      texto: "Nueva respuesta a tu pregunta",
      destino: "foro-detalle.html#" + e.preguntaId,
      visto: false
    });
  });
  guardarDatos("respuestas", respuestas);
  guardarDatos("avisos", avisos);
  guardarDatos("entregasProgramadas", cola.filter(function (e) { return e.entregarEn > ahora; }));

  actualizarContadorAvisos();
  document.dispatchEvent(new CustomEvent("nexo:entrega"));   /* las pantallas abiertas se actualizan */
  return true;
}

/* Si todavía faltan entregas, deja un temporizador para cuando les toque */
function programarEntregas() {
  obtenerDatos("entregasProgramadas").forEach(function (e) {
    if (entregasEnEspera[e.id]) return;
    entregasEnEspera[e.id] = true;
    window.setTimeout(entregarPendientes, Math.max(0, e.entregarEn - Date.now()) + 50);
  });
}


/* ---------- Pantalla: pages/foro.html (F3.1) ---------- */

/* La racha y los avisos sin ver de la barra superior (campana y chip de racha) */
function pintarBarraSuperior(gastos, avisos, hoy) {
  document.getElementById("racha-chip").textContent = calcularRacha(gastos, hoy).racha;
  var sinVer = avisos.filter(function (a) { return !a.visto; }).length;
  var contador = document.getElementById("contador-avisos");
  contador.hidden = sinVer === 0;
  contador.textContent = sinVer;
  document.getElementById("enlace-avisos").setAttribute("aria-label", sinVer ? "Avisos, " + sinVer + " nuevos" : "Avisos");
}

function pantallaForo() {
  var preguntas = obtenerDatos("preguntas");
  var respuestas = obtenerDatos("respuestas");
  pintarBarraSuperior(obtenerDatos("gastos"), obtenerDatos("avisos"), new Date());

  var categoriaElegida = "Todas";
  var campoBusqueda = document.getElementById("campo-busqueda");
  var contenedorCategorias = document.getElementById("categorias-foro");
  var lista = document.getElementById("lista-preguntas");

  function contarRespuestas(pregunta) {
    return respuestas.filter(function (r) { return r.preguntaId === pregunta.id; }).length;
  }

  /* Las preguntas que cumplen la categoría elegida y lo que se escribió en el buscador */
  function preguntasVisibles() {
    var busqueda = campoBusqueda.value.toLowerCase();
    return preguntas.filter(function (p) {
      return (categoriaElegida === "Todas" || p.categoria === categoriaElegida) &&
        (p.titulo + " " + p.texto).toLowerCase().indexOf(busqueda) !== -1;
    });
  }

  function pintarLista() {
    lista.replaceChildren();
    var visibles = preguntasVisibles();
    if (visibles.length === 0) {
      var vacia = crearElemento("div", "tarjeta tarjeta--vacia pila");
      vacia.appendChild(crearElemento("p", "", "No encontré preguntas con eso."));
      var nueva = crearElemento("a", "boton boton--secundario", "Hacer una pregunta nueva");
      nueva.href = "foro-nueva.html";
      vacia.appendChild(nueva);
      lista.appendChild(vacia);
      return;
    }
    visibles.forEach(function (p) {
      var tarjeta = crearElemento("a", "tarjeta tarjeta--boton");
      tarjeta.href = "foro-detalle.html#" + p.id;
      var cuerpo = crearElemento("div", "pila");

      var autor = crearElemento("div", "fila fila--ajusta");
      var inicial = crearElemento("span", "avatar", p.autor.trim().charAt(0).toUpperCase());
      inicial.setAttribute("aria-hidden", "true");
      autor.appendChild(inicial);
      autor.appendChild(crearElemento("span", "texto-suave texto-pequeno", p.autor + " · " + p.categoria));
      if (p.ejemplo) autor.appendChild(crearElemento("span", "etiqueta etiqueta--suave", "Ejemplo"));
      cuerpo.appendChild(autor);

      cuerpo.appendChild(crearElemento("h2", "titulo-tarjeta", p.titulo));

      var cuantas = contarRespuestas(p);
      var pie = crearElemento("div", "fila texto-suave texto-pequeno");
      pie.appendChild(crearIcono("mensaje", "icono--sm"));
      pie.appendChild(document.createTextNode(cuantas + (cuantas === 1 ? " respuesta" : " respuestas")));
      cuerpo.appendChild(pie);

      tarjeta.appendChild(cuerpo);
      lista.appendChild(tarjeta);
    });
  }

  /* --- Categorías: Todas + las del foro --- */
  ["Todas"].concat(obtenerDatos("categoriasForo").map(function (c) { return c.nombre; })).forEach(function (nombre) {
    var chip = crearElemento("button", "chip", nombre);
    chip.type = "button";
    chip.setAttribute("data-valor", nombre);
    marcarChip(chip, nombre === categoriaElegida);
    chip.addEventListener("click", function () {
      categoriaElegida = nombre;
      Array.prototype.forEach.call(contenedorCategorias.children, function (otro) {
        marcarChip(otro, otro.getAttribute("data-valor") === nombre);
      });
      pintarLista();
    });
    contenedorCategorias.appendChild(chip);
  });

  campoBusqueda.addEventListener("input", pintarLista);
  pintarLista();

  /* Si llega una respuesta mientras se ve el feed, se actualizan los números */
  document.addEventListener("nexo:entrega", function () {
    preguntas = obtenerDatos("preguntas");
    respuestas = obtenerDatos("respuestas");
    pintarLista();
  });
}


/* ---------- Pantalla: pages/foro-detalle.html (F3.2) ---------- */

/* Reglas simples de moderación para lo que se escribe en la comunidad
   (preguntas y respuestas). Devuelve { valido, motivo }. */
function validarTextoForo(texto) {
  var t = String(texto || "").trim();
  var motivo = "";
  if (t.length < 15) motivo = "Cuéntanos un poco más. Escribe al menos 15 caracteres.";
  else if (t.length > 500) motivo = "Es muy larga. Resúmela en menos de 500 caracteres.";
  else if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(t)) motivo = "No compartas correos en la comunidad.";   /* antes que los enlaces: un correo .com no es un enlace */
  else if (/https?:\/\/|www\.|\.com\b|\.co\b/i.test(t)) motivo = "No se permiten enlaces en las preguntas.";
  else if (/\b3\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/.test(t)) motivo = "No compartas teléfonos en la comunidad.";
  else if (/contrase[ñn]a|\bclave\b|\bcvv\b|\bpin\b|n[uú]mero de (tarjeta|cuenta)/i.test(t)) motivo = "Nunca compartas claves ni datos de tarjetas o cuentas.";
  else if (/ganancias? garantizad|doblar? tu (plata|dinero)|inversi[oó]n segura|escr[ií]beme al privado|gana dinero f[aá]cil|pr[eé]stamos? inmediato/i.test(t)) motivo = "Parece una promoción. En esta comunidad solo se hacen preguntas y se comparten experiencias.";
  return { valido: motivo === "", motivo: motivo };
}

/* "2026-10-05T15:00:00Z" -> "hoy" o "hace 29 días" */
function fechaRelativa(iso) {
  var dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return dias <= 0 ? "hoy" : "hace " + dias + (dias === 1 ? " día" : " días");
}

/* La línea "inicial · autor · cuándo · Ejemplo" de una pregunta o respuesta */
function crearLineaDeAutor(autor, cuando, esEjemplo) {
  var linea = crearElemento("div", "fila fila--ajusta");
  var inicial = crearElemento("span", "avatar", autor.trim().charAt(0).toUpperCase());
  inicial.setAttribute("aria-hidden", "true");
  linea.appendChild(inicial);
  linea.appendChild(crearElemento("span", "texto-suave texto-pequeno", cuando ? autor + " · " + cuando : autor));
  if (esEjemplo) linea.appendChild(crearElemento("span", "etiqueta etiqueta--suave", "Ejemplo"));
  return linea;
}

function pantallaForoDetalle() {
  var preguntas = obtenerDatos("preguntas");
  var respuestas = obtenerDatos("respuestas");
  var id = window.location.hash.replace("#", "");
  var pregunta = preguntas.filter(function (p) { return p.id === id; })[0];

  if (!pregunta) {
    document.getElementById("paso-no-encontrada").hidden = false;
    return;
  }
  document.getElementById("paso-pregunta").hidden = false;

  /* --- La pregunta --- */
  document.getElementById("pregunta-autor").replaceWith(crearLineaDeAutor(pregunta.autor, fechaRelativa(pregunta.fecha), pregunta.ejemplo));
  document.getElementById("pregunta-titulo").textContent = pregunta.titulo;
  var texto = document.getElementById("pregunta-texto");
  texto.textContent = pregunta.texto;
  texto.hidden = pregunta.texto === pregunta.titulo;       /* si es igual al título, no se repite */

  /* --- Las respuestas --- */
  var lista = document.getElementById("lista-respuestas");

  function respuestasDeEstaPregunta() {
    return respuestas.filter(function (r) { return r.preguntaId === pregunta.id; });
  }

  function textoUtil(r) { return "Marcar como útil · " + r.utiles; }

  function crearRespuesta(r) {
    var fila = crearElemento("div", "fila-lista");
    var cuerpo = crearElemento("div", "fila-lista__cuerpo pila");
    cuerpo.appendChild(crearLineaDeAutor(r.autor, "", r.ejemplo));
    cuerpo.appendChild(crearElemento("p", "", r.texto));

    var util = crearElemento("button", "boton-util alinear-inicio");
    util.type = "button";
    util.appendChild(crearIcono("pulgar", "icono--sm"));
    var etiqueta = document.createTextNode(textoUtil(r));
    util.appendChild(etiqueta);
    function pintarUtil() {
      util.classList.toggle("boton-util--activo", r.marcadaPorMi);
      util.setAttribute("aria-pressed", r.marcadaPorMi ? "true" : "false");
      etiqueta.nodeValue = textoUtil(r);
    }
    util.addEventListener("click", function () {
      r.marcadaPorMi = !r.marcadaPorMi;
      r.utiles = Math.max(0, r.utiles + (r.marcadaPorMi ? 1 : -1));
      guardarDatos("respuestas", respuestas);
      pintarUtil();
    });
    pintarUtil();
    cuerpo.appendChild(util);

    fila.appendChild(cuerpo);
    return fila;
  }

  function pintarRespuestas() {
    var propias = respuestasDeEstaPregunta();
    document.getElementById("respuestas-titulo").textContent = "Respuestas (" + propias.length + ")";
    document.getElementById("sin-respuestas").hidden = propias.length > 0;
    lista.replaceChildren();
    propias.forEach(function (r) { lista.appendChild(crearRespuesta(r)); });
  }

  /* --- Responder --- */
  var campo = document.getElementById("campo-respuesta");
  var alerta = document.getElementById("alerta-respuesta");

  document.getElementById("formulario-respuesta").addEventListener("submit", function (e) {
    e.preventDefault();
    var revision = validarTextoForo(campo.value);
    if (!revision.valido) {
      document.getElementById("alerta-respuesta-texto").textContent = revision.motivo;
      alerta.hidden = false;
      campo.setAttribute("aria-invalid", "true");
      campo.setAttribute("aria-describedby", "alerta-respuesta");
      return;                                   /* lo escrito se conserva */
    }
    alerta.hidden = true;
    campo.setAttribute("aria-invalid", "false");
    campo.removeAttribute("aria-describedby");
    respuestas.push({
      id: "r" + Date.now().toString(36),
      preguntaId: pregunta.id,
      autor: "Tú",
      texto: campo.value.trim(),
      utiles: 0,
      marcadaPorMi: false,
      ejemplo: false
    });
    guardarDatos("respuestas", respuestas);
    campo.value = "";
    pintarRespuestas();
    if (lista.lastElementChild && lista.lastElementChild.scrollIntoView) lista.lastElementChild.scrollIntoView({ block: "nearest" });
  });

  pintarRespuestas();

  /* Si llega una respuesta mientras se lee la pregunta, aparece en la lista */
  document.addEventListener("nexo:entrega", function () {
    respuestas = obtenerDatos("respuestas");
    pintarRespuestas();
  });
}


/* ---------- Pantalla: pages/foro-nueva.html (F3.3, F3.3b y F3.4) ---------- */

/* El título de la pregunta: su primera frase (hasta 80 caracteres) */
function tituloDePregunta(texto) {
  var t = texto.trim();
  var frase = t.match(/^[^?\n]{5,80}\??/);
  return (frase ? frase[0] : t.slice(0, 80)).trim();
}

function pantallaForoNueva() {
  var categorias = obtenerDatos("categoriasForo");
  var pasoFormulario = document.getElementById("paso-formulario");
  var pasoPublicada = document.getElementById("paso-publicada");
  var campo = document.getElementById("campo-pregunta");
  var alerta = document.getElementById("alerta-pregunta");
  var chips = document.getElementById("chips-categoria");
  var categoria = categorias[0].nombre;

  /* --- Categorías: una sola, la primera viene marcada --- */
  categorias.forEach(function (c) {
    var chip = crearElemento("button", "chip", c.nombre);
    chip.type = "button";
    chip.setAttribute("data-valor", c.nombre);
    marcarChip(chip, c.nombre === categoria);
    chip.addEventListener("click", function () {
      categoria = c.nombre;
      Array.prototype.forEach.call(chips.children, function (otro) {
        marcarChip(otro, otro.getAttribute("data-valor") === categoria);
      });
    });
    chips.appendChild(chip);
  });

  /* --- Revisar lo escrito: si no sirve, se explica el motivo y se conserva el texto --- */
  function mostrarMotivo(motivo) {
    document.getElementById("alerta-pregunta-texto").textContent = motivo;
    alerta.hidden = false;
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", "alerta-pregunta");
  }
  function quitarMotivo() {
    alerta.hidden = true;
    campo.setAttribute("aria-invalid", "false");
    campo.removeAttribute("aria-describedby");
  }

  /* --- Pregunta publicada (F3.4) --- */
  function mostrarPublicada(pregunta) {
    document.getElementById("publicada-texto").textContent = pregunta.texto;
    document.getElementById("boton-ver-respuestas").href = "foro-detalle.html#" + pregunta.id;
    pasoFormulario.hidden = true;
    pasoPublicada.hidden = false;
    window.scrollTo(0, 0);
  }

  pasoFormulario.addEventListener("submit", function (e) {
    e.preventDefault();
    var revision = validarTextoForo(campo.value);
    if (!revision.valido) {
      mostrarMotivo(revision.motivo);
      return;
    }
    quitarMotivo();

    var pregunta = {
      id: "p" + Date.now().toString(36),
      titulo: tituloDePregunta(campo.value),
      texto: campo.value.trim(),
      categoria: categoria,
      autor: "Tú",
      fecha: new Date().toISOString(),
      ejemplo: false
    };
    guardarDatos("preguntas", [pregunta].concat(obtenerDatos("preguntas")));    /* la nueva va arriba */

    /* A los pocos segundos llegan una respuesta de ejemplo y su aviso */
    var cola = obtenerDatos("entregasProgramadas");
    cola.push({
      id: cola.reduce(function (mayor, x) { return Math.max(mayor, x.id); }, 0) + 1,
      preguntaId: pregunta.id,
      entregarEn: Date.now() + SEGUNDOS_PARA_LA_RESPUESTA * 1000
    });
    guardarDatos("entregasProgramadas", cola);
    programarEntregas();

    window.history.replaceState(null, "", "#publicada");
    mostrarPublicada(pregunta);
  });

  /* --- Al abrir: foro-nueva.html#invalida y #publicada muestran esos estados --- */
  var pedido = window.location.hash.replace("#", "");
  if (pedido === "invalida") {
    campo.value = "Mira www.ejemplo.com";
    mostrarMotivo(validarTextoForo(campo.value).motivo);
  } else if (pedido === "publicada") {
    var ultima = obtenerDatos("preguntas").filter(function (p) { return p.autor === "Tú"; })[0];
    if (ultima) mostrarPublicada(ultima);
  }
}


/* ---------- Pantalla: pages/avisos.html (F3.4 y Avisos) ---------- */

function pantallaAvisos() {
  var avisos = obtenerDatos("avisos");
  var lista = document.getElementById("lista-avisos");
  var vacio = document.getElementById("avisos-vacio");
  var botonTodo = document.getElementById("boton-marcar-todo");

  function pintar() {
    lista.replaceChildren();
    vacio.hidden = avisos.length > 0;
    avisos.forEach(function (a) {
      var enlace = crearElemento("a", "tarjeta tarjeta--boton");
      enlace.href = a.destino;
      var fila = crearElemento("div", "fila");
      var punto = crearElemento("span", "icono-recuadro icono-recuadro--acento", "•");
      punto.setAttribute("aria-hidden", "true");
      var cuerpo = crearElemento("div", "fila-lista__cuerpo pila");
      cuerpo.appendChild(crearElemento("strong", "", a.texto));
      cuerpo.appendChild(crearElemento("span", a.visto ? "etiqueta etiqueta--suave alinear-inicio" : "etiqueta alinear-inicio", a.visto ? "Vista" : "Nueva"));
      fila.appendChild(punto);
      fila.appendChild(cuerpo);
      enlace.appendChild(fila);
      /* Al tocarlo, este aviso queda visto y se sigue al link de la pregunta */
      enlace.addEventListener("click", function () {
        if (!a.visto) {
          a.visto = true;
          guardarDatos("avisos", avisos);
        }
      });
      lista.appendChild(enlace);
    });
    botonTodo.hidden = !avisos.some(function (a) { return !a.visto; });
  }

  botonTodo.addEventListener("click", function () {
    avisos.forEach(function (a) { a.visto = true; });
    guardarDatos("avisos", avisos);
    pintar();
  });

  /* Si llega un aviso mientras se mira la lista, aparece */
  document.addEventListener("nexo:entrega", function () {
    avisos = obtenerDatos("avisos");
    pintar();
  });

  pintar();
}


/* ---------- Pantalla: pages/racha.html (F2.4) ---------- */

/* La racha más larga que ha tenido: la mayor cantidad de días seguidos con gasto */
function calcularMejorRacha(gastos) {
  var dias = {};
  gastos.forEach(function (g) { dias[g.dia] = true; });
  var mejor = 0;
  var actual = 0;
  var anterior = null;
  Object.keys(dias).sort().forEach(function (clave) {
    var fecha = new Date(clave + "T00:00:00");
    actual = anterior && Math.round((fecha - anterior) / 86400000) === 1 ? actual + 1 : 1;
    if (actual > mejor) mejor = actual;
    anterior = fecha;
  });
  return mejor;
}

/* Días que le quedan al plan Pro (0 si no está activo) */
function diasDePro(planPro, ahora) {
  var hasta = planPro[0] && planPro[0].proHasta ? new Date(planPro[0].proHasta) : null;
  return hasta && hasta > ahora ? Math.ceil((hasta - ahora) / 86400000) : 0;
}

/* El consejo de la recompensa: se calcula con los gastos de este mes */
function textoConsejo(gastos, ingreso, hoy) {
  var mes = claveDia(hoy).slice(0, 7);
  var delMes = gastos.filter(function (g) { return g.dia.slice(0, 7) === mes; });
  if (delMes.length === 0) return "Registra tus gastos unos días y te doy un consejo hecho a tu medida.";
  var porCategoria = {};
  var total = 0;
  delMes.forEach(function (g) {
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
    total += g.monto;
  });
  var mayor = Object.keys(porCategoria).sort(function (a, b) { return porCategoria[b] - porCategoria[a]; })[0];
  var pasado = ingreso > 0 && total > ingreso ? " Este mes ya te pasaste de lo que recibes, así que vale la pena frenar lo no esencial." : "";
  return "Lo que más pesa en tu mes es " + mayor.toLowerCase() + ": " + pesos(porCategoria[mayor]) + ", el " + Math.round(porCategoria[mayor] / total * 100) + "% de lo que has registrado. Prueba ponerle un tope semanal y mira cómo cambia tu cifra al día." + pasado;
}

function pantallaRacha() {
  var hoy = new Date();
  var gastos = obtenerDatos("gastos");
  var recompensas = obtenerDatos("recompensas");
  var canjeadas = obtenerDatos("canjeadas");
  var planPro = obtenerDatos("planPro");
  var ingreso = obtenerDatos("perfil")[0].ingresoMensual;

  var datosRacha = calcularRacha(gastos, hoy);
  var mejor = calcularMejorRacha(gastos);
  var aviso = document.getElementById("aviso-racha");

  function plural(n) { return n === 1 ? "día" : "días"; }
  function estaCanjeada(r) { return canjeadas.some(function (c) { return c.recompensaId === r.id; }); }

  /* --- Racha actual --- */
  document.getElementById("racha-numero").textContent = datosRacha.racha;
  document.getElementById("racha-unidad").textContent = plural(datosRacha.racha);
  pintarSemana(document.getElementById("racha-dias"), datosRacha.semana);

  var proxima = recompensas.filter(function (r) { return mejor < r.dias; })[0];
  document.getElementById("racha-mejor").textContent = "Tu mejor racha: " + mejor + " " + plural(mejor) + ". " +
    (proxima ? "Te faltan " + (proxima.dias - mejor) + ' para "' + proxima.titulo + '".' : "Ya reclamaste todo lo disponible.");

  /* --- Plan Pro --- */
  function pintarPro() {
    var quedan = diasDePro(planPro, new Date());
    document.getElementById("panel-pro").hidden = quedan === 0;
    document.getElementById("pro-texto").textContent = "NEXO Pro activo. Te quedan " + quedan + " " + plural(quedan) + ".";
  }

  /* --- Recompensas --- */
  var lista = document.getElementById("lista-recompensas");
  var botonConsejo = document.getElementById("boton-consejo");

  function canjear(r) {
    canjeadas.push({ id: canjeadas.reduce(function (m, c) { return Math.max(m, c.id); }, 0) + 1, recompensaId: r.id });
    guardarDatos("canjeadas", canjeadas);

    if (r.diasPro > 0) {
      /* Los días de Pro se suman a los que ya le queden */
      var actual = planPro[0].proHasta ? new Date(planPro[0].proHasta).getTime() : 0;
      planPro[0].proHasta = new Date(Math.max(Date.now(), actual) + r.diasPro * 86400000).toISOString();
      guardarDatos("planPro", planPro);
    }

    if (r.tipo === "consejo") {
      var mensajes = obtenerDatos("mensajes");
      mensajes.push({
        id: mensajes.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1,
        de: "NEXO",
        texto: textoConsejo(gastos, ingreso, hoy),
        fuente: "cálculo local",
        faltanDatos: false,
        accionSugerida: null,
        resuelta: ""
      });
      guardarDatos("mensajes", mensajes);
      mostrarAvisoTemporal(aviso, "Recompensa canjeada. Te dejé un consejo en el copiloto.");
    } else {
      mostrarAvisoTemporal(aviso, "Recompensa canjeada: " + r.titulo);
    }
    pintarRecompensas();
    pintarPro();
  }

  function pintarRecompensas() {
    lista.replaceChildren();
    recompensas.forEach(function (r) {
      var desbloqueada = mejor >= r.dias;
      var canjeada = estaCanjeada(r);
      var tarjeta = crearElemento("section", "tarjeta" + (desbloqueada ? "" : " tarjeta--bloqueada"));
      var fila = crearElemento("div", "fila alinear-arriba");
      var icono = crearElemento("span", "icono-recuadro" + (desbloqueada ? " icono-recuadro--acento" : ""));
      icono.appendChild(crearIcono(desbloqueada ? "regalo" : "candado"));
      var cuerpo = crearElemento("div", "fila-lista__cuerpo pila");
      cuerpo.appendChild(crearElemento("h3", "titulo-tarjeta", r.titulo));
      cuerpo.appendChild(crearElemento("p", "texto-suave texto-pequeno", r.texto));
      if (canjeada) {
        var etiqueta = crearElemento("span", "etiqueta etiqueta--oscura alinear-inicio");
        etiqueta.appendChild(crearIcono("check", "icono--sm"));
        etiqueta.appendChild(document.createTextNode("Canjeada"));
        cuerpo.appendChild(etiqueta);
      } else if (desbloqueada) {
        var boton = crearElemento("button", "boton boton--pequeno alinear-inicio", "Canjear");
        boton.type = "button";
        boton.addEventListener("click", function () { canjear(r); });
        cuerpo.appendChild(boton);
      } else {
        cuerpo.appendChild(crearElemento("span", "texto-suave texto-pequeno", "Se desbloquea con " + r.dias + " días de racha. Te faltan " + (r.dias - mejor) + "."));
      }
      fila.appendChild(icono);
      fila.appendChild(cuerpo);
      tarjeta.appendChild(fila);
      lista.appendChild(tarjeta);
    });
    var consejo = recompensas.filter(function (r) { return r.tipo === "consejo"; })[0];
    botonConsejo.hidden = !(consejo && estaCanjeada(consejo));
  }

  pintarPro();
  pintarRecompensas();
}


/* ---------- Pantalla: pages/meta-detalle.html (F2.3) ---------- */

/* Hace que un campo de monto se escriba con formato de pesos: $ 1.500.000 */
function conectarMontoEnPesos(campo) {
  campo.addEventListener("input", function () {
    var numeros = soloNumeros(campo.value);
    campo.value = numeros ? "$ " + conPuntos(numeros) : "";
  });
}

/* Muestra un aviso corto dentro de la página y lo quita a los 4 segundos */
var temporizadorAviso = null;
function mostrarAvisoTemporal(contenedor, textoAviso) {
  contenedor.querySelector("span").textContent = textoAviso;
  contenedor.hidden = false;
  window.clearTimeout(temporizadorAviso);
  temporizadorAviso = window.setTimeout(function () { contenedor.hidden = true; }, 4000);
}

function pantallaMetaDetalle() {
  var metas = obtenerDatos("metas");

  /* Qué meta se muestra: la del ?id= del link o, si no trae id, la meta activa
     (la primera que todavía no está cumplida, igual que en Inicio). */
  var idPedido = new URLSearchParams(window.location.search).get("id");
  var meta = idPedido
    ? metas.filter(function (m) { return String(m.id) === idPedido; })[0]
    : (metas.filter(function (m) { return m.ahorrado < m.montoObjetivo; })[0] || metas[0]);

  var pasoMeta = document.getElementById("paso-meta");
  var pasoCelebracion = document.getElementById("paso-celebracion");
  var pasoNoEncontrada = document.getElementById("paso-no-encontrada");

  if (!meta) {
    pasoNoEncontrada.hidden = false;
    return;
  }

  var formularioAbono = document.getElementById("formulario-abono");
  var formularioAjuste = document.getElementById("formulario-ajuste");
  var botonAjustar = document.getElementById("boton-ajustar");
  var campoAbono = document.getElementById("campo-abono");
  var errorAbono = document.getElementById("error-abono");
  var campoNombre = document.getElementById("campo-ajuste-nombre");
  var campoObjetivo = document.getElementById("campo-ajuste-objetivo");
  var alertaAjuste = document.getElementById("alerta-ajuste");
  var aviso = document.getElementById("aviso-meta");

  function cumplida() { return meta.ahorrado >= meta.montoObjetivo; }
  function guardarMetas() { guardarDatos("metas", metas); }

  /* --- Lo que se calcula con la meta --- */
  function pintarMeta() {
    var faltan = Math.max(0, meta.montoObjetivo - meta.ahorrado);
    var porcentaje = Math.min(100, Math.round(meta.ahorrado / meta.montoObjetivo * 100));
    document.getElementById("meta-nombre").textContent = meta.nombre;
    document.getElementById("meta-faltan").textContent = "Te faltan " + pesos(faltan);
    document.getElementById("meta-porcentaje").textContent = porcentaje + "%";
    document.getElementById("meta-ahorrado").textContent = pesos(meta.ahorrado);
    document.getElementById("meta-objetivo").textContent = "de " + pesos(meta.montoObjetivo);
    var barra = document.getElementById("meta-barra");
    barra.style.setProperty("--progreso", porcentaje + "%");
    barra.setAttribute("aria-label", "Llevas el " + porcentaje + "% de tu meta");
  }

  function mostrarCelebracion() {
    document.getElementById("celebracion-texto").textContent = 'Completaste "' + meta.nombre + '" con ' + pesos(meta.ahorrado) + ".";
    pasoMeta.hidden = true;
    pasoCelebracion.hidden = false;
    window.scrollTo(0, 0);
  }

  function mostrarAjuste(abierto) {
    formularioAjuste.hidden = !abierto;
    formularioAbono.hidden = abierto;
    botonAjustar.hidden = abierto;
    alertaAjuste.hidden = true;
    if (abierto) {
      campoNombre.value = meta.nombre;
      campoObjetivo.value = "$ " + conPuntos(String(meta.montoObjetivo));
      campoNombre.focus();
    }
  }

  conectarMontoEnPesos(campoAbono);
  conectarMontoEnPesos(campoObjetivo);

  /* --- Abonar --- */
  campoAbono.addEventListener("input", function () {
    if (Number(soloNumeros(campoAbono.value)) > 0) {
      errorAbono.hidden = true;
      campoAbono.setAttribute("aria-invalid", "false");
    }
  });

  formularioAbono.addEventListener("submit", function (e) {
    e.preventDefault();
    var abono = Number(soloNumeros(campoAbono.value));
    if (abono <= 0) {
      errorAbono.hidden = false;
      campoAbono.setAttribute("aria-invalid", "true");
      campoAbono.setAttribute("aria-describedby", "error-abono");
      campoAbono.focus();
      return;
    }
    errorAbono.hidden = true;
    campoAbono.setAttribute("aria-invalid", "false");
    campoAbono.value = "";
    meta.ahorrado += abono;
    guardarMetas();
    if (cumplida()) { mostrarCelebracion(); return; }
    pintarMeta();
    mostrarAvisoTemporal(aviso, "Abono registrado");
  });

  /* --- Ajustar nombre y valor objetivo --- */
  botonAjustar.addEventListener("click", function () { mostrarAjuste(true); });
  document.getElementById("boton-cancelar-ajuste").addEventListener("click", function () { mostrarAjuste(false); });

  formularioAjuste.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = campoNombre.value.trim();
    var objetivo = Number(soloNumeros(campoObjetivo.value));
    if (nombre.length < 2 || objetivo <= 0) {
      alertaAjuste.hidden = false;
      return;
    }
    meta.nombre = nombre;
    meta.montoObjetivo = objetivo;
    guardarMetas();
    mostrarAjuste(false);
    if (cumplida()) { mostrarCelebracion(); return; }
    pintarMeta();
    mostrarAvisoTemporal(aviso, "Meta actualizada");
  });

  /* --- Al abrir --- */
  pintarMeta();
  if (cumplida()) {
    mostrarCelebracion();
  } else {
    pasoMeta.hidden = false;
    if (window.location.hash === "#editar") mostrarAjuste(true);
  }
}


/* ---------- Dictado: entender una frase como "gasté 15 mil en almuerzo" ---------- */

var NUMEROS_EN_PALABRAS = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, quince: 15, veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50 };
var MULTIPLICADORES = { mil: 1e3, luca: 1e3, lucas: 1e3, k: 1e3, millon: 1e6, "millón": 1e6, millones: 1e6, palo: 1e6, palos: 1e6 };

/* Palabras que delatan la categoría (si ninguna aparece, es "Otro") */
var PALABRAS_CATEGORIA = [
  ["Comida", /almuerzo|comida|desayuno|cena|restaurante|mercado|caf[eé]|pizza|hamburguesa|domicilio|empanada|snack|jugo|helado|tienda/],
  ["Transporte", /transporte|bus|taxi|uber|didi|transmilenio|gasolina|metro|pasaje|moto|peaje|parqueadero|sitp/],
  ["Salidas", /salidas?|cine|fiesta|cerveza|trago|concierto|salida|discoteca|bar\b|rumba|paseo/],
  ["Compras", /compras?\b|ropa|zapatos|tenis|compr[eé]|camiseta|regalo|maquillaje|aud[ií]fonos/],
  ["Educación", /educaci[oó]n|libro|matr[ií]cula|curso|universidad|fotocopias|semestre|taller/]
];

/* Busca el monto en la frase: "15 mil", "$ 8.500", "dos lucas", "1,5 millones"... */
function leerMontoDeFrase(texto) {
  var limpio = texto.replace(/\$/g, " ");
  while (/(\d)[.,](\d{3})(?!\d)/.test(limpio)) limpio = limpio.replace(/(\d)[.,](\d{3})(?!\d)/g, "$1$2");
  var encontrado = limpio.match(/(\d+(?:[.,]\d+)?)\s*(millones|mill[oó]n|mil|lucas?|k|palos?)?(?![a-záéíóúA-ZÁÉÍÓÚ])/i);
  if (encontrado) {
    var valor = parseFloat(encontrado[1].replace(",", "."));
    var factor = encontrado[2] ? MULTIPLICADORES[encontrado[2].toLowerCase()] : 1;
    return { monto: Math.round(valor * factor), encontrado: encontrado[0], limpio: limpio };
  }
  encontrado = limpio.match(/\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|quince|veinte|treinta|cuarenta|cincuenta)\s+(millones|mill[oó]n|mil|lucas?|palos?)\b/i);
  if (encontrado) {
    return { monto: NUMEROS_EN_PALABRAS[encontrado[1].toLowerCase()] * MULTIPLICADORES[encontrado[2].toLowerCase()], encontrado: encontrado[0], limpio: limpio };
  }
  return { monto: null, encontrado: "", limpio: limpio };
}

/* Frase -> { monto, categoria, nota, cuando }. Si no hay monto, "monto" es null. */
function entenderFrase(texto) {
  var frase = String(texto || "").trim();
  var cuando = /\bayer\b/i.test(frase) ? "ayer" : "hoy";
  var sinDia = frase.replace(/\b(ayer|hoy)\b/gi, " ").replace(/\s+/g, " ").trim();
  var lectura = leerMontoDeFrase(sinDia);

  var categoria = "Otro";
  for (var i = 0; i < PALABRAS_CATEGORIA.length; i++) {
    if (PALABRAS_CATEGORIA[i][1].test(sinDia.toLowerCase())) { categoria = PALABRAS_CATEGORIA[i][0]; break; }
  }

  var nota = lectura.encontrado ? lectura.limpio.replace(lectura.encontrado, " ") : lectura.limpio;
  nota = nota.replace(/\s+/g, " ").trim();
  var anterior;
  do {
    anterior = nota;
    nota = nota.replace(/^(gast[eé]|pagu[eé]|compr[eé]|me cost[oó]|fueron|fue|son|en|de|por|para|pesos|el|la|un|una)\s+/i, "").replace(/[,.]+$/, "").trim();
  } while (nota !== anterior);
  nota = nota ? nota.charAt(0).toUpperCase() + nota.slice(1) : "";

  return { monto: lectura.monto, categoria: categoria, nota: nota, cuando: cuando };
}


/* ---------- Pantalla: pages/registrar-gasto.html (F1.4, F1.4b y F1.5) ---------- */

function pantallaRegistrarGasto() {
  var categorias = obtenerDatos("categorias");
  var opcionesCuando = obtenerDatos("cuando");

  var pasoFormulario = document.getElementById("paso-formulario");
  var pasoGuardado = document.getElementById("paso-guardado");
  var campoMonto = document.getElementById("campo-monto");
  var contenedorMonto = document.getElementById("contenedor-monto");
  var campoNota = document.getElementById("campo-nota");
  var errorCategoria = document.getElementById("error-categoria");
  var alertaMonto = document.getElementById("alerta-monto");
  var chipsCategoria = document.getElementById("chips-categoria");
  var chipsCuando = document.getElementById("chips-cuando");
  var chipsRecientes = document.getElementById("chips-recientes");
  var confirmar = document.getElementById("confirmar-monto");
  var botonGrabar = document.getElementById("boton-grabar");
  var textoGrabar = document.getElementById("boton-grabar-texto");
  var ayudaVoz = document.getElementById("ayuda-voz");
  var avisoDictado = document.getElementById("aviso-dictado");

  var categoria = "";
  var cuando = "hoy";
  var gastoPendiente = null;     /* gasto que espera el "¿Está bien?" */

  /* --- Chips de categoría y de cuándo --- */
  function marcarUno(contenedor, valor) {
    Array.prototype.forEach.call(contenedor.children, function (chip) {
      marcarChip(chip, chip.getAttribute("data-valor") === valor);
    });
  }
  function elegirCategoria(nombre) {
    categoria = nombre;
    marcarUno(chipsCategoria, nombre);
    if (nombre) errorCategoria.hidden = true;
  }
  function elegirCuando(id) {
    cuando = id;
    marcarUno(chipsCuando, id);
  }

  categorias.forEach(function (c) {
    var estilo = ESTILO_CATEGORIA[c.nombre] || ESTILO_CATEGORIA["Otro"];
    var chip = crearElemento("button", "chip");
    chip.type = "button";
    chip.setAttribute("data-valor", c.nombre);
    chip.appendChild(crearIcono(estilo.icono, "icono--sm"));
    chip.appendChild(document.createTextNode(c.nombre));
    marcarChip(chip, false);
    chip.addEventListener("click", function () { elegirCategoria(c.nombre); });
    chipsCategoria.appendChild(chip);
  });

  opcionesCuando.forEach(function (o) {
    var chip = crearElemento("button", "chip", o.nombre);
    chip.type = "button";
    chip.setAttribute("data-valor", o.id);
    chip.addEventListener("click", function () { elegirCuando(o.id); });
    chipsCuando.appendChild(chip);
  });
  elegirCuando("hoy");

  /* --- Repetir uno reciente: hasta 3 gastos distintos, el más nuevo primero --- */
  var vistos = {};
  var recientes = [];
  obtenerDatos("gastos").slice().sort(function (a, b) {
    return (b.dia + b.creado).localeCompare(a.dia + a.creado);
  }).forEach(function (g) {
    var clave = g.nota + "|" + g.monto + "|" + g.categoria;
    if (recientes.length < 3 && !vistos[clave]) { vistos[clave] = true; recientes.push(g); }
  });
  document.getElementById("grupo-recientes").hidden = recientes.length === 0;
  recientes.forEach(function (g) {
    var estilo = ESTILO_CATEGORIA[g.categoria] || ESTILO_CATEGORIA["Otro"];
    var chip = crearElemento("button", "chip");
    chip.type = "button";
    chip.appendChild(crearIcono(estilo.icono, "icono--sm"));
    chip.appendChild(document.createTextNode(g.nota + " · " + pesos(g.monto)));
    marcarChip(chip, false);
    chip.addEventListener("click", function () {
      Array.prototype.forEach.call(chipsRecientes.children, function (otro) { marcarChip(otro, otro === chip); });
      campoMonto.value = conPuntos(String(g.monto));
      campoNota.value = g.nota;
      elegirCategoria(g.categoria);
      elegirCuando("hoy");
      mostrarErrorMonto(false);
    });
    chipsRecientes.appendChild(chip);
  });

  /* --- Monto con puntos: 15.000 --- */
  campoMonto.addEventListener("input", function () {
    var numeros = soloNumeros(campoMonto.value);
    campoMonto.value = numeros ? conPuntos(numeros) : "";
    if (Number(numeros) > 0) mostrarErrorMonto(false);
  });

  function montoEscrito() { return Number(soloNumeros(campoMonto.value)); }

  function mostrarErrorMonto(hay) {
    contenedorMonto.classList.toggle("campo-monto--error", hay);
    campoMonto.setAttribute("aria-invalid", hay ? "true" : "false");
    if (hay) campoMonto.setAttribute("aria-describedby", "alerta-monto");
    else campoMonto.removeAttribute("aria-describedby");
    alertaMonto.hidden = !hay;
  }

  function ocultarConfirmacion() {
    confirmar.hidden = true;
    gastoPendiente = null;
  }

  /* --- Escribir y grabar audio --- */
  document.getElementById("boton-escribir").addEventListener("click", function () { campoMonto.focus(); });

  function avisarDictado(tipo, texto) {
    avisoDictado.className = "alerta alerta--" + tipo;
    document.getElementById("aviso-dictado-icono").replaceChildren(crearIcono(tipo === "exito" ? "circuloCheck" : "alerta"));
    document.getElementById("aviso-dictado-texto").textContent = texto;
    avisoDictado.hidden = false;
  }

  /* Pone en el formulario lo que se entendió de la frase dictada */
  function aplicarFrase(frase) {
    var entendido = entenderFrase(frase);
    if (!entendido.monto) {
      avisarDictado("aviso", 'No pude entender el monto. Prueba con "gasté 15 mil en almuerzo" o escríbelo abajo.');
      return;
    }
    campoMonto.value = conPuntos(String(entendido.monto));
    campoNota.value = entendido.nota;
    elegirCategoria(entendido.categoria);
    elegirCuando(entendido.cuando);
    mostrarErrorMonto(false);
    ocultarConfirmacion();
    avisarDictado("exito", 'Entendí: "' + frase + '". Revisa los datos de abajo y guarda.');
  }

  var reconocimiento = null;
  var escuchando = false;

  function pintarGrabar() {
    botonGrabar.classList.toggle("boton-modo--principal", !escuchando);
    botonGrabar.classList.toggle("boton-modo--grabando", escuchando);
    textoGrabar.textContent = escuchando ? "Te escucho… toca para parar" : "Grabar audio";
    ayudaVoz.hidden = escuchando;
  }

  /* El navegador decide si hay dictado: se mira al tocar el botón */
  function hayDictado() { return window.SpeechRecognition || window.webkitSpeechRecognition; }

  if (!hayDictado()) {
    botonGrabar.hidden = true;
    ayudaVoz.hidden = true;
    avisarDictado("aviso", "Tu navegador no permite dictado por voz. Escribe el gasto abajo.");
  }

  botonGrabar.addEventListener("click", function () {
    var Reconocedor = hayDictado();
    if (!Reconocedor) return;
    if (escuchando) { reconocimiento.stop(); return; }
    reconocimiento = new Reconocedor();
    reconocimiento.lang = "es-CO";
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;
    reconocimiento.onresult = function (e) { aplicarFrase(e.results[0][0].transcript); };
    reconocimiento.onerror = function () {
      escuchando = false;
      pintarGrabar();
      avisarDictado("aviso", "No pude escucharte. Revisa el permiso del micrófono o escríbelo abajo.");
    };
    reconocimiento.onend = function () { escuchando = false; pintarGrabar(); };
    avisoDictado.hidden = true;
    escuchando = true;
    pintarGrabar();
    reconocimiento.start();
  });

  /* --- Guardar --- */
  function validar() {
    var sinMonto = montoEscrito() <= 0;
    var sinCategoria = !categoria;
    mostrarErrorMonto(sinMonto);
    errorCategoria.hidden = !sinCategoria;
    if (sinMonto) campoMonto.focus();
    return !sinMonto && !sinCategoria;
  }

  function etiquetaDia(clave) {
    var hoy = new Date();
    if (clave === diaHaceN(hoy, 0).clave) return "Hoy";
    if (clave === diaHaceN(hoy, 1).clave) return "Ayer";
    return clave;
  }

  function guardarGasto(gasto) {
    var gastos = obtenerDatos("gastos");
    gasto.id = gastos.reduce(function (mayor, g) { return Math.max(mayor, g.id); }, 0) + 1;
    gastos.push(gasto);
    guardarDatos("gastos", gastos);
    window.history.replaceState(null, "", "#guardado");
    mostrarGuardado(gasto);
  }

  pasoFormulario.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarConfirmacion();
    if (!validar()) return;
    var hoy = new Date();
    var gasto = {
      nota: campoNota.value.trim() || categoria,
      monto: montoEscrito(),
      categoria: categoria,
      dia: diaHaceN(hoy, cuando === "ayer" ? 1 : 0).clave,
      creado: hoy.toISOString()
    };
    var ingreso = obtenerDatos("perfil")[0].ingresoMensual;
    if (ingreso > 0 && gasto.monto > ingreso) {
      gastoPendiente = gasto;
      document.getElementById("confirmar-texto").textContent = "Escribiste " + pesos(gasto.monto) + " y tus ingresos son " + pesos(ingreso) + ". ¿Está bien?";
      confirmar.hidden = false;
      confirmar.scrollIntoView({ block: "center" });
      return;
    }
    guardarGasto(gasto);
  });

  document.getElementById("boton-corregir").addEventListener("click", function () {
    ocultarConfirmacion();
    campoMonto.focus();
  });
  document.getElementById("boton-confirmar").addEventListener("click", function () {
    var gasto = gastoPendiente;
    ocultarConfirmacion();
    if (gasto) guardarGasto(gasto);
  });

  /* --- Gasto guardado y racha (F1.5) --- */
  function mostrarFormulario() {
    pasoGuardado.hidden = true;
    pasoFormulario.hidden = false;
    window.scrollTo(0, 0);
  }

  function mostrarGuardado(gasto) {
    var hoy = new Date();
    var todos = obtenerDatos("gastos");
    var despues = calcularRacha(todos, hoy);
    var antes = calcularRacha(todos.filter(function (g) { return g.id !== gasto.id; }), hoy);

    var estilo = ESTILO_CATEGORIA[gasto.categoria] || ESTILO_CATEGORIA["Otro"];
    var resumen = document.getElementById("resumen-gasto");
    var icono = crearElemento("span", "icono-recuadro icono-recuadro--categoria icono-recuadro--" + estilo.clase);
    icono.appendChild(crearIcono(estilo.icono));
    var cuerpo = crearElemento("span", "fila-lista__cuerpo");
    cuerpo.appendChild(crearElemento("span", "fila-lista__titulo", gasto.nota));
    cuerpo.appendChild(crearElemento("span", "texto-suave texto-pequeno", gasto.categoria + " · " + etiquetaDia(gasto.dia)));
    resumen.replaceChildren(icono, cuerpo, crearElemento("span", "fila-lista__importe", pesos(gasto.monto)));

    document.getElementById("racha-titulo").textContent = "Racha actual: " + despues.racha + (despues.racha === 1 ? " día" : " días");
    pintarSemana(document.getElementById("racha-dias"), despues.semana);

    /* Recompensas que este gasto acaba de desbloquear (y que no se han canjeado) */
    var canjeadas = obtenerDatos("canjeadas").map(function (c) { return c.recompensaId; });
    var nuevas = obtenerDatos("recompensas").filter(function (r) {
      return r.dias > antes.racha && r.dias <= despues.racha && canjeadas.indexOf(r.id) === -1;
    });
    var zona = document.getElementById("recompensas-nuevas");
    zona.replaceChildren();
    nuevas.forEach(function (r) {
      var alerta = crearElemento("div", "alerta alerta--exito");
      alerta.setAttribute("role", "status");
      alerta.appendChild(crearIcono("circuloCheck"));
      alerta.appendChild(crearElemento("span", "", "Desbloqueaste una recompensa: " + r.titulo + "."));
      zona.appendChild(alerta);
    });
    document.getElementById("boton-recompensa").hidden = nuevas.length === 0;

    document.getElementById("boton-deshacer").onclick = function () {
      guardarDatos("gastos", obtenerDatos("gastos").filter(function (g) { return g.id !== gasto.id; }));
      window.history.replaceState(null, "", window.location.pathname);
      mostrarFormulario();
      var aviso = document.getElementById("aviso-deshecho");
      aviso.hidden = false;
      window.setTimeout(function () { aviso.hidden = true; }, 4000);
    };

    pasoFormulario.hidden = true;
    pasoGuardado.hidden = false;
    window.scrollTo(0, 0);
  }

  document.getElementById("boton-otro").addEventListener("click", function () {
    campoMonto.value = "";
    campoNota.value = "";
    elegirCategoria("");
    elegirCuando("hoy");
    mostrarErrorMonto(false);
    errorCategoria.hidden = true;
    avisoDictado.hidden = true;
    window.history.replaceState(null, "", window.location.pathname);
    mostrarFormulario();
    campoMonto.focus();
  });

  /* Al abrir: registrar-gasto.html#error muestra los errores y #guardado el último gasto */
  var pedido = window.location.hash.replace("#", "");
  if (pedido === "error") {
    validar();
  } else if (pedido === "guardado") {
    var ultimo = obtenerDatos("gastos").slice().sort(function (a, b) {
      return (b.dia + b.creado).localeCompare(a.dia + a.creado);
    })[0];
    if (ultimo) mostrarGuardado(ultimo);
  }
}


/* ---------- Arranque: cada página ejecuta solo la función de su pantalla ---------- */

var PANTALLAS = {
  "index": pantallaIndex,
  "inicio": pantallaInicio,
  "registrar-gasto": pantallaRegistrarGasto,
  "meta-detalle": pantallaMetaDetalle,
  "racha": pantallaRacha,
  "copiloto": pantallaCopiloto,
  "foro": pantallaForo,
  "foro-detalle": pantallaForoDetalle,
  "foro-nueva": pantallaForoNueva,
  "avisos": pantallaAvisos
};

document.addEventListener("DOMContentLoaded", function () {
  entregarPendientes();     /* lo que ya le tocaba llegar (aunque la persona haya cambiado de pantalla) */
  programarEntregas();      /* y lo que todavía falta, para cuando le toque */
  var nombre = document.body.getAttribute("data-pantalla");
  if (PANTALLAS[nombre]) PANTALLAS[nombre]();
});
