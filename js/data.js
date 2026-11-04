/* =========================================================
   NEXO · Datos simulados
   ---------------------------------------------------------
   Aquí viven los datos de ejemplo, separados del diseño.
   Una lista por cada tipo de dato; cada elemento tiene un id
   y siempre los mismos campos (los nombres salen de spec.md).
   Cuando conectemos Supabase, estas listas pasarán a tablas.
   ========================================================= */

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
