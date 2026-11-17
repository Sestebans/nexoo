/* =========================================================
   NEXO · Conexión con Supabase
   ---------------------------------------------------------
   Aquí van la URL del proyecto y la "publishable key" (en
   proyectos viejos se llama "anon key"). Las dos son públicas
   por diseño: la seguridad la ponen las reglas (RLS) de la
   tabla datos_nexo, que dejan a cada usuario ver solo lo suyo.

   NUNCA pongas aquí la "secret key" ni la "service_role key":
   este repositorio es público.

   Si los dos valores quedan vacíos, la app funciona igual,
   guardando solo en el navegador.
   ========================================================= */

const SUPABASE = {
  url: "",            /* ej. "https://abcdefgh.supabase.co" */
  clavePublica: ""    /* ej. "sb_publishable_..." */
};
