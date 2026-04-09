# Memories

## claude-demo Docker startup and shutdown procedure

Start the Java backend first, wait for it to be healthy, then start the React frontend.

**Step 1 — Start claude-java-demo:**
```bash
cd /Users/joseph-sicree/dev/github/claude-java-demo
docker compose up -d
```
Internally starts: MySQL 8.4 (port 3306) then Spring Boot app (port 8080). MySQL has a health check; app waits for it.

**Step 2 — Wait for backend to be healthy:**
```bash
docker compose -f /Users/joseph-sicree/dev/github/claude-java-demo/docker-compose.yml logs -f app
```
Backend is ready when http://localhost:8080/swagger-ui.html is accessible.

**Step 3 — Start claude-react-demo:**
```bash
cd /Users/joseph-sicree/dev/github/claude-react-demo
docker compose up -d
```
Starts nginx serving the React build on port 3000. Proxies `/api/` to `http://host.docker.internal:8080`.

**Verify:** http://localhost:3000 (frontend), http://localhost:8080/swagger-ui.html (backend)

**Teardown (stop the claude-demo) — react-demo first, then java-demo:**
```bash
docker compose -f /Users/joseph-sicree/dev/github/claude-react-demo/docker-compose.yml down
docker compose -f /Users/joseph-sicree/dev/github/claude-java-demo/docker-compose.yml down
```

**Why:** The React frontend proxies `/api/*` to the Java backend, so the backend must be up first (startup) and shut down last (teardown). BACKEND_URL defaults to `http://host.docker.internal:8080` in the react-demo docker-compose.yml.