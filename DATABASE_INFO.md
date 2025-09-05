# 🗄️ Database Configuration Details

## Current Database Settings

| Setting | Value |
|---------|-------|
| **Host** | `localhost` |
| **User** | `root` |
| **Password** | `Uday6264@` |
| **Database Name** | `mine` |
| **Port** | `3306` |
| **Connection Pool** | 10 connections |

## 📁 Configuration Files

### 1. Main Config File: `db-config.js`
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Uday6264@',
  database: 'mine',
  port: 3306,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};
```

### 2. Server Implementation: `server.js`
- Imports config from `db-config.js`
- Creates MySQL connection pool
- Auto-creates database and table if they don't exist

## 🔧 Available Commands

### View Database Configuration
```bash
npm run db-config
```

### Test Database Connection
```bash
# Health check
curl http://localhost:3001/api/health

# Database info (without password)
curl http://localhost:3001/api/db-info

# View all users
curl http://localhost:3001/api/users
```

## 📊 Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phoneNumber VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/db-info` | Database configuration info |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## 🔐 Security Notes

- Password is stored in `db-config.js` (not exposed in API responses)
- CORS enabled for frontend communication
- Input validation on all endpoints
- SQL injection protection with prepared statements

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm run server
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Start both together:**
   ```bash
   npm start
   ```

## ✅ Connection Status

- ✅ Database: `mine` 
- ✅ User: `root`
- ✅ Password: Set and working
- ✅ Connection: Active
- ✅ Table: `users` created automatically
- ✅ API: All endpoints functional

---

*Last updated: $(date)*