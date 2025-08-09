# MongoDB Docker Setup Guide

## 🐳 **Setting Up MongoDB with Docker**

### **Option 1: Quick Start with Docker Run**

```bash
# Run MongoDB container
docker run -d \
  --name vachetta-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=ecommerce-template \
  -v mongodb_data:/data/db \
  mongo:latest

# Check if container is running
docker ps
```

### **Option 2: Docker Compose (Recommended)**

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: vachetta-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: ecommerce-template
    volumes:
      - mongodb_data:/data/db
      - ./docker/mongodb/init:/docker-entrypoint-initdb.d
    networks:
      - vachetta-network

volumes:
  mongodb_data:

networks:
  vachetta-network:
    driver: bridge
```

Run with:
```bash
docker-compose up -d
```

## 🔌 **Connection Methods (RBAC Setup)**

### **1. MongoDB Compass (GUI) - Recommended**
- **Download**: [MongoDB Compass](https://www.mongodb.com/products/compass)
- **Connection String**: `mongodb://localhost:27017/vachetta-db`
- **Note**: No authentication required for development (RBAC is handled at application level)

### **2. MongoDB Shell (CLI)**
```bash
# Connect using Docker exec (recommended)
docker exec -it mongodb-local mongosh vachetta-db

# Or connect from host (requires mongosh installed)
mongosh "mongodb://localhost:27017/vachetta-db"
```

### **3. VS Code Extension**
- **Install**: MongoDB for VS Code extension
- **Connection String**: `mongodb://localhost:27017`
- **Database**: Select `vachetta-db`

### **4. Application Connection (Current RBAC Setup)**
Your current `.env.local` (perfect for RBAC):
```bash
# RBAC-enabled connection (no separate admin database needed)
MONGODB_URI="mongodb://localhost:27017/vachetta-db"
```

## 📊 **Common Docker Commands**

```bash
# Start MongoDB container
docker start vachetta-mongodb

# Stop MongoDB container
docker stop vachetta-mongodb

# View container logs
docker logs vachetta-mongodb

# Remove container (data will persist in volume)
docker rm vachetta-mongodb

# Remove container and volume (⚠️ DELETES ALL DATA)
docker rm vachetta-mongodb
docker volume rm mongodb_data

# Enter container shell
docker exec -it vachetta-mongodb bash

# Backup database
docker exec vachetta-mongodb mongodump --db ecommerce-template --out /backup

# Restore database
docker exec vachetta-mongodb mongorestore --db ecommerce-template /backup/ecommerce-template
```

## 🔍 **Database Operations**

### **Check Collections**
```javascript
// In mongosh
use ecommerce-template
show collections

// List users
db.users.find().pretty()

// Find admin user
db.users.findOne({email: "admin@vachetta.com"})

// Count documents
db.users.countDocuments()
```

### **Admin User Verification**
```javascript
// Check if admin exists
db.users.findOne({role: "admin"})

// List all users with roles
db.users.find({}, {email: 1, name: 1, role: 1, _id: 0})
```

## 🛠️ **Troubleshooting**

### **Port Already in Use**
```bash
# Check what's using port 27017
netstat -ano | findstr :27017

# Kill process (Windows)
taskkill /PID <PID> /F

# Use different port
docker run -p 27018:27017 mongo:latest
# Update MONGODB_URI to mongodb://localhost:27018/ecommerce-template
```

### **Permission Issues**
```bash
# Reset MongoDB data directory permissions
docker exec -it vachetta-mongodb chown -R mongodb:mongodb /data/db
```

### **Connection Refused**
1. Check if container is running: `docker ps`
2. Check container logs: `docker logs vachetta-mongodb`
3. Verify port mapping: `docker port vachetta-mongodb`
4. Test connection: `telnet localhost 27017`

## 🎯 **Quick Setup Commands**

Run these commands in your project directory:

```bash
# 1. Create and start MongoDB container
docker run -d --name vachetta-mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest

# 2. Verify it's running
docker ps

# 3. Test connection
docker exec -it vachetta-mongodb mongosh

# 4. In mongosh, create database and admin user
use ecommerce-template
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [{role: "readWrite", db: "ecommerce-template"}]
})
```

Then update your `.env.local`:
```bash
MONGODB_URI="mongodb://admin:password123@localhost:27017/ecommerce-template?authSource=ecommerce-template"
```
