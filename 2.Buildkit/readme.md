# 🚀 Docker BuildKit Basics

Docker BuildKit is an enhanced backend for building Docker images that brings major improvements over the legacy builder. It improves performance, adds new features, and enhances security.

---

## 🧠 What is BuildKit?

BuildKit is a modern build subsystem for Docker introduced in Docker 18.09. It supports:

- **Faster builds** through parallelization
- **Better caching** and layer reuse
- **Secrets management** (without baking secrets into the image)
- **Advanced Dockerfile features** (`RUN --mount`, inline cache, etc.)
- **Multi-platform builds**

---

## 🔧 How to Enable BuildKit

### 🟢 Temporarily (one-time)

```bash
DOCKER_BUILDKIT=1 docker build .
```
