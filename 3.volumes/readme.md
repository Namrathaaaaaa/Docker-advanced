# Docker Volumes: From Basics to Advanced

## Table of Contents

1. [What are Docker Volumes?](#what-are-docker-volumes)
2. [Types of Storage](#types-of-storage)
3. [Basic Operations](#basic-operations)
4. [Practical Examples](#practical-examples)
5. [Advanced Topics](#advanced-topics)
6. [Best Practices](#best-practices)

## What are Docker Volumes?

Docker Volumes solve the problem of data persistence in containers. By default, containers are ephemeral - when they stop, all data is lost. Volumes provide a way to persist and share data between containers.

### Key Benefits:

- **Persistent**: Data survives container restarts and deletions
- **Shareable**: Multiple containers can mount the same volume
- **Portable**: Easy to backup, restore, and migrate
- **Performant**: Better I/O performance than alternatives

## Types of Storage

### 1. **Named Volumes** (Recommended)

```bash
# Create and use named volume
docker volume create myvolume
docker run -v myvolume:/app/data nginx
```

- Managed by Docker
- Easy to backup and share
- Best for production

### 2. **Bind Mounts**

```bash
# Mount host directory
docker run -v /host/path:/container/path nginx
docker run -v $(pwd):/app/src node:16  # Development
```

- Direct host filesystem mapping
- Good for development
- Real-time file changes

### 3. **Anonymous Volumes**

```bash
# Temporary volume
docker run -v /app/data nginx
```

- No specific name
- Cleaned up automatically
- For temporary data

## Basic Operations

### Volume Management

```bash
# Create volume
docker volume create myvolume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect myvolume

# Remove volume
docker volume rm myvolume

# Clean up unused volumes
docker volume prune
```

### Using Volumes

```bash
# Mount named volume
docker run -v myvolume:/app/data nginx

# Mount with read-only access
docker run -v myvolume:/app/data:ro nginx

# Mount host directory (bind mount)
docker run -v /host/path:/container/path nginx
```

## Practical Examples

### Database with Persistent Storage

```bash
# MySQL with persistent data
docker volume create mysql-data
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

### Development Environment

```bash
# Node.js development with live reload
docker run -d \
  --name dev-server \
  -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v node_modules:/app/node_modules \
  node:16 npm run dev
```

### Docker Compose Example

```yaml
version: "3.8"
services:
  web:
    image: nginx
    volumes:
      - web-data:/usr/share/nginx/html
      - ./config:/etc/nginx/conf.d:ro

  db:
    image: postgres:13
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  web-data:
  postgres-data:
```

## Advanced Topics

### Volume Backup & Restore

```bash
# Backup volume
docker run --rm -v myvolume:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# Restore volume
docker run --rm -v myvolume:/data -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

### Volume Migration

```bash
# Export volume to another host
docker run --rm -v myvolume:/data alpine tar cz -C /data . | \
  ssh user@remote-host 'docker run --rm -i -v myvolume:/data alpine tar xz -C /data'
```

### Volume with Custom Drivers

```bash
# NFS volume
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.100,rw \
  --opt device=:/path/to/share \
  nfs-volume

# Volume with labels
docker volume create \
  --label environment=production \
  --label backup=daily \
  prod-data
```

### Performance Optimization

```bash
# tmpfs for temporary high-performance storage
docker run -v myvolume:/data:tmpfs alpine

# Mount options for better performance
docker run -v myvolume:/data:cached myapp     # Read-heavy workloads
docker run -v myvolume:/data:delegated myapp  # Write-heavy workloads
```

## Best Practices

### Naming & Organization

```bash
# Use descriptive names
docker volume create prod-webapp-data
docker volume create dev-webapp-logs

# Use labels for organization
docker volume create --label environment=prod --label app=webapp myvolume
```

### Security

```bash
# Read-only mounts when possible
docker run -v config:/app/config:ro myapp

# Fix permissions
docker run --rm -v myvolume:/data alpine chown -R $(id -u):$(id -g) /data
```

### Monitoring & Cleanup

```bash
# Check volume usage
docker system df -v

# Clean unused volumes
docker volume prune

# Monitor specific volume size
docker run --rm -v myvolume:/data alpine du -sh /data
```

### Common Troubleshooting

```bash
# Volume not found - create explicitly
docker volume create myvolume

# Permission denied - fix ownership
docker run --rm -v myvolume:/data alpine chown -R 1000:1000 /data

# Debug mount issues
docker run --rm -v myvolume:/data alpine ls -la /data
docker inspect container-name | grep -A 5 '"Mounts"'
```

## Quick Reference

### Essential Commands

```bash
# Volume lifecycle
docker volume create myvolume
docker volume ls
docker volume inspect myvolume
docker volume rm myvolume
docker volume prune

# Using volumes
docker run -v myvolume:/path container
docker run -v /host:/container container
docker run -v /container container  # anonymous

# Backup & restore
docker run --rm -v vol:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .
docker run --rm -v vol:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

### Volume Types Summary

- **Named volumes**: `docker run -v myvolume:/path` - Best for production
- **Bind mounts**: `docker run -v /host:/container` - Best for development
- **Anonymous volumes**: `docker run -v /path` - Best for temporary data

Remember: Always backup important data and use appropriate volume types for your use case!
