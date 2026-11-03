# Spec de NEXO

NEXO, "Tu primer copiloto financiero", es una app para celular que ayuda a jóvenes de 18 a 25 años con ingresos propios a registrar sus gastos, ahorrar y resolver dudas de plata, sin conectar cuentas ni tarjetas.

**Cómo leer las marcas de "Qué funciona de verdad"**
- **Real:** funciona y se guarda. Solo aplica a nuestras integraciones de backend ya hechas: el copiloto con IA y el dictado por voz.
- **Simulado:** se ve y se puede tocar, pero los datos viven solo en el navegador de la persona (hoy en `localStorage`) o son de ejemplo. Aquí también cuenta la navegación entre pantallas.
- **Después:** no entra en el MVP.

**Archivo de diseño:** las 22 pantallas de este documento están en un solo archivo, `disenos/prototipo.html`, y se cambian con rutas internas (por ejemplo `#/gastos/nuevo`).

## Flujo

Inicio es el centro. Desde ahí se llega a registrar gasto, copiloto, metas y comunidad.

1. **Onboarding y registro:** Carrusel de bienvenida → Situación inicial (si faltan campos: Campos pendientes) → Inicio.
2. **Registrar un gasto:** Inicio → Registrar gasto (si hay un error: Error de registro) → Gasto guardado y racha → Inicio.
3. **Copiloto IA:** Inicio → Chat con el copiloto (si hay pocos gastos: Información insuficiente; si pregunta por su meta: Respuesta con acción sugerida) → Meta (detalle) → Racha y recompensas.
4. **Comunidad:** Inicio → Feed de preguntas → Detalle de pregunta, o Escribir pregunta nueva (si no es válida: Pregunta no válida) → Pregunta publicada → Avisos cuando llegue una respuesta.
5. **Otras pantallas:** Lista de gastos, Metas, Crear meta, Perfil y Avisos se alcanzan desde la barra inferior (Inicio, Gastos, Copiloto, Metas, Comunidad) y la barra superior (avisos, racha, perfil).

**Fuera del MVP:** conexión automática a cuentas o tarjetas, categorización automática, y cobro real o freemium.

## Datos

Solo lo que se deduce de los diseños y del flujo.

**Perfil**

| Campo | Detalle |
|---|---|
| ingreso mensual | número, en pesos |
| cómo maneja su plata | lista opcional: Débito, Crédito, Efectivo, Billetera digital |
| onboarding completado | sí o no |
| ocultar montos | sí o no (el ojo de Inicio) |

**Gastos**

| Campo | Detalle |
|---|---|
| nota o descripción | texto; si queda vacía se usa la categoría |
| monto | número mayor que cero |
| categoría | Comida, Transporte, Salidas, Compras, Educación u Otro |
| día | fecha del gasto (Hoy, Ayer u otra al editar) |
| creado | fecha y hora del registro |

**Metas**

| Campo | Detalle |
|---|---|
| nombre | texto, mínimo 2 caracteres |
| monto objetivo | número mayor que cero |
| ahorrado | suma de lo abonado |

**Recompensas**

| Campo | Detalle |
|---|---|
| catálogo | a 3 días: Consejo personalizado. A 7 días: 3 días de NEXO Pro. A 14 días: 7 días de NEXO Pro |
| canjeadas | cuáles recompensas ya canjeó |
| plan Pro | activo o no, y días que le quedan |

**Mensajes del chat**

| Campo | Detalle |
|---|---|
| de | la persona o NEXO |
| texto | mensaje |
| fuente | IA o cálculo local |
| faltan datos | sí o no |
| acción sugerida | texto y meta a la que se refiere |
| resuelta | Mantener meta o Ajustar meta |

**Preguntas del foro**

| Campo | Detalle |
|---|---|
| título y texto | texto |
| categoría | Ahorro, Presupuesto, Crédito, Hábitos, Primer empleo u Otra |
| autor y fecha | quién y cuándo |
| ejemplo | sí o no (marca las preguntas de demostración) |

