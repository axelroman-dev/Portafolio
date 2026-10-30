# Portafolio

Sitio de portafolio personal construido con [Astro](https://astro.build/).

## Stack

- [Astro](https://astro.build/) v7
- TypeScript
- CSS

## Estructura

```
src/
├── assets/       # Imágenes optimizadas en el build (capturas de proyectos)
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

## Enlaces de proyectos

Cada proyecto tiene una lista `links` con el texto y la URL de cada botón (repos, sitios, tiendas, docs…):

```json
"links": [
    { "label": { "es": "Repositorio", "en": "Repository" }, "href": "https://github.com/..." },
    { "label": "Chrome Web Store", "href": "https://chromewebstore.google.com/..." }
]
```

- `label` puede ser un texto fijo o `{ "es": …, "en": … }`.
- Los enlaces `http(s)` se abren en otra pestaña.
- Si un proyecto no tiene `icon` ni `initials`, la tarjeta no muestra el recuadro.

## Capturas de proyectos

1. Copia las imágenes (PNG, JPG, WebP o AVIF) a `src/assets/projects/<id-del-proyecto>/`.
2. Añade el campo `screenshots` al proyecto en `src/data/portfolio.json`:

```json
"screenshots": [
    {
        "src": "browsersync/01-popup.png",
        "alt": { "es": "Popup de la extensión", "en": "Extension popup" }
    }
]
```

- `src` es relativo a `src/assets/projects/`.
- La primera captura es la portada de la tarjeta; al hacer clic se abre la galería con todas.
- El orden del array es el orden de la galería.
- Las imágenes se convierten a WebP y se redimensionan en el build; no hace falta optimizarlas a mano.
- Si una ruta no existe, el build falla indicando cuál.
