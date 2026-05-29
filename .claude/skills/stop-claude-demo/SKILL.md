---
description: Stop the full claude-demo stack — tears down claude-react-demo (nginx SPA) then claude-java-demo (Spring Boot + MySQL) using Docker Compose for each repo.
---

# stop-claude-demo

Stops and removes all containers for the full demo stack. Frontend first, then backend.

## Run

### 1. Stop the frontend (claude-react-demo)

```bash
cd ~/dev/github/claude-react-demo
docker compose down
```

### 2. Stop the backend (claude-java-demo)

```bash
cd ~/dev/github/claude-java-demo
docker compose down
```

## Verify

```bash
docker ps --filter "name=claude-java-demo" --filter "name=claude-react-demo"
# → no containers listed
```

## Notes

- `docker compose down` stops and removes containers and networks but preserves the `mysql_data` volume — existing product and customer data survives a restart.
- To also wipe the database, add `--volumes`: `docker compose down --volumes`