**Respuestas del foro**

| Campo | Detalle |
|---|---|
| pregunta | a cuál pertenece |
| autor y texto | quién y qué dice |
| útiles | cuántas personas la marcaron como útil |
| marcada por mí | sí o no |
| ejemplo | sí o no |

**Avisos**

| Campo | Detalle |
|---|---|
| texto | qué pasó (por ejemplo, llegó una respuesta) |
| destino | pantalla a la que lleva |
| visto | sí o no |

**Se calcula, no se guarda:** cuánto le queda este mes (ingreso menos gastado), gastado y porcentaje del ingreso, días que faltan, lo que puede gastar al día, total y porcentaje por categoría, categoría que más pesa, meta activa y su porcentaje, racha actual, mejor racha, los 7 días de la semana con gasto, y si hay datos suficientes (3 gastos o más).

## Pantallas

**Orden de construcción:** el mismo del flujo.

### F1.1 Carrusel de bienvenida

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/bienvenida`.
- **Objetivo:** Esta pantalla existe para que una persona nueva pueda entender qué es NEXO y que no pide claves. Sabemos que funciona si llega al formulario sin abandonar.
- **Contenido, en orden de importancia:** 1) la idea de la diapositiva (3 ideas cortas: "Tu plata, sin rodeos", "Registra en segundos", "Un copiloto, no un banco"). 2) Botón Siguiente (en la última dice Empezar). 3) Saltar. 4) Puntos que indican en qué diapositiva va.
- **Qué funciona de verdad:** Siguiente, Empezar, Saltar y los puntos: **Simulado**.
- **Está lista cuando:**
  - Hay 3 diapositivas, cada una con título, texto corto e ilustración.
  - Siguiente avanza, la última dice Empezar y Saltar lleva al formulario.
  - La tercera dice que NEXO nunca pide claves ni conectar cuentas.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.2 Situación inicial

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/bienvenida`, paso 4.
- **Objetivo:** Esta pantalla existe para que una persona nueva pueda dejar listos su ingreso y su primera meta con lo mínimo. Sabemos que funciona si completa el formulario sin errores.
- **Contenido, en orden de importancia:** 1) ingresos mensuales. 2) primera meta: nombre (con ideas rápidas: Moto, Viaje, Celular, Fondo de emergencia, Universidad) y monto. 3) cómo maneja su plata (opcional). 4) aviso de que no se piden claves ni datos de cuentas. 5) Continuar.
- **Qué funciona de verdad:** ingreso, cómo maneja su plata, meta, ideas rápidas, Continuar y Volver: **Simulado** (se guarda solo en el navegador).
- **Está lista cuando:**
  - Se ven los campos de ingreso, meta y monto, y el opcional de cómo maneja su plata.
  - Con datos válidos, Continuar lleva a Inicio.
  - Los números se escriben con formato de pesos (por ejemplo, $ 1.500.000).
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.2b Campos pendientes

