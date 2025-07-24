# Docker Health Checks

## Overview

Docker Health Checks monitor container health and determine if containers are healthy, unhealthy, or starting up.

**Health Status:**

- **0**: Container is healthy
- **1+**: Container is unhealthy

## Basic Syntax

```dockerfile
HEALTHCHECK [OPTIONS] CMD command
```

## Options

### `--interval=DURATION` (default: 30s)

Time between health checks

```dockerfile
HEALTHCHECK --interval=1m30s CMD curl -f http://localhost || exit 1
```

### `--timeout=DURATION` (default: 30s)

Maximum time allowed for health check to run

```dockerfile
HEALTHCHECK --timeout=10s CMD curl -f http://localhost || exit 1
```

### `--start-period=DURATION` (default: 0s)

Grace period after container starts before counting failures

```dockerfile
HEALTHCHECK --start-period=1m CMD curl -f http://localhost || exit 1
```

### `--retries=N` (default: 3)

Consecutive failures needed to mark container unhealthy

```dockerfile
HEALTHCHECK --retries=5 CMD curl -f http://localhost || exit 1
```

## Examples

### Web Application

```dockerfile
FROM nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost || exit 1
```

### Database

```dockerfile
FROM mysql:8.0
HEALTHCHECK --interval=30s --timeout=20s --start-period=60s --retries=3 \
  CMD mysqladmin ping -h localhost || exit 1
```

### Docker Compose

```yaml
version: "3.8"
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  db:
    image: postgres:13
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5
```

## Common Commands

### Web Apps

```bash
# HTTP check
CMD curl -f http://localhost:8080/health || exit 1

# With headers
CMD curl -f -H "Accept: application/json" http://localhost/api/health || exit 1
```

### Databases

```bash
# MySQL
CMD mysqladmin ping -h localhost || exit 1

# PostgreSQL
CMD pg_isready -U postgres || exit 1

# Redis
CMD redis-cli ping || exit 1
```

### File/Process Checks

```bash
# File exists
CMD test -f /app/ready || exit 1

# Process running
CMD pgrep -f "my-app" || exit 1
```

## Monitoring

```bash
# Check health status
docker ps

# Inspect health details
docker inspect container-name | grep -A 5 "Health"

# View health logs
docker inspect container-name | jq '.[0].State.Health'
```

## Best Practices

- Use appropriate intervals (10s for critical, 60s for less critical)
- Set realistic timeouts (5s for HTTP, 30s for databases)
- Use start-period for slow-starting applications
- Create dedicated `/health` endpoints
- Disable with `HEALTHCHECK NONE` if not needed

## Quick Reference

```dockerfile
# Complete example
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

❤️ **Happy Learning! Made with Love** ❤️

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: app
      image: my-app:latest
      readinessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
        timeoutSeconds: 5
        failureThreshold: 3
```

---

❤️ **Happy Learning! Made with Love** ❤️
