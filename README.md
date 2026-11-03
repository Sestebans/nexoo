# NEXO

Tu primer copiloto financiero: una app que te ayuda a entender y manejar tu dinero con respuestas basadas en tus propios gastos y tu salario.

## El problema

Muchos jóvenes salen del colegio sin saber cómo manejar su dinero y empiezan su vida financiera sin herramientas ni guía. Tarjetas, préstamos y ahorro se presentan como un montón de datos confusos, y solo 1 de cada 4 jóvenes ahorra con regularidad. NEXO busca que ese primer paso sea gradual y sin angustia.

## Para quién

Jóvenes de 18 a 25 años con ingresos propios que quieren entender las finanzas básicas y sacar su primera tarjeta de crédito.

## Equipo

- **Andrés Daza**: Diseño UX, conocimiento del mercado financiero y proyecciones
- **Sergio Suárez**: Diseño UI, storytelling de producto

## Links

- Brief y benchmark: [docs/brief.pdf](docs/brief.pdf)
- App publicada: http://nexoo-sooty.vercel.app/

## Cómo está organizado este repo

- `disenos/`: el prototipo de la app (`prototipo.html`), que se abre en el navegador.
- `assets/`: las imágenes de la app. Hoy no tiene imágenes, porque el prototipo dibuja sus gráficos con código. En `assets/fuentes/` están las dos fuentes (Bricolage Grotesque y DM Sans), para que la app no dependa de internet.
- `docs/`: documentos del proyecto: el brief y el benchmark (`brief.pdf`).
- `css/`: los estilos del design kit. `tokens.css` tiene los colores, letras y medidas, y `components.css` tiene los botones, tarjetas, campos y demás piezas.
- `componentes.html`: el catálogo con todas las piezas del design kit. Se abre con doble clic en el navegador.
- `spec.md`: el plano de la app: el flujo de pantallas, los datos y, para cada pantalla, qué hace y cuándo está lista.
- `decisiones-design-kit.md`: las decisiones del equipo sobre colores, letras, espacios, bordes y componentes.
- `auditoria-design-kit.md`: la revisión de los diseños que dio origen a esas decisiones.
- `CLAUDE.md`: las instrucciones que sigue Claude Code al trabajar en este proyecto.
- `.gitignore`: lista de archivos que no se suben al repositorio.
- `README.md`: esta portada.
