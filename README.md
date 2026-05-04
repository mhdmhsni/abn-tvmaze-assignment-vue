# ABN TVMaze Assignment — Vue

A TV show browser built on the [TVMaze public API](https://api.tvmaze.com), written in Vue 3 with TypeScript.

---

## Table of contents

1. [Project structure](#project-structure)
2. [Working with this repo](#working-with-this-repo)
3. [Architecture](#architecture)
4. [Technology choices](#technology-choices)
5. [Technical decisions](#technical-decisions)

---

## Project structure

```
src/
├── api/                 # TVMaze fetch wrappers
├── assets/
│   └── styles/          # SCSS variables, mixins, resets
├── components/
│   ├── common/          # Generic UI (LoadingSpinner, RatingBadge, HorizontalScroller, …)
│   ├── icons/           # SVG icon components
│   ├── layout/          # AppHeader, SearchBar
│   └── shows/           # Show-specific presentational components
├── composables/         # Reusable stateful logic
├── pages/               # Route-level smart views
├── router/              # Vue Router configuration
├── stores/              # Pinia stores (shows, theme)
├── types/               # Shared TypeScript types
└── __tests__/           # Mirrors src/ structure; unit tests
```

---

## Working with this repo

### Prerequisites

The repo ships with an `.nvmrc` (set to `lts/krypton`, Node 24). Pinning the Node version in `.nvmrc` ensures every developer and CI environment uses the same runtime, avoiding subtle differences caused by different Node releases.

```bash
nvm use        # picks up .nvmrc automatically
node -v        # should print v24.x.x
npm -v         # bundled with Node 24
```

Minimum supported: **Node ≥ 20.19 or ≥ 22.12** (see `engines` in `package.json`).

---

### Run locally (Vite dev server)

```bash
# 1. Install dependencies
npm install

# 2. (optional) override the API base URL
cp .env.example .env
# edit .env → VITE_API_BASE_URL=https://api.tvmaze.com

# 3. Start the dev server
npm run dev
# → http://localhost:5173
```

Other useful commands:

```bash
npm run test:unit   # run Vitest unit tests
npm run type-check  # TypeScript type checking
npm run lint        # oxlint + ESLint (auto-fix)
npm run format      # Prettier
npm run build       # production build → dist/
npm run preview     # preview the production build locally
```

---

### Run with Docker / Podman Compose

The `Dockerfile` uses a two-stage build: Node 24 compiles the app, then nginx serves the static output.

```bash
# Build and start (defaults to https://api.tvmaze.com)
docker compose up --build

# Override the API base URL at build time
VITE_API_BASE_URL=https://api.tvmaze.com docker compose up --build

# App is available at → http://localhost:8080
```

The compose file maps container port 80 → host port 8080. `podman compose` works as a drop-in replacement for `docker compose`.

## Architecture

The app follows a **layered, feature-sliced** structure:

```
API layer → Pinia stores → Pages (route views) → Presentational components
```

- **`src/api/`** — thin fetch wrappers around TVMaze endpoints; the only place that knows about the network.
- **`src/stores/`** — Pinia stores own global state (fetched shows, derived genre maps, theme preference). Pages read from stores; components do not.
- **`src/pages/`** — route-level smart components: they connect stores and the router, then pass data down via props.
- **`src/components/`** — purely presentational; receive props and emit events. They have no knowledge of any store or route.
- **`src/composables/`** — encapsulate reusable stateful DOM logic that doesn't belong in a store.

This separation keeps components easy to test in isolation and makes the data-flow explicit and predictable.

---

## Technology choices

| Tool                                           | Why                                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3 + Composition API** (`<script setup>`) | Enables fine-grained reactivity and composable logic without the boilerplate of the Options API.                                                     |
| **TypeScript**                                 | Catches shape mismatches between API responses and component props at compile time.                                                                  |
| **Vite**                                       | Near-instant dev server and fast HMR; first-class Vue plugin support.                                                                                |
| **Pinia**                                      | Official Vue state-management library; simpler than Vuex, excellent devtools integration, fully typed, and trivially testable with `@pinia/testing`. |
| **Vue Router 5**                               | Declarative, nested routing; URL-driven pagination keeps browser history consistent.                                                                 |
| **Vitest**                                     | Vite-native test runner — shares the same config and transforms, so tests start in milliseconds.                                                     |
| **@vue/test-utils**                            | Official component-testing library; integrates directly with Vitest.                                                                                 |
| **SCSS**                                       | Variables and mixins for a consistent design token system and dark/light theming.                                                                    |
| **ESLint + oxlint + Prettier**                 | oxlint runs first (fast Rust linter), ESLint catches Vue/TS-specific rules, Prettier enforces formatting.                                            |
| **nginx** (production)                         | Lightweight static file server; configured for SPA history-mode routing.                                                                             |

---

## Technical decisions

### Dumb / presentational components

Almost all components under `src/components/` accept only props and emit events. The only exception is `AppHeader.vue`, which accesses the theme store and router directly because it is a singleton shell component with no meaningful props to receive. Everything else is purely presentational, making it trivially unit-testable and reusable in any context.

### Pinia over `provide/inject` or `reactive` singletons

Vue's built-in `provide/inject` works for small cases, but Pinia gives: automatic devtools integration, SSR safety, module isolation, and a clean testing API (`createTestingPinia`). Each store is a self-contained composable that is easy to mock in tests.

### Composables for DOM-stateful logic

`useScrollTrack` manages scroll listeners, `ResizeObserver`, and cleanup via `onUnmounted`. Extracting this into a composable keeps `HorizontalScroller.vue` focused on rendering and makes the scroll logic independently testable.

### URL-driven pagination

The current page lives in the URL query string (`?page=2`). This makes browser back/forward work correctly and lets users share or bookmark a page. The store is driven by the URL, not the other way around.

### Environment variable for API base URL

`VITE_API_BASE_URL` is set at build time (or via `.env`), so the same Docker image can be pointed at a different API host without a rebuild.
