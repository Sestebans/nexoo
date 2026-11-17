-- =========================================================
-- NEXO · Tabla de datos en Supabase
-- ---------------------------------------------------------
-- Pega todo este archivo en Supabase > SQL Editor y dale "Run".
-- Cada fila es una lista de la app (perfil, gastos, metas,
-- avisos...) de un usuario. La app la lee y escribe desde
-- js/app.js (sección "Nube").
-- =========================================================

create table if not exists public.datos_nexo (
  usuario uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null,                 -- nombre de la lista: "gastos", "metas", "perfil"...
  contenido jsonb not null,             -- la lista completa, igual que en el navegador
  actualizado timestamptz not null default now(),
  primary key (usuario, nombre)
);

-- Seguridad (RLS): cada usuario solo puede ver, crear, cambiar y borrar SUS filas.
-- Sin estas reglas, cualquiera con la publishable key podría leer todo.
alter table public.datos_nexo enable row level security;

drop policy if exists "Cada usuario ve sus datos" on public.datos_nexo;
create policy "Cada usuario ve sus datos" on public.datos_nexo
  for select to authenticated using ((select auth.uid()) = usuario);

drop policy if exists "Cada usuario crea sus datos" on public.datos_nexo;
create policy "Cada usuario crea sus datos" on public.datos_nexo
  for insert to authenticated with check ((select auth.uid()) = usuario);

drop policy if exists "Cada usuario cambia sus datos" on public.datos_nexo;
create policy "Cada usuario cambia sus datos" on public.datos_nexo
  for update to authenticated using ((select auth.uid()) = usuario) with check ((select auth.uid()) = usuario);

drop policy if exists "Cada usuario borra sus datos" on public.datos_nexo;
create policy "Cada usuario borra sus datos" on public.datos_nexo
  for delete to authenticated using ((select auth.uid()) = usuario);

-- Permisos de la API: solo usuarios con sesión (los anónimos también cuentan).
revoke all on public.datos_nexo from anon;
grant select, insert, update, delete on public.datos_nexo to authenticated;
