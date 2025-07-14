# Docker Networking Types

## Overview

Docker provides several network drivers to enable communication between containers and external systems.

## Network Types

### 1. **Bridge Network** (Default)

```bash
# Default network for containers
docker run -d --name web nginx
docker network ls
```

- **Use Case**: Single-host container communication
- **Isolation**: Containers can communicate with each other
- **Internet Access**: Yes, through NAT

### 2. **Host Network**

```bash
# Container uses host's network stack
docker run -d --network host nginx
```

- **Use Case**: High performance, direct host access
- **Isolation**: No network isolation
- **Port Mapping**: Not needed (uses host ports directly)

### 3. **None Network**

```bash
# No network connectivity
docker run -d --network none alpine
```

- **Use Case**: Maximum isolation, security-sensitive apps
- **Isolation**: Complete network isolation
- **Internet Access**: No

### 4. **Overlay Network**

```bash
# Multi-host networking (Docker Swarm)
docker network create -d overlay my-overlay
docker service create --network my-overlay nginx
```

- **Use Case**: Multi-host container communication
- **Isolation**: Encrypted container-to-container communication
- **Requirements**: Docker Swarm mode

### 5. **Custom Bridge Network**

```bash
# Create custom network
docker network create my-network
docker run -d --network my-network --name web nginx
docker run -d --network my-network --name db mysql
```

- **Use Case**: Better isolation and custom DNS
- **Features**: Built-in DNS resolution, better security
- **Communication**: Containers can reach each other by name

## Quick Commands

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge

# Create custom network
docker network create my-network

# Connect container to network
docker network connect my-network container-name

# Remove network
docker network rm my-network
```

## Docker Compose Networking

```yaml
version: "3.8"
services:
  web:
    image: nginx
    networks:
      - frontend

  db:
    image: mysql
    networks:
      - backend

networks:
  frontend:
  backend:
```

## Best Practices

- **Use custom bridge networks** for better isolation
- **Use host network** only when performance is critical
- **Use overlay networks** for multi-host deployments
- **Avoid default bridge** for production applications
- **Use none network** for security-sensitive containers

## Common Use Cases

| Network Type   | Best For                      |
| -------------- | ----------------------------- |
| Custom Bridge  | Microservices on single host  |
| Host           | High-performance applications |
| Overlay        | Docker Swarm clusters         |
| None           | Security isolation            |
| Default Bridge | Development/testing           |

---

❤️ **Happy Learning! ** ❤️
