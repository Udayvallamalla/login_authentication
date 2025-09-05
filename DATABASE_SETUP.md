# MySQL Database Setup Guide

## Prerequisites
1. Install MySQL Server on your system
2. Make sure MySQL service is running

## Configuration Steps

### 1. Update Database Configuration
Edit the `db-config.js` file with your MySQL credentials:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username', // Usually 'root'
  password: 'your_mysql_password', // Your MySQL password
  database: 'form_database', // Database name (will be created automatically)
  port: 3306, // Default MySQL port
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};
```

### 2. Database and Table Creation
The application will automatically:
- Create the database `form_database` if it doesn't exist
- Create the `users` table with the following structure:

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

### 3. Manual Database Setup (Optional)
If you prefer to create the database manually:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE form_database;

-- Use the database
USE form_database;

-- Create users table
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

## Running the Application

### 1. Start the Server
```bash
npm run server
```

### 2. Start the React App
```bash
npm run dev
```

### 3. Start Both Together
```bash
npm start
```

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/health` - Health check

## Troubleshooting

### Common Issues:

1. **Connection Error**: Make sure MySQL is running and credentials are correct
2. **Port 3001 in use**: Change the PORT variable in server.js
3. **Database access denied**: Check MySQL user permissions
4. **CORS errors**: Make sure the server is running on port 3001

### Testing the Connection:
1. Start the server: `npm run server`
2. Visit: http://localhost:3001/api/health
3. Should return: `{"status":"OK","message":"Server is running"}`