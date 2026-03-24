# Stage 1 — build the React app
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — serve with nginx
# The official nginx:alpine image (1.19+) automatically runs envsubst on
# *.template files in /etc/nginx/templates/ before starting nginx.
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Default backend URL — override at container runtime with -e BACKEND_URL=...
ENV BACKEND_URL=http://localhost:8080

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]