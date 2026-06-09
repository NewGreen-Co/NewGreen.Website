# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There are no tests configured. If adding a test runner, use Vitest (Vite-native).

## Architecture

This is a bilingual (DE/EN) corporate website for NewGreen Group — a React SPA built with Vite, Tailwind CSS v4, and React Router v7.

### Data layer: `src/data.js`

This is the single source of truth for all content. It exports three things:

- **`i18n`** — all UI strings keyed by `'de'` and `'en'`
- **`getSubsidiaries(lang)`** — returns the array of 9 subsidiary company objects; `lang` is passed in to return language-specific strings inline
- **`accentMap`** — maps accent color names (`'green'`, `'silver'`, `'amber'`, etc.) to Tailwind class sets used for consistent per-company theming across cards, detail pages, icons, and tags

### Language state

`App` holds `lang` (`'de'` | `'en'`) in `useState` and passes it as a prop to every component. There is no context or global state. `document.documentElement.lang` is synced in a `useEffect` in `App`.

### Routing (`src/App.jsx`)

| Route | Component |
|-------|-----------|
| `/` | `HomePage` (Hero + About + Subsidiaries + Values sections) |
| `/unternehmen/:id` | `SubsidiaryPage` |
| `/impressum` | `ImpressumPage` |
| `/datenschutz` | `DatenschutzPage` |
| `*` | Fallback to `HomePage` |

`RouteEffects` (renders `null`) handles scroll-to-top and `document.title` updates on route changes. `Navbar` and `Footer` are rendered outside `<Routes>` and appear on every page.

### Subsidiary detail pages (`src/SubsidiaryPage.jsx`)

`SubsidiaryPage` reads `:id` from the URL, looks up the company in `getSubsidiaries()`, and redirects to `/` if the company has `comingSoon: true` or no matching `id`. Only companies with a `page` field in their data object render a real detail page.

### Adding a new subsidiary

1. Add an object to `getSubsidiaries()` in `src/data.js` with the required fields: `id`, `name`, `tagline`, `description`, `tags`, `icon` (Lucide component), `accentColor`, `href` (`/unternehmen/<id>`), and optionally `logo` and `comingSoon`.
2. Add a `page` field (with `heroTagline`, `longDescription`, `services`, `reasons`) to get a full detail page; otherwise set `comingSoon: true`.
3. The company will automatically appear in the navbar dropdown, footer list, and the `/subsidiaries` grid.

### Styling

Tailwind CSS v4 is used via the `@tailwindcss/vite` plugin — no `tailwind.config.js` is needed. Custom utility classes (`.text-gradient`, `.card-hover`, `.nav-blur`) are defined in `src/index.css`. Per-company accent colors are resolved through `accentMap` in `data.js` to Tailwind class strings applied via `className`.

### Component organisation

Most components live in `src/App.jsx`: `RouteEffects`, `Navbar`, `Footer`, `Hero`, `About`, `SubsidiaryCard`, `Subsidiaries`, `Values`, and `HomePage`. Page-level route components are in separate files: `SubsidiaryPage.jsx`, `ImpressumPage.jsx`, `DatenschutzPage.jsx`.
