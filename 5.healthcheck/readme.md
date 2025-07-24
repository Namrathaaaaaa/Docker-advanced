# Docker Health Checks

## Overview

Docker Health Checks allow you to monitor the health of your containers and ensure they are running correctly. Health checks help Docker determine if a container is healthy, unhealthy, or starting up.

## Health Check Status

Docker containers can have the following health statuses:

- **0**: The container is healthy
- **1 or greater**: The container is unhealthy

## HEALTHCHECK Options

### Basic Syntax

```dockerfile
HEALTHCHECK [OPTIONS] CMD command
```

### Available Options

#### `--interval=DURATION`

Sets the time between running health checks (default: 30 seconds).

```dockerfile
# Example: Run health check every 1 minute and 30 seconds
HEALTHCHECK --interval=1m30s CMD curl -f http://localhost || exit 1
```

#### `--timeout=DURATION`

Sets the maximum time allowed for the health check to run (default: 30 seconds). If the command takes longer, it is considered a failure.

```dockerfile
# Example: Health check must complete within 10 seconds
HEALTHCHECK --timeout=10s CMD curl -f http://localhost || exit 1
```

#### `--start-period=DURATION`

Sets the initialization time after the container starts during which the health check can fail without counting towards the maximum retries (default: 0 seconds).

```dockerfile
# Example: Allow for a 1-minute grace period after container starts
HEALTHCHECK --start-period=1m CMD curl -f http://localhost || exit 1
```

#### `--retries=N`

Specifies the number of consecutive failures needed to consider the container unhealthy (default: 3).

```dockerfile
# Example: Container will be marked as unhealthy after 5 consecutive failed health checks
HEALTHCHECK --retries=5 CMD curl -f http://localhost || exit 1
```

## Practical Examples

### 1. Web Application Health Check

```dockerfile
FROM nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost || exit 1
```

### 2. Database Health Check

```dockerfile
FROM mysql:8.0
HEALTHCHECK --interval=30s --timeout=20s --start-period=60s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1
```

### 3. Node.js Application Health Check

```dockerfile
FROM node:16
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```

### 4. Custom Health Check Script

```dockerfile
FROM alpine
COPY health-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/health-check.sh
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /usr/local/bin/health-check.sh
```

```bash
#!/bin/sh
# health-check.sh
if [ -f /app/ready ]; then
    exit 0
else
    exit 1
fi
```

## Docker Compose Health Checks

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

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
```

## Common Health Check Commands

### Web Applications

```bash
# HTTP GET request
CMD curl -f http://localhost:8080/health || exit 1

# HTTP with specific headers
CMD curl -f -H "Accept: application/json" http://localhost:8080/api/health || exit 1

# Using wget instead of curl
CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1
```

### Databases

```bash
# MySQL
CMD mysqladmin ping -h localhost || exit 1

# PostgreSQL
CMD pg_isready -U postgres || exit 1

# Redis
CMD redis-cli ping || exit 1

# MongoDB
CMD mongo --eval "db.adminCommand('ismaster')" || exit 1
```

### File-based Checks

```bash
# Check if file exists
CMD test -f /app/ready || exit 1

# Check if process is running
CMD pgrep -f "my-app" || exit 1

# Check disk space
CMD df -h / | awk 'NR==2{if($5+0<90) exit 0; else exit 1}'
```

## Monitoring Health Checks

### Check Container Health Status

```bash
# View container health status
docker ps

# Inspect health check details
docker inspect container-name | grep -A 10 "Health"

# View health check logs
docker inspect container-name | jq '.[0].State.Health'
```

### Health Check Events

```bash
# Monitor health check events
docker events --filter container=container-name --filter event=health_status
```

## Best Practices

### 1. **Choose Appropriate Intervals**

```dockerfile
# For critical services - frequent checks
HEALTHCHECK --interval=10s --timeout=5s --retries=3

# For less critical services - less frequent
HEALTHCHECK --interval=60s --timeout=10s --retries=3
```

### 2. **Set Realistic Timeouts**

```dockerfile
# Database connections may take longer
HEALTHCHECK --timeout=30s CMD pg_isready || exit 1

# Simple HTTP checks can be faster
HEALTHCHECK --timeout=5s CMD curl -f http://localhost || exit 1
```

### 3. **Use Start Period for Slow Applications**

```dockerfile
# Java applications may need longer startup time
HEALTHCHECK --start-period=2m CMD curl -f http://localhost:8080/health || exit 1
```

### 4. **Create Dedicated Health Endpoints**

```javascript
// Express.js health endpoint
app.get("/health", (req, res) => {
  // Check database connection
  // Check external services
  // Return appropriate status
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});
```

### 5. **Disable Health Checks When Not Needed**

```dockerfile
# Disable inherited health checks
HEALTHCHECK NONE
```

## Troubleshooting

### Common Issues

#### 1. Health Check Command Not Found

```dockerfile
# Install required tools
RUN apt-get update && apt-get install -y curl
HEALTHCHECK CMD curl -f http://localhost || exit 1
```

#### 2. Permissions Issues

```dockerfile
# Ensure health check script is executable
COPY health-check.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/health-check.sh
```

#### 3. Network Issues

```dockerfile
# Use localhost or 127.0.0.1
HEALTHCHECK CMD curl -f http://127.0.0.1:8080 || exit 1
```

### Debugging Health Checks

```bash
# Run health check manually inside container
docker exec container-name curl -f http://localhost

# Check health check logs
docker logs container-name

# View detailed health information
docker inspect container-name --format='{{json .State.Health}}' | jq
```

## Advanced Examples

### Multi-Stage Health Check

```dockerfile
FROM node:16 AS build
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
COPY --from=build /node_modules ./node_modules
COPY . .
EXPOSE 3000

# Comprehensive health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node health-check.js || exit 1

CMD ["node", "server.js"]
```

```javascript
// health-check.js
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/health",
  method: "GET",
  timeout: 5000,
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on("error", () => {
  process.exit(1);
});

req.on("timeout", () => {
  req.destroy();
  process.exit(1);
});

req.end();
```

### Health Check with External Dependencies

```dockerfile
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
  CMD /usr/local/bin/comprehensive-health-check.sh
```

```bash
#!/bin/bash
# comprehensive-health-check.sh

# Check application endpoint
if ! curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "Application health check failed"
    exit 1
fi

# Check database connection
if ! nc -z db-host 5432 >/dev/null 2>&1; then
    echo "Database connection failed"
    exit 1
fi

# Check Redis connection
if ! redis-cli -h redis-host ping >/dev/null 2>&1; then
    echo "Redis connection failed"
    exit 1
fi

echo "All health checks passed"
exit 0
```

## Integration with Orchestrators

### Docker Swarm

```bash
# Deploy service with health check
docker service create \
  --name web-app \
  --health-cmd "curl -f http://localhost:8080/health || exit 1" \
  --health-interval 30s \
  --health-retries 3 \
  --health-timeout 10s \
  --health-start-period 30s \
  my-web-app:latest
```

### Kubernetes Readiness Probe

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
