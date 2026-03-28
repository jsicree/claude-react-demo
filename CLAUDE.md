# claude-react-demo

React 18 SPA frontend for the claude-java-demo backend. Provides a tab-based UI for managing Products and Customers.

**GitHub:** https://github.com/jsicree/claude-react-demo

## Stack

- **React** 18.3.1
- **Build** Vite 6 (`npm run dev` / `npm run build`)
- **Styling** Single CSS file (`src/styles/app.css`) — no component-level CSS
- **HTTP** Native `fetch` — no HTTP client library
- **State** `useState` / `useEffect` / `useCallback` — no external state management
- **Runtime** nginx:alpine (production) · Vite dev server (development)

## Common commands

```bash
npm install      # install dependencies (first time only)
npm run dev      # start Vite dev server (http://localhost:5173, proxy → localhost:8080)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Docker

The preferred way to run the frontend is Docker Compose:

```bash
docker compose up -d               # build image and start container (port 3000)
docker compose up --build -d       # rebuild image and start container
docker compose down                # stop and remove container
docker compose logs -f frontend    # tail frontend logs
```

To override the backend URL at runtime:

```bash
BACKEND_URL=http://my-backend:8080 docker compose up -d
```

Single-container commands:

```bash
docker build -t claude-react-demo .
docker run -p 3000:80 -e BACKEND_URL=http://host.docker.internal:8080 claude-react-demo
```

> **Note:** When running via Docker Desktop on macOS/Windows, `BACKEND_URL` defaults to
> `http://host.docker.internal:8080` so nginx can reach the backend on the host. Do **not**
> use `localhost` — inside the container that resolves to the container itself.

## Environment variables

| Variable | Where used | Default | Purpose |
|----------|-----------|---------|---------|
| `BACKEND_URL` | nginx template (Docker) | `http://host.docker.internal:8080` | Backend base URL for nginx reverse proxy |
| `VITE_API_URL` | `vite.config.js` (dev only) | `http://localhost:8080` | Backend base URL for Vite dev proxy |

Copy `.env.example` to `.env` to override locally during development.

## Architecture

```
src/
├── main.jsx              # React entry point (mounts to #root)
├── App.jsx               # Root component — tab navigation (Products / Customers)
├── api.js                # API client — all fetch calls to /api/*
├── components/
│   ├── ProductsTab.jsx   # List, create, delete products
│   └── CustomersTab.jsx  # List, register, delete customers
└── styles/
    └── app.css           # All styles for the entire app
nginx/
└── default.conf.template # nginx config (BACKEND_URL substituted at startup)
```

### API client (`src/api.js`)

All requests go through a shared `request()` helper:

- Sets `Content-Type: application/json`
- Returns `null` for 204 No Content
- Extracts `{ error }` from JSON response body on failure and throws

Exported functions:

| Function | Method | Path |
|----------|--------|------|
| `getProducts()` | GET | `/api/products` |
| `createProduct(name, price)` | POST | `/api/products` |
| `deleteProduct(id)` | DELETE | `/api/products/{id}` |
| `getCustomers()` | GET | `/api/customers` |
| `createCustomer(name, email)` | POST | `/api/customers` |
| `deleteCustomer(id)` | DELETE | `/api/customers/{id}` |

### Request routing

**Development (Vite dev server):**
- Browser hits `http://localhost:5173`
- Vite proxies `/api/*` → `VITE_API_URL` (default `http://localhost:8080`)

**Production (Docker / nginx):**
- Browser hits `http://localhost:3000`
- nginx proxies `/api/*` → `BACKEND_URL`
- All other routes fall back to `index.html` (SPA routing)

## Conventions

- **JSDoc** on every file and function — file-level doc before the import block, method-level on all functions.
- **Author tag:** `@author Joe Sicree (test@test.com)`
- **Data fetching:** `useEffect` triggers a `useCallback`-memoized loader; full refresh after every mutation (no optimistic updates).
- **Error handling:** try/catch on all async ops; errors shown in `.alert.error` elements local to each tab component.
- **Destructive actions:** always guarded by `window.confirm`.
- **Styling:** BEM-adjacent class names (`.app-header`, `.tab-nav`, `.data-table`). Primary color `#4f46e5`, delete/danger `#ef4444`.
- **No test suite, no linter** configured — minimal demo project.

## Known issues

### API calls return HTTP 502 in Docker
nginx proxies `/api/*` to `BACKEND_URL`. If `BACKEND_URL` defaults to `http://localhost:8080`, nginx resolves `localhost` to the container itself (not the host), causing connection refused and a 502 response.

**Fix:** `BACKEND_URL` must be `http://host.docker.internal:8080` when running on macOS/Windows via Docker Desktop. The `docker-compose.yml` default is set correctly — if 502s occur, verify no `.env` file or shell variable is overriding it with `localhost`.

## Backend

This SPA is designed to work with **claude-java-demo** (Spring Boot, port 8080). Start that project first before running this one. See its `CLAUDE.md` for API details and startup instructions.
