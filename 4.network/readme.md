# Docker Networking Types

## Overview

Docker provides several network drivers to enable communication between containers and external systems.

## Network Types

### 1. **Bridge Network**

```bash
# Default network for containers
docker run -d --name web nginx
docker network ls
```

- **Use Case**: Single-host container communication
- **Isolation**: Limited isolation, containers can communicate
- **Internet Access**: Yes, through NAT
- **DNS**: No automatic DNS resolution between containers

### 2. **Custom Bridge Network**

```bash
# Create custom network
docker network create my-network
docker run -d --network my-network --name web nginx
docker run -d --network my-network --name db mysql
```

- **Use Case**: Better isolation and custom DNS
- **Features**: Built-in DNS resolution, better security
- **Communication**: Containers can reach each other by name
- **Isolation**: Better than default bridge

### 3. **Host Network**

```bash
# Container uses host's network stack
docker run -d --network host nginx
```

- **Use Case**: High performance, direct host access
- **Isolation**: No network isolation
- **Port Mapping**: Not needed (uses host ports directly)
- **Performance**: Highest network performance

### 4. **None Network**

```bash
# No network connectivity
docker run -d --network none alpine
```

- **Use Case**: Maximum isolation, security-sensitive apps
- **Isolation**: Complete network isolation
- **Internet Access**: No
- **Security**: Highest security isolation

### 5. **Overlay Network**

```bash
# Multi-host networking (Docker Swarm)
docker network create -d overlay my-overlay
docker service create --network my-overlay nginx
```

- **Use Case**: Multi-host container communication
- **Isolation**: Encrypted container-to-container communication
- **Requirements**: Docker Swarm mode
- **Scope**: Multi-host clusters

### 6. **Macvlan Network**

```bash
# Direct MAC address assignment
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  my-macvlan

docker run -d --network my-macvlan --name web nginx
```

- **Use Case**: Containers need direct Layer 2 access
- **Features**: Each container gets unique MAC address
- **Network**: Appears as physical device on network
- **Performance**: Near native network performance

### 7. **Ipvlan Network**

```bash
# IP address assignment with shared MAC
docker network create -d ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  my-ipvlan

docker run -d --network my-ipvlan --name web nginx
```

- **Use Case**: Multiple IP addresses with single MAC
- **Features**: Shared MAC address, multiple IPs
- **Modes**: L2 (Layer 2) and L3 (Layer 3) modes
- **Efficiency**: More efficient than macvlan for many containers

## Quick Commands

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge

# Create custom bridge network
docker network create my-network

# Create macvlan network
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my-macvlan

# Create ipvlan network
docker network create -d ipvlan \
  --subnet=192.168.1.0/24 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 my-ipvlan

# Connect container to network
docker network connect my-network container-name

# Disconnect container from network
docker network disconnect my-network container-name

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

- **Use custom bridge networks** for better isolation and DNS
- **Use host network** only when performance is critical
- **Use overlay networks** for multi-host deployments
- **Use macvlan** when containers need direct Layer 2 access
- **Use ipvlan** for efficient multi-IP scenarios
- **Avoid default bridge** for production applications
- **Use none network** for security-sensitive containers

## Common Use Cases

| Network Type   | Best For                      | Performance | Isolation |
| -------------- | ----------------------------- | ----------- | --------- |
| Bridge         | Development/testing           | Good        | Limited   |
| Custom Bridge  | Microservices on single host  | Good        | Good      |
| Host           | High-performance applications | Excellent   | None      |
| None           | Security isolation            | N/A         | Maximum   |
| Overlay        | Docker Swarm clusters         | Good        | Good      |
| Macvlan        | Legacy apps, direct L2 access | Excellent   | Good      |
| Ipvlan         | Multi-IP with shared MAC      | Excellent   | Good      |

---

❤️ **Happy Learning! ** ❤️
