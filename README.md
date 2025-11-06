# Handmade Hub - Full-Stack E-Commerce Platform

✅ **Production-Ready** marketplace platform for home-based entrepreneurs to sell handcrafted products.

**Built with:** React + Node.js + MySQL + Docker

**Repository:** https://github.com/sw-i/handmade

---

## ⚡ Quick Start with Docker

**Choose your setup method:**

### 🌐 Online Setup (Recommended)
See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for step-by-step instructions.

```bash
# 1. Clone repository
git clone https://github.com/sw-i/handmade.git
cd handmade

# 2. Create .env file (required)
cp .env.example .env
# Edit .env and update JWT_SECRET values

# 3. Start everything
docker-compose up -d --build

# 4. Visit http://localhost:3000 (wait ~5 mins for first build)
```
