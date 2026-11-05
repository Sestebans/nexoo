/* =========================================================
   NEXO · Datos simulados
   ---------------------------------------------------------
   Aquí viven los datos de ejemplo, separados del diseño.
   Una lista por cada tipo de dato; cada elemento tiene un id
   y siempre los mismos campos (los nombres salen de spec.md).
   Cuando conectemos Supabase, estas listas pasarán a tablas.
   ========================================================= */

/* Fecha "AAAA-MM-DD" de hace n días (0 = hoy). Sirve para que los gastos de
   ejemplo siempre caigan en los últimos días, sin importar cuándo se abra la app. */
function diaHace(n) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - n);
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return fecha.getFullYear() + "-" + mes + "-" + dia;
}

const DATOS = {

  /* Perfil de la persona (spec.md, sección Datos > Perfil).
     Empieza vacío: se llena en la pantalla "Situación inicial". */
  perfil: [
    {
      id: 1,
      ingresoMensual: 0,
      comoManejaPlata: [],
      onboardingCompletado: false,
      ocultarMontos: false
    }
  ],

  /* Metas de ahorro (spec.md, sección Datos > Metas). Empieza sin metas. */
  metas: [],

  /* Gastos (spec.md, sección Datos > Gastos). Empieza sin gastos.
     "dia" es la fecha del gasto (AAAA-MM-DD) y "creado" es fecha y hora del registro. */
  gastos: [],

  /* Avisos (spec.md, sección Datos > Avisos). Empiezan sin avisos. */
  avisos: [],

  /* Categorías de gastos (spec.md, Gastos) */
  categorias: [
    { id: 1, nombre: "Comida" },
    { id: 2, nombre: "Transporte" },
    { id: 3, nombre: "Salidas" },
    { id: 4, nombre: "Compras" },
    { id: 5, nombre: "Educación" },
    { id: 6, nombre: "Otro" }
  ],

  /* Cuándo fue el gasto (spec.md, Gastos > día: Hoy o Ayer) */
  cuando: [
    { id: "hoy", nombre: "Hoy" },
    { id: "ayer", nombre: "Ayer" }
  ],

  /* Catálogo de recompensas por días de racha (spec.md, Recompensas > catálogo) */
  recompensas: [
    { id: 1, dias: 3, tipo: "consejo", titulo: "Consejo personalizado", texto: "NEXO revisa tus registros y te deja un consejo hecho a tu medida.", diasPro: 0 },
    { id: 2, dias: 7, tipo: "pro", titulo: "3 días de NEXO Pro", texto: "El copiloto responde con un análisis más completo.", diasPro: 3 },
    { id: 3, dias: 14, tipo: "pro", titulo: "7 días de NEXO Pro", texto: "Una semana entera del análisis completo del copiloto.", diasPro: 7 }
  ],

  /* Recompensas que ya canjeó (spec.md, Recompensas > canjeadas). Empieza vacía.
     Cada elemento: { id, recompensaId }. */
  canjeadas: [],

  /* Plan Pro (spec.md, Recompensas > plan Pro): hasta cuándo está activo
     (fecha y hora ISO). Vacío = no está activo. Hoy se guarda en el navegador. */
  planPro: [
    { id: 1, proHasta: "" }
  ],

  /* Mensajes del chat con el copiloto (spec.md, Datos > Mensajes del chat).
     Empieza vacío. Por ahora solo guarda el consejo que da la recompensa. */
  mensajes: [],

  /* Para la demostración de la comunidad: respuestas que "llegan solas" a los pocos
     segundos de publicar una pregunta. Cada elemento de entregasProgramadas dice a cuál
     pregunta le toca la respuesta y cuándo (en milisegundos). Empieza vacía.
     Estas dos listas no están en spec.md. */
  entregasProgramadas: [],
  respuestasDeEjemplo: [
    {
      id: 1,
      autor: "Laura G.",
      texto: "Buena pregunta. A mí me ayudó anotar todo durante un mes para ver a dónde se iba la plata antes de decidir nada."
    }
  ],

  /* Categorías de las preguntas del foro (spec.md, Preguntas del foro > categoría) */
  categoriasForo: [
    { id: 1, nombre: "Ahorro" },
    { id: 2, nombre: "Presupuesto" },
    { id: 3, nombre: "Crédito" },
    { id: 4, nombre: "Hábitos" },
    { id: 5, nombre: "Primer empleo" },
    { id: 6, nombre: "Otra" }
  ],

  /* Preguntas del foro (spec.md, sección Datos > Preguntas del foro).
     "ejemplo" marca las de demostración. Las preguntas nuevas se agregan al inicio. */
  preguntas: [
    {
      id: "seed1",
      titulo: "¿Cómo empiezo a ahorrar si gano poco?",
      texto: "Recibo cerca de un salario mínimo y siempre llego a fin de mes sin nada. ¿Por dónde empiezo?",
      categoria: "Ahorro",
      autor: "Camila R.",
      fecha: "2026-10-05T15:00:00.000Z",
      ejemplo: true
    },
    {
      id: "seed2",
      titulo: "¿Me conviene sacar una tarjeta de crédito siendo estudiante?",
      texto: "Me ofrecieron una en la universidad pero no sé si tiene sentido tenerla tan joven.",
      categoria: "Crédito",
      autor: "Daniel P.",
      fecha: "2026-10-07T18:30:00.000Z",
      ejemplo: true
    },
    {
      id: "seed3",
      titulo: "¿Cómo organizo mis gastos si me pagan por días?",
      texto: "Trabajo medio tiempo y mis ingresos cambian cada semana. No sé cómo armar un presupuesto así.",
      categoria: "Presupuesto",
      autor: "Valentina S.",
      fecha: "2026-10-09T13:10:00.000Z",
      ejemplo: true
    }
  ],

  /* Respuestas del foro (spec.md, sección Datos > Respuestas del foro).
     "preguntaId" dice a cuál pregunta pertenece; "utiles" cuenta quién la marcó como útil. */
  respuestas: [
    {
      id: "seed1a",
      preguntaId: "seed1",
      autor: "Andrés M.",
      texto: "A mí me sirvió apartar un monto fijo pequeño apenas me pagaban, aunque fuera poco. Lo que no ves, no lo gastas.",
      utiles: 3,
      marcadaPorMi: false,
      ejemplo: true
    },
    {
      id: "seed3a",
      preguntaId: "seed3",
      autor: "Laura G.",
      texto: "Yo calculo con lo que gané la semana anterior y no con lo que espero ganar. Así nunca me paso.",
      utiles: 2,
      marcadaPorMi: false,
      ejemplo: true
    }
  ],

  /* Las 3 preguntas sugeridas del chat con el copiloto. Esta lista no está en spec.md. */
  preguntasSugeridas: [
    { id: 1, texto: "¿Cuánto puedo gastar al día?" },
    { id: 2, texto: "¿Voy bien con mi meta?" },
    { id: 3, texto: "¿En qué gasté más?" }
  ],

  /* Textos de los botones "?" de Inicio. Esta lista no está en spec.md. */
  ayudas: [
    {
      id: "calculo",
      texto: "Es lo que te queda este mes dividido entre los días que faltan. Se actualiza cada vez que registras un gasto."
    },
    {
      id: "racha",
      texto: "Cuenta los días seguidos en que registras al menos un gasto. Con 3, 7 y 14 días desbloqueas recompensas."
    }
  ],

  /* 6 días de gastos de ejemplo (el último día, ayer; hoy queda libre para registrar).
     Los carga el botón "Cargar datos de ejemplo" de Perfil. */
  gastosEjemplo: [
    { id: 1, nota: "Libros", monto: 32000, categoria: "Educación", dia: diaHace(6), creado: diaHace(6) + "T12:00:00" },
    { id: 2, nota: "Transmilenio", monto: 6400, categoria: "Transporte", dia: diaHace(5), creado: diaHace(5) + "T08:00:00" },
    { id: 3, nota: "Domicilio", monto: 22000, categoria: "Comida", dia: diaHace(4), creado: diaHace(4) + "T20:00:00" },
    { id: 4, nota: "Cine", monto: 28000, categoria: "Salidas", dia: diaHace(3), creado: diaHace(3) + "T19:00:00" },
    { id: 5, nota: "Mercado", monto: 41500, categoria: "Comida", dia: diaHace(2), creado: diaHace(2) + "T17:00:00" },
    { id: 6, nota: "Almuerzo", monto: 13500, categoria: "Comida", dia: diaHace(1), creado: diaHace(1) + "T13:00:00" },
    { id: 7, nota: "Café", monto: 5500, categoria: "Comida", dia: diaHace(1), creado: diaHace(1) + "T16:00:00" }
  ],

  /* Diapositivas del carrusel de bienvenida (F1.1).
     Esta lista no está en la sección Datos de spec.md: se agregó para
     que los textos no queden escritos en el HTML. */
  diapositivas: [
    {
      id: 1,
      etiqueta: "Tu copiloto financiero",
      titulo: "Tu plata, sin rodeos",
      texto: "Mira cuánto te queda este mes y cuánto puedes gastar al día, sin hojas de cálculo.",
      imagen: "assets/onboarding-1.svg",
      alt: "Barra de avance y un círculo que muestran cuánto te queda este mes"
    },
    {
      id: 2,
      etiqueta: "",
      titulo: "Registra en segundos",
      texto: "Escribe o dilo en voz alta: \"gasté 15 mil en almuerzo\". NEXO lo entiende y tú solo confirmas.",
      imagen: "assets/onboarding-2.svg",
      alt: "Dos burbujas de mensaje que representan registrar un gasto hablando o escribiendo"
    },
    {
      id: 3,
      etiqueta: "",
      titulo: "Un copiloto, no un banco",
      texto: "Te acompaño con tus metas y tus dudas. Nunca te pido claves ni que conectes tus cuentas.",
      imagen: "assets/onboarding-3.svg",
      alt: "Dos puntos unidos por una línea: tú y tu copiloto"
    }
  ],

  /* Ideas rápidas para la primera meta (F1.2) */
  ideasMeta: [
    { id: 1, nombre: "Moto" },
    { id: 2, nombre: "Viaje" },
    { id: 3, nombre: "Celular" },
    { id: 4, nombre: "Fondo de emergencia" },
    { id: 5, nombre: "Universidad" }
  ],

  /* Opciones de "Cómo manejas tu plata" (spec.md, Perfil) */
  formasDePlata: [
    { id: 1, nombre: "Débito" },
    { id: 2, nombre: "Crédito" },
    { id: 3, nombre: "Efectivo" },
    { id: 4, nombre: "Billetera digital" }
  ]
};
