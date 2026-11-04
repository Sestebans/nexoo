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


/* ---------- Arranque: cada página ejecuta solo la función de su pantalla ---------- */

var PANTALLAS = {
  "index": pantallaIndex
};

document.addEventListener("DOMContentLoaded", function () {
  var nombre = document.body.getAttribute("data-pantalla");
  if (PANTALLAS[nombre]) PANTALLAS[nombre]();
});