- **Archivo de diseño:** `disenos/prototipo.html` (estado de la Situación inicial).
- **Objetivo:** Esta pantalla existe para que la persona pueda ver qué campos le faltan y corregirlos. Sabemos que funciona si completa los campos pendientes y avanza.
- **Está lista cuando:**
  - Arriba aparece el aviso "Completa los campos pendientes para continuar".
  - Cada campo faltante muestra su mensaje debajo (ingreso, nombre de la meta, monto de la meta).
  - Lo que ya escribió se conserva.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.3 Inicio

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/`.
- **Objetivo:** Esta pantalla existe para que una persona pueda saber cuánto le queda este mes y registrar un gasto de hoy. Sabemos que funciona si registra en menos de 15 segundos desde que abre la app (meta por validar).
- **Contenido, en orden de importancia:** 1) "Te quedan este mes" (o "Te pasaste este mes por") y "Puedes gastar al día". 2) botón Registrar gasto de hoy. 3) mensaje de NEXO. 4) racha. 5) meta activa. 6) últimos gastos. No va: accesos repetidos al copiloto.
- **Qué funciona de verdad:**
  - Botón Registrar, Ver racha, Ver metas, Ver todos, campana, perfil y barra inferior: **Simulado**.
  - Ojo para ocultar montos y botón "?" de ayuda: **Simulado**.
  - Mensaje de NEXO: **Simulado** (se calcula con los números de la persona, no pasa por la IA).
- **Está lista cuando:**
  - Se ven "Te quedan este mes", "Puedes gastar al día" y el botón Registrar gasto de hoy.
  - Sin gastos se ven los mensajes de estado vacío ("Registra tu primer gasto de hoy…", "Todavía no has creado una meta").
  - El ojo oculta y muestra los montos.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.4 Registrar gasto

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/gastos/nuevo`.
- **Objetivo:** Esta pantalla existe para que una persona pueda guardar un gasto en pocos segundos sin equivocarse. Sabemos que funciona si lo guarda en menos de 10 segundos y no tiene que corregirlo.
- **Contenido, en orden de importancia:** 1) monto. 2) categoría. 3) botón Guardar gasto. 4) nota (opcional). 5) fecha, Hoy o Ayer. 6) grabar audio o escribir. 7) repetir uno reciente.
- **Qué funciona de verdad:**
  - Grabar audio (dictado por voz): **Real** (usa el navegador, funciona en Chrome y Safari; si no está disponible se muestra el aviso de escribir).
  - Escribir, monto, categoría, nota, Hoy o Ayer, repetir uno reciente, Guardar gasto y Cancelar: **Simulado** (se guardan en el navegador).
- **Está lista cuando:**
  - Se ven monto, categoría, nota, Hoy o Ayer y Guardar gasto.
  - Al decir "gasté 15 mil en almuerzo" se llenan monto, categoría y nota para que la persona confirme.
  - Con un gasto guardado antes aparecen hasta 3 chips de "Repetir uno reciente".
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.4b Error de registro

- **Archivo de diseño:** `disenos/prototipo.html` (estado de Registrar gasto).
- **Objetivo:** Esta pantalla existe para que la persona pueda entender qué falló al registrar y corregirlo. Sabemos que funciona si corrige y guarda el gasto sin abandonar la pantalla.
- **Está lista cuando:**
  - Con monto vacío o cero aparece "Revisa el monto. Debe ser un número mayor a cero." y si falta la categoría muestra "Elige una categoría.".
  - Si NEXO no entiende la frase dictada, avisa y sugiere escribirlo.
  - Si el monto es mayor que el ingreso mensual, pregunta "¿Está bien?" con las opciones Corregir monto y Sí, guardar.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F1.5 Gasto guardado y racha

