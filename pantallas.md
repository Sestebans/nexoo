# Pantallas de NEXO

El mapa de avance de la app: una fila por pantalla del `spec.md`, agrupadas por tramo del flujo.

**Cómo leer las columnas**
- **Separada:** la pantalla ya tiene su propia página y se ve igual que en `disenos/prototipo.html`.
- **Con kit:** la pantalla ya usa solo el design kit (`tokens.css` y `components.css`) y ya no depende de `css/prototipo.css`.
- **Datos en data.js:** los datos de la pantalla ya salen de `js/data.js` y no están escritos en el HTML.
- **Revisada vs spec:** alguien comparó la pantalla con su sección de `spec.md` y cumple su "Está lista cuando".

**Estados dentro de una página.** Varias pantallas del spec comparten página, igual que en el prototipo. Se llega al estado con un `#` al final del link (por ejemplo `pages/registrar-gasto.html#error`). Los estados de cada pantalla ya cambian con los botones de la página.

**Marcas:** ✅ hecho · ⬜ pendiente

## Tramo 1 · Onboarding y registro

| Pantalla | Archivo | Separada | Con kit | Datos en data.js | Revisada vs spec |
|---|---|---|---|---|---|
| F1.1 Carrusel de bienvenida | `index.html` | ✅ | ✅ | ✅ | ✅ |
| F1.2 Situación inicial | `index.html#situacion` | ✅ | ✅ | ✅ | ✅ |
| F1.2b Campos pendientes | `index.html#pendientes` | ✅ | ✅ | ✅ | ✅ |
| F1.3 Inicio | `pages/inicio.html` | ✅ | ✅ | ✅ | ✅ |

## Tramo 2 · Registrar un gasto

| Pantalla | Archivo | Separada | Con kit | Datos en data.js | Revisada vs spec |
|---|---|---|---|---|---|
| F1.4 Registrar gasto | `pages/registrar-gasto.html` | ✅ | ✅ | ✅ | ✅ |
| F1.4b Error de registro | `pages/registrar-gasto.html#error` | ✅ | ✅ | ✅ | ✅ |
| F1.5 Gasto guardado y racha | `pages/registrar-gasto.html#guardado` | ✅ | ✅ | ✅ | ✅ |

## Tramo 3 · Copiloto IA

| Pantalla | Archivo | Separada | Con kit | Datos en data.js | Revisada vs spec |
|---|---|---|---|---|---|
| F2.1 Chat con el copiloto | `pages/copiloto.html` | ✅ | ✅ | ✅ | ✅ |
| F2.1b Información insuficiente | `pages/copiloto.html#insuficiente` | ✅ | ✅ | ✅ | ✅ |
| F2.2 Respuesta con acción sugerida | `pages/copiloto.html#meta` | ✅ | ✅ | ✅ | ✅ |
| F2.3 Meta: detalle, abono y ajuste | `pages/meta-detalle.html` (ajuste: `#editar`) | ✅ | ✅ | ✅ | ✅ |
| F2.4 Racha y recompensas | `pages/racha.html` | ✅ | ✅ | ✅ | ✅ |

## Tramo 4 · Comunidad

| Pantalla | Archivo | Separada | Con kit | Datos en data.js | Revisada vs spec |
|---|---|---|---|---|---|
| F3.1 Feed de preguntas | `pages/foro.html` | ✅ | ✅ | ✅ | ✅ |
| F3.2 Detalle de pregunta | `pages/foro-detalle.html` (`#seed1`, `#seed2`, `#seed3`) | ✅ | ⬜ | ⬜ | ⬜ |
| F3.3 Escribir pregunta nueva | `pages/foro-nueva.html` | ✅ | ⬜ | ⬜ | ⬜ |
| F3.3b Pregunta no válida | `pages/foro-nueva.html#invalida` | ✅ | ⬜ | ⬜ | ⬜ |
| F3.4 Pregunta publicada y aviso de respuesta | `pages/foro-nueva.html#publicada` y `pages/avisos.html#con-aviso` | ✅ | ⬜ | ⬜ | ⬜ |

## Tramo 5 · Otras pantallas

| Pantalla | Archivo | Separada | Con kit | Datos en data.js | Revisada vs spec |
|---|---|---|---|---|---|
| Lista de gastos (editar y eliminar) | `pages/gastos.html` (`#editar`, `#eliminar`) | ✅ | ⬜ | ⬜ | ⬜ |
| Metas | `pages/metas.html` | ✅ | ⬜ | ⬜ | ⬜ |
| Crear meta | `pages/crear-meta.html` | ✅ | ⬜ | ⬜ | ⬜ |
| Perfil | `pages/perfil.html` | ✅ | ⬜ | ⬜ | ⬜ |
| Avisos | `pages/avisos.html` | ✅ | ⬜ | ⬜ | ⬜ |
