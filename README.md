# claude-react-demo

A React 18 single-page application for managing Products and Customers. Built with Vite and served via nginx in Docker.

Companion frontend for [claude-java-demo](https://github.com/jsicree/claude-java-demo).

## Features

- Products and Customers management (list, create, delete)
- Tab-based navigation
- Proxies `/api/**` requests to the Spring Boot backend
- Multi-stage Docker build (Node.js builder → nginx runtime)
- Backend URL configurable at container runtime via environment variable

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 |
| Build | Vite 6 |
| HTTP | Native `fetch` |
| Styling | Hand-written CSS (single file) |
| Runtime | nginx:alpine |
| Containerisation | Docker + Docker Compose |

## Quick Start

### Prerequisites

Start the **claude-java-demo** backend first — the frontend proxies all `/api` requests to it on port 8080.

### Docker Compose (recommended)

```bash
git clone https://github.com/jsicree/claude-react-demo.git
cd claude-react-demo
docker compose up -d
```

App available at `http://localhost:3000`.

### Local Development

```bash
npm install
npm run dev      # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:8080` by default. Override with:

```bash
VITE_API_URL=http://my-backend:8080 npm run dev
```

### Production Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview locally
```

## Configuration

| Variable | Used by | Default | Description |
|----------|---------|---------|-------------|
| `BACKEND_URL` | Docker / nginx | `http://host.docker.internal:8080` | Backend base URL for nginx reverse proxy |
| `VITE_API_URL` | Vite dev server | `http://localhost:8080` | Backend base URL during local development |

## Documentation

- [HELP.md](HELP.md) — detailed setup, running options, and API smoke tests
- [CLAUDE.md](CLAUDE.md) — architecture guide, conventions, and component reference for AI-assisted development

## Related Projects

- [claude-java-demo](https://github.com/jsicree/claude-java-demo) — Spring Boot REST API backend