- **Archivo de diseño:** `disenos/prototipo.html` (estado de Registrar gasto).
- **Objetivo:** Esta pantalla existe para que la persona pueda confirmar que su gasto quedó registrado y ver su racha. Sabemos que funciona si ve el gasto confirmado y, si se equivocó, lo deshace.
- **Está lista cuando:**
  - Se ve el resumen del gasto (nota, categoría, día y monto) y el botón Deshacer.
  - Se ve la racha actual con los 7 días de la semana.
  - Si se desbloquea una recompensa, aparece el aviso y el botón Ver mi recompensa.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F2.1 Chat con el copiloto

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/copiloto`.
- **Objetivo:** Esta pantalla existe para que una persona pueda preguntar sobre su plata y recibir una respuesta con sus números. Sabemos que funciona si hace una segunda pregunta.
- **Contenido, en orden de importancia:** 1) respuesta de NEXO. 2) escribir la pregunta. 3) preguntas sugeridas. 4) aviso de qué datos faltan. 5) aviso de que no se comparten claves ni datos de tarjetas.
- **Qué funciona de verdad:**
  - Enviar pregunta y preguntas sugeridas: **Real** (función de servidor `/api/copilot` que llama a la API de Anthropic; si falla, responde con cálculos locales y lo avisa).
  - Nueva conversación y análisis ampliado con Pro: **Simulado**.
- **Qué viaja a la IA:** ingreso mensual, gastado, disponible, días que faltan, lo que puede gastar al día, hasta 4 categorías con monto y porcentaje, las metas (nombre, objetivo y ahorrado), racha, mejor racha, número de gastos y los últimos 6 mensajes del chat. Nunca viajan las descripciones de los gastos.
- **Está lista cuando:**
  - Se ven el saludo de NEXO, las 3 preguntas sugeridas y el campo de escribir.
  - Al enviar una pregunta aparece la respuesta con los números de la persona.
  - Si la respuesta fue calculada en el navegador, se indica "Respuesta con tus números, sin usar la IA".
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F2.1b Información insuficiente

- **Archivo de diseño:** `disenos/prototipo.html` (estado del Chat).
- **Objetivo:** Esta pantalla existe para que la persona pueda saber que NEXO necesita más gastos para responder bien. Sabemos que funciona si registra más gastos y vuelve a preguntar.
- **Está lista cuando:**
  - Con menos de 3 gastos, ante una pregunta sobre metas, categorías o presupuesto, NEXO responde "Me faltan datos para responder bien".
  - Dice cuántos gastos lleva la persona y que con 3 puede ayudar.
  - Ofrece el botón Registrar un gasto.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F2.2 Respuesta con acción sugerida

- **Archivo de diseño:** `disenos/prototipo.html` (estado del Chat).
- **Objetivo:** Esta pantalla existe para que la persona pueda decidir qué hacer con su meta después de que NEXO le responde. Sabemos que funciona si elige mantener o ajustar la meta.
- **Está lista cuando:**
  - Bajo la respuesta sobre la meta aparece la tarjeta "Acción sugerida" con Mantener meta y Ajustar meta.
  - Mantener meta confirma con un aviso; Ajustar meta lleva al ajuste de la meta.
  - Una vez elegida la opción, los botones se reemplazan por un texto que dice qué se decidió.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F2.3 Meta: detalle, abono y ajuste

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/metas/:id` (con `?editar=1` para ajustar).
- **Objetivo:** Esta pantalla existe para que una persona pueda ver cuánto lleva en su meta, abonar y ajustarla. Sabemos que funciona si registra un abono o ajusta la meta sin salir de la pantalla.
- **Contenido, en orden de importancia:** 1) nombre, porcentaje, lo ahorrado y lo que falta con barra de progreso. 2) abonar. 3) ajustar meta (nombre y valor objetivo). 4) celebración "¡Lo lograste!" al cumplirla.
- **Qué funciona de verdad:** abonar, ajustar meta, guardar cambios, cancelar, crear otra meta y volver: **Simulado**.
- **Está lista cuando:**
  - Se ven nombre, porcentaje, "Te faltan $…" y la barra de progreso.
  - Un abono mayor que cero actualiza lo ahorrado y el porcentaje; con cero o vacío muestra el error.
  - Al completar el monto aparece la celebración con Crear otra meta.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F2.4 Racha y recompensas

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/racha`.
- **Objetivo:** Esta pantalla existe para que una persona pueda entender qué gana por registrar a diario. Sabemos que funciona si canjea una recompensa.
- **Contenido, en orden de importancia:** 1) días seguidos y los 7 días de la semana. 2) mejor racha y cuánto falta para la próxima recompensa. 3) recompensas a 3, 7 y 14 días, con Canjear. 4) estado de NEXO Pro y días restantes. "Progreso de racha y recompensa desbloqueada" y "Racha y recompensas" son la misma pantalla.
- **Qué funciona de verdad:**
  - Canjear y ver el consejo en el copiloto: **Simulado** (lo canjeado se guarda en el navegador).
  - Control del plan Pro en el servidor: **Después** (hoy se guarda en el navegador).
- **Está lista cuando:**
  - Se ven la racha actual, la mejor racha y los 7 días de la semana.
  - Las recompensas bloqueadas muestran cuántos días faltan y las desbloqueadas muestran Canjear.
  - Al canjear, la recompensa pasa a "Canjeada".
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F3.1 Feed de preguntas

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/foro`.
- **Objetivo:** Esta pantalla existe para que una persona pueda resolver dudas de plata con otras personas. Sabemos que funciona si publica una pregunta o marca una respuesta útil.
- **Contenido, en orden de importancia:** 1) lista de preguntas (autor, categoría, título, número de respuestas). 2) buscar. 3) categorías (Todas, Ahorro, Presupuesto, Crédito, Hábitos, Primer empleo, Otra). 4) botón Preguntar.
- **Qué funciona de verdad:** buscar, filtrar por categoría, Preguntar y abrir una pregunta: **Simulado** (las preguntas de ejemplo llevan la etiqueta "Ejemplo").
- **Está lista cuando:**
  - Se ven las preguntas con su categoría y número de respuestas.
  - Escribir en el buscador o elegir una categoría filtra la lista.
  - Si no hay resultados aparece "No encontré preguntas con eso" con el botón para hacer una nueva.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F3.2 Detalle de pregunta

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/foro/:id`.
- **Objetivo:** Esta pantalla existe para que una persona pueda leer las respuestas y marcar la que le sirvió. Sabemos que funciona si publica una respuesta o marca una como útil.
- **Contenido, en orden de importancia:** 1) la pregunta. 2) las respuestas con "Marcar como útil" y su conteo. 3) campo para responder.
- **Qué funciona de verdad:** marcar como útil y responder: **Simulado**. Votos reales entre varias personas y moderación con reportes y revisión humana: **Después**.
- **Está lista cuando:**
  - Se ven la pregunta, el número de respuestas y cada respuesta con su botón de útil.
  - Marcar como útil cambia el estado del botón y el conteo.
  - Publicar una respuesta válida la agrega a la lista.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F3.3 Escribir pregunta nueva

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/foro/nueva`.
- **Objetivo:** Esta pantalla existe para que una persona pueda preguntar a la comunidad sobre su plata. Sabemos que funciona si publica una pregunta.
- **Contenido, en orden de importancia:** 1) campo de la pregunta. 2) normas visibles (sin enlaces, teléfonos, claves ni promociones). 3) categoría. 4) botón Publicar.
- **Qué funciona de verdad:** escribir, elegir categoría y Publicar: **Simulado** (con reglas simples de moderación en el navegador).
- **Está lista cuando:**
  - Se ven el campo, las normas, las 6 categorías y Publicar.
  - Una pregunta válida se publica y lleva a F3.4.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F3.3b Pregunta no válida

