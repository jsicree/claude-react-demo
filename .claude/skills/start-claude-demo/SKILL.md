---
description: Build and start the full claude-demo stack — claude-java-demo (Spring Boot + MySQL on port 8080) and claude-react-demo (nginx SPA on port 3000) — using Docker Compose for each repo.
---

# start-claude-demo

Builds and starts the full demo stack: Spring Boot API + MySQL, then the React SPA.

## Prerequisites

- Docker Desktop running
- Both repos checked out as siblings:
  - `~/dev/github/claude-java-demo`
  - `~/dev/github/claude-react-demo`

## Run

### 1. Start the backend (claude-java-demo)

```bash
cd ~/dev/github/claude-java-demo
docker compose up -d
```

This starts two containers:
- `claude-java-demo-mysql-1` — MySQL 8.4 on port 3306 (internal)
- `claude-java-demo-app-1` — Spring Boot on port 8080

Wait for the API to be ready:

```bash
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/products 2>/dev/null)
  if [ "$http_code" = "200" ]; then echo "Backend UP (HTTP $http_code)"; break; fi
  echo "Waiting for backend... ($i/15)"
  sleep 3
done
```

Verify:

```bash
curl http://localhost:8080/api/products
# → []
```

### 2. Start the frontend (claude-react-demo)

```bash
cd ~/dev/github/claude-react-demo
docker compose up -d
```

This starts:
- `claude-react-demo-frontend-1` — nginx serving the React SPA on port 3000, proxying `/api/*` to `http://host.docker.internal:8080`

Wait for nginx to be ready:

```bash
for i in 1 2 3 4 5; do
  http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
  if [ "$http_code" = "200" ]; then echo "Frontend UP (HTTP $http_code)"; break; fi
  echo "Waiting for frontend... ($i/5)"
  sleep 2
done
```

Verify the nginx proxy reaches the backend:

```bash
curl http://localhost:3000/api/products
# → [] (or existing data)
```

## URLs

| Service | URL |
|---------|-----|
| React SPA | http://localhost:3000 |
| Spring Boot API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

## Stop

```bash
cd ~/dev/github/claude-react-demo && docker compose down
cd ~/dev/github/claude-java-demo && docker compose down
```

## Notes

- The frontend Dockerfile uses `node:22-alpine` and `nginx:alpine` — both have ARM64 variants and build cleanly on Apple Silicon.
- The backend Dockerfile uses `eclipse-temurin:17-jdk-jammy` and `eclipse-temurin:17-jre-jammy` (not alpine) — the alpine variants have no ARM64 manifest.
- `BACKEND_URL` in the React docker-compose defaults to `http://host.docker.internal:8080`. Do **not** override it with `localhost` — inside the container that resolves to the container itself.
