# Portafolio

Sitio de portafolio personal construido con [Astro](https://astro.build/).

## Stack

- [Astro](https://astro.build/) v5
- TypeScript
- CSS

## Estructura

```
src/
├── components/   # Componentes de las secciones (Hero, About, Projects, etc.)
├── data/         # Datos del portafolio
├── layouts/      # Layouts base
├── lib/          # Lógica de carga de datos
├── pages/        # Páginas (entrypoints)
├── scripts/      # Scripts de cliente
└── styles/       # Estilos globales
```

## Comandos

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo         |
| `npm run build`   | Genera el build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción      |

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

El sitio generado queda en la carpeta `dist/`.
