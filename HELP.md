# Getting Started

## Running the Application

The app serves the React SPA at `http://localhost:3000/` and proxies `/api/**` to the Java backend at `http://localhost:8080`.

> **Prerequisites:** Start the **claude-java-demo** backend first (see its `HELP.md`).

### With Docker Compose (recommended)

```bash
docker compose up --build        # foreground (Ctrl-C to stop)
docker compose up --build -d     # detached
docker compose down              # stop and remove container
```

The backend URL defaults to `http://host.docker.internal:8080`. Override it if needed:

```bash
BACKEND_URL=http://my-backend:8080 docker compose up -d
```

### Local Development (Vite dev server)

Hot reload, proxies `/api` → `localhost:8080`:

```bash
npm install      # first time only
npm run dev      # http://localhost:5173
```

Override the backend URL via environment variable:

```bash
VITE_API_URL=http://my-backend:8080 npm run dev
```

### Building for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## API Endpoints

All requests are proxied to the backend at `/api`. The frontend calls the following endpoints:

### Products

| Method   | Path                 | Description       | Status |
|----------|----------------------|-------------------|--------|
| `POST`   | `/api/products`      | Create a product  | 201    |
| `GET`    | `/api/products`      | List all products | 200    |
| `DELETE` | `/api/products/{id}` | Delete a product  | 204    |

### Customers

| Method   | Path                  | Description          | Status |
|----------|-----------------------|----------------------|--------|
| `POST`   | `/api/customers`      | Register a customer  | 201    |
| `GET`    | `/api/customers`      | List all customers   | 200    |
| `DELETE` | `/api/customers/{id}` | Delete a customer    | 204    |

### Smoke Test

```bash
# Create a product (via the backend directly)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","price":9.99}'

# List products
curl http://localhost:8080/api/products

# Delete a product (replace <id> with the UUID returned above)
curl -X DELETE http://localhost:8080/api/products/<id>
```

---

## Reference Documentation

* [React 18 Documentation](https://react.dev/)
* [Vite Documentation](https://vitejs.dev/guide/)
* [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode)
* [nginx Documentation](https://nginx.org/en/docs/)
* [Docker Compose Documentation](https://docs.docker.com/compose/)

## Guides

* [Getting Started with React](https://react.dev/learn)
* [Fetching Data in React](https://react.dev/reference/react/useEffect#fetching-data-with-effects)
* [Deploying Vite Apps](https://vitejs.dev/guide/static-deploy)
