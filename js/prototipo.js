/* Andamio temporal: se borra cuando todas las pantallas usen el design kit y app.js */
/*
  Este archivo hace que las páginas copiadas del prototipo se sientan como el diseño:
  - Algunas pantallas tienen varios "estados" (por ejemplo el formulario, el error y el
    "gasto guardado"). Cada estado es un <div data-estado="..."> y aquí se muestra uno a la vez.
  - Los botones con data-ir-estado cambian de estado. Los botones con data-accion hacen algo más.
  - Todo es JavaScript puro, sin librerías.
*/
(function () {
  'use strict';

  var raiz = document.getElementById('root');
  if (!raiz) return;

  // ---------- Guardado en el navegador (con try/catch por si está bloqueado) ----------
  function leer(clave) { try { return window.localStorage.getItem(clave); } catch (e) { return null; } }
  function guardar(clave, valor) { try { window.localStorage.setItem(clave, valor); } catch (e) { /* sin guardado */ } }

  // ---------- Paleta de colores ----------
  function aplicarPaleta(nombre) {
    var html = document.documentElement;
    if (!nombre || nombre === 'lima') html.removeAttribute('data-palette');
    else html.setAttribute('data-palette', nombre);
  }
  aplicarPaleta(leer('nexo:palette'));

  function marcarPaleta() {
    var actual = leer('nexo:palette') || 'lima';
    var opciones = raiz.querySelectorAll('[data-accion="paleta"]');
    for (var i = 0; i < opciones.length; i++) {
      opciones[i].setAttribute('aria-pressed', opciones[i].getAttribute('data-paleta') === actual ? 'true' : 'false');
    }
  }
  marcarPaleta();

  // ---------- Estados de una pantalla ----------
  function estados() { return raiz.querySelectorAll('[data-estado]'); }
  function estadoVisible() { return raiz.querySelector('[data-estado]:not([hidden])'); }

  // Al cambiar de estado, lo que la persona escribió o eligió pasa al nuevo estado.
  function copiarDatos(desde, hacia) {
    var a = desde.querySelectorAll('input, textarea'), b = hacia.querySelectorAll('input, textarea');
    if (a.length === b.length) for (var i = 0; i < a.length; i++) b[i].value = a[i].value;
    var ca = desde.querySelectorAll('.chip'), cb = hacia.querySelectorAll('.chip');
    if (ca.length === cb.length) {
      for (var j = 0; j < ca.length; j++) {
        var activo = ca[j].classList.contains('on');
        cb[j].classList.toggle('on', activo);
        if (cb[j].hasAttribute('aria-pressed')) cb[j].setAttribute('aria-pressed', activo ? 'true' : 'false');
      }
    }
  }

  function mostrar(nombre, conservar) {
    var destino = raiz.querySelector('[data-estado="' + nombre + '"]');
    if (!destino) return false;
    var actual = estadoVisible();
    if (actual && actual !== destino && conservar !== false) copiarDatos(actual, destino);
    var todos = estados();
    for (var i = 0; i < todos.length; i++) todos[i].hidden = todos[i] !== destino;
    window.scrollTo(0, 0);
    return true;
  }

  // Al abrir la página: si el link trae #estado (por ejemplo meta-detalle.html#editar), se muestra ese.
  (function estadoInicial() {
    var pedido = window.location.hash.replace('#', '');
    if (pedido && mostrar(pedido, false)) return;
    if (document.body.getAttribute('data-pagina') === 'avisos' && leer('nexo:aviso') === '1') mostrar('con-aviso', false);
  })();

  // ---------- Montos con formato: $ 1.500.000 ----------
  function soloNumeros(texto) { return String(texto || '').replace(/\D/g, '').slice(0, 10); }
  function conPuntos(numeros) { return numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  raiz.addEventListener('input', function (e) {
    var campo = e.target;
    if (campo.tagName !== 'INPUT' || campo.getAttribute('inputmode') !== 'numeric') return;
    var n = soloNumeros(campo.value);
    var conSimbolo = (campo.getAttribute('placeholder') || '').charAt(0) === '$';
    campo.value = n ? (conSimbolo ? '$ ' : '') + conPuntos(n) : '';
  });

  // ---------- Acciones ----------
  function textoChipActivo(contenedor, palabraDelGrupo) {
    var chips = contenedor.querySelectorAll('.chip');
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].textContent.trim() !== palabraDelGrupo) continue;
      var grupo = chips[i].parentElement.querySelectorAll('.chip');
      for (var j = 0; j < grupo.length; j++) if (grupo[j].classList.contains('on')) return grupo[j].textContent.trim();
      return null;
    }
    return null;
  }

  var acciones = {
    // Varias opciones a la vez (cómo maneja su plata)
    'chip-multi': function (boton) {
      var activo = !boton.classList.contains('on');
      boton.classList.toggle('on', activo);
      if (boton.hasAttribute('aria-pressed')) boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
    },

    // Una sola opción dentro de su grupo (categoría, cuándo, filtros)
    'chip-unico': function (boton) {
      var grupo = boton.parentElement.querySelectorAll('.chip');
      for (var i = 0; i < grupo.length; i++) {
        grupo[i].classList.remove('on');
        if (grupo[i].hasAttribute('aria-pressed')) grupo[i].setAttribute('aria-pressed', 'false');
      }
      boton.classList.add('on');
      if (boton.hasAttribute('aria-pressed')) boton.setAttribute('aria-pressed', 'true');
    },

    // Ideas de meta (Moto, Viaje...): se marca una y se escribe su nombre en el campo
    'chip-meta': function (boton) {
      acciones['chip-unico'](boton);
      var campo = estadoVisible().querySelector('input:not([inputmode])');
      if (campo) campo.value = boton.textContent.trim();
    },

    // Situación inicial: si falta algo, aparece "Campos pendientes"; si no, se entra a Inicio
    'continuar': function () {
      var estado = estadoVisible();
      var campos = estado.querySelectorAll('input');
      var falta = !soloNumeros(campos[0] && campos[0].value) || !soloNumeros(campos[2] && campos[2].value);
      if (falta) { mostrar('pendientes'); return; }
      window.location.href = 'pages/inicio.html';
    },

    // Registrar gasto: monto mayor a cero o aparece el error
    'guardar-gasto': function () {
      var estado = estadoVisible();
      var campos = estado.querySelectorAll('input');
      var monto = Number(soloNumeros(campos[0] && campos[0].value) || 0);
      if (monto <= 0) { mostrar('error'); return; }
      var categoria = textoChipActivo(estado, 'Comida') || 'Comida';
      var cuando = textoChipActivo(estado, 'Hoy') || 'Hoy';
      var nota = (campos[1] && campos[1].value.trim()) || categoria;
      mostrar('guardado');
      var guardado = estadoVisible();
      var pon = function (nombre, texto) {
        var lugar = guardado.querySelector('[data-rellena="' + nombre + '"]');
        if (lugar) lugar.textContent = texto;
      };
      pon('nota', nota); pon('categoria', categoria); pon('cuando', cuando);
      pon('monto', '$ ' + conPuntos(String(monto)));
      var icono = guardado.querySelector('[data-cat]');
      if (icono) icono.setAttribute('data-cat', categoria);
    },

    // Escribir pregunta: sin enlaces ni teléfonos
    'publicar': function () {
      var estado = estadoVisible();
      var area = estado.querySelector('textarea');
      var texto = area ? area.value.trim() : '';
      if (!texto) return;
      var conEnlace = /https?:\/\/|www\.|\.com|\.co\b/i.test(texto);
      var conTelefono = /\d[\d\s\-]{6,}\d/.test(texto);
      if (conEnlace || conTelefono) { mostrar('invalida'); return; }
      guardar('nexo:aviso', '1');
      mostrar('publicada');
      var lugar = estadoVisible().querySelector('[data-rellena="pregunta"]');
      if (lugar) lugar.textContent = texto;
    },

    // Perfil: elegir paleta de colores
    'paleta': function (boton) {
      var nombre = boton.getAttribute('data-paleta');
      guardar('nexo:palette', nombre);
      aplicarPaleta(nombre);
      marcarPaleta();
    }
  };

  // Los formularios del prototipo no envían nada a ningún lado: evitamos que la página se recargue.
  raiz.addEventListener('submit', function (e) { e.preventDefault(); });

  raiz.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-ir-estado], [data-accion]') : null;
    if (!el || !raiz.contains(el)) return;
    if (el.hasAttribute('data-ir-estado')) {
      if (el.getAttribute('data-ir-estado') === 'base' && document.body.getAttribute('data-pagina') === 'avisos') {
        guardar('nexo:aviso', '0');
      }
      mostrar(el.getAttribute('data-ir-estado'));
      return;
    }
    var accion = acciones[el.getAttribute('data-accion')];
    if (accion) accion(el);
  });
})();