- **Archivo de diseño:** `disenos/prototipo.html` (estado de Escribir pregunta nueva).
- **Objetivo:** Esta pantalla existe para que la persona pueda entender por qué su pregunta no se publicó y corregirla. Sabemos que funciona si corrige la pregunta y la publica.
- **Está lista cuando:**
  - Una pregunta de menos de 15 caracteres, de más de 500, o con enlaces, correos, teléfonos, claves o promociones muestra un mensaje que explica el motivo.
  - Lo escrito se conserva.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### F3.4 Pregunta publicada y aviso de respuesta

- **Archivo de diseño:** `disenos/prototipo.html` (estado de Escribir pregunta nueva y pantalla de Avisos).
- **Objetivo:** Esta pantalla existe para que la persona pueda confirmar que su pregunta se publicó y enterarse cuando alguien le responde. Sabemos que funciona si ve su pregunta publicada y entra a ver las respuestas.
- **Qué funciona de verdad:** el aviso de respuesta: **Simulado**. Notificaciones reales y recordatorio nocturno diario: **Después**.
- **Está lista cuando:**
  - Se ve la pregunta publicada, el aviso de que ya pueden responderle y los botones Ver respuestas y Volver a la comunidad.
  - Se aclara que las respuestas de esta demostración son de ejemplo.
  - Más tarde aparece un aviso nuevo en la campana de la barra superior.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### Lista de gastos (editar y eliminar)

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Rutas `#/gastos` y `#/gastos/:id` (Editar gasto).
- **Objetivo:** Esta pantalla existe para que una persona pueda revisar y corregir lo que registró. Sabemos que funciona si edita o elimina un gasto.
- **Contenido, en orden de importancia:** 1) total del mes por categoría. 2) gastos por día. 3) editar o eliminar con Deshacer. 4) botón Registrar.
- **Qué funciona de verdad:** abrir un gasto, Guardar cambios, Eliminar gasto, Deshacer y Registrar: **Simulado**.
- **Está lista cuando:**
  - Se ven el total del mes, el avance por categoría y los gastos agrupados por día.
  - Tocar un gasto abre Editar gasto con sus datos.
  - Eliminar quita el gasto y muestra el aviso con Deshacer.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### Metas

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/metas`.
- **Objetivo:** Esta pantalla existe para que una persona pueda ver todas sus metas de ahorro. Sabemos que funciona si abre una meta o crea la primera.
- **Qué funciona de verdad:** Crear y abrir una meta: **Simulado**.
- **Está lista cuando:**
  - Cada meta muestra nombre, porcentaje, lo ahorrado, el objetivo y la barra de progreso.
  - Las metas cumplidas muestran "Lista".
  - Sin metas aparece "Tu primera meta empieza aquí" con el botón Crear una meta.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### Crear meta

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/metas/nueva`.
- **Objetivo:** Esta pantalla existe para que una persona pueda crear una meta de ahorro. Sabemos que funciona si crea la meta con nombre y monto.
- **Qué funciona de verdad:** escribir, ideas rápidas y Crear meta: **Simulado**.
- **Está lista cuando:**
  - Se ven nombre, ideas rápidas, monto y Crear meta.
  - Con nombre o monto vacíos se muestran los mensajes de error.
  - Con datos válidos aparece "Meta creada" y se vuelve a Metas.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### Perfil

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/perfil`.
- **Objetivo:** Esta pantalla existe para que una persona pueda ajustar su ingreso y reiniciar la demostración. Sabemos que funciona si actualiza su ingreso.
- **Contenido, en orden de importancia:** 1) racha y plan. 2) ingreso mensual con Guardar. 3) privacidad. 4) modo demostración. El selector de colores no entra: el equipo decidió una sola paleta.
- **Qué funciona de verdad:** Guardar ingreso, Cargar datos de ejemplo (6 días de gastos de ejemplo) y Reiniciar demo (borra los datos del dispositivo): **Simulado**. Cuentas y sesión para guardar entre dispositivos: **Después**.
- **Está lista cuando:**
  - Se ven la racha, el plan (Gratis o Pro), el ingreso editable, la nota de privacidad y los botones de la demostración.
  - Guardar un ingreso mayor que cero muestra "Ingresos actualizados".
  - Reiniciar demo pide confirmación antes de borrar.
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).

### Avisos

- **Archivo de diseño:** `disenos/prototipo.html` (comparte archivo con todas las pantallas). Ruta `#/avisos`.
- **Objetivo:** Esta pantalla existe para que una persona pueda enterarse de las respuestas a sus preguntas. Sabemos que funciona si abre el aviso de una respuesta.
- **Qué funciona de verdad:** abrir un aviso y Marcar todo como visto: **Simulado**.
- **Está lista cuando:**
  - Cada aviso muestra su texto y si es Nueva o Vista.
  - Tocar un aviso lleva a la pregunta y lo marca como visto.
  - Sin avisos aparece "Aquí te aviso cuando alguien responda tus preguntas".
  - Se ve igual al diseño aprobado.
  - Funciona en celular (375 px de ancho).
