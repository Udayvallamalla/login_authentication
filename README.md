# User Authentication & Management System with React,Node, and MySQL

A full-stack MERN-like (MySQL instead of MongoDB) application featuring a React frontend, an Node.js backend, and a MySQL database. This project provides a complete system for user registration, login, and management of a separate user data list.

## Features

-   **Authentication System:**
    -   Secure user registration with password hashing (bcrypt).
    -   User login with JWT (JSON Web Token) generation.
    -   Protected API routes requiring a valid JWT.
    -   Endpoint to verify a token and fetch user data.
-   **User Data Management (Protected):**
    -   Add new users with form validation.
    -   View all users in a paginated table format.
    -   Update existing user information.
    -   Delete users.
-   **Backend:**
    -   RESTful API built with Express.js.
    -   Robust database initialization (creates DB and tables if they don't exist).
    -   CORS enabled for frontend communication.
-   **Frontend:**
    -   Modern UI built with React 19.
    -   Global state management for authentication using React Context.
    -   Client-side routing and protected routes.
    -   Real-time error handling and success messages.
-   **Development & Tooling:**
    -   Concurrent server and client startup.
    -   Server auto-reloading on file changes (`--watch`).
    -   Utility scripts for database testing and management.

## Prerequisites

Before running this application, make sure you have:

1.  **Node.js** (v18 or higher recommended)
2.  **MySQL Server** installed and running.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd form-filling
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MySQL Database
1. Make sure MySQL server is running
2. Edit `db-config.js` with your MySQL credentials. The application will automatically create the database and tables for you on the first run.

```javascript
// c:\Users\hi\Desktop\Form - Copy\form-filling\db-config.js
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username', // Usually 'root'
  password: 'your_mysql_password', // Your MySQL password
  database: 'mine', // Database name (will be created automatically)
  port: 3306,
  // ...
};
```

### 3. Run the Application

#### Option 1: Run both server and client together
```bash
npm start
```

#### Option 2: Run separately
Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Database Schema

The application automatically creates a `users` table with the following structure:

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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/health` | Health check |

## Project Structure

```
form-filling/
├── src/
│   ├── components/
│   │   ├── form.jsx          # User form component
│   │   └── UserList.jsx      # User list component
│   ├── App.jsx               # Main app component
│   └── main.jsx              # App entry point
├── server.js                 # Express server
├── db-config.js              # Database configuration
├── DATABASE_SETUP.md         # Database setup guide
└── package.json              # Dependencies and scripts
```

## Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **UUID** - Unique ID generation

### Backend
- **Express.js** - Web framework
- **MySQL2** - MySQL driver
- **CORS** - Cross-origin resource sharing

## Troubleshooting

### Common Issues

1. **"Cannot connect to server"**
   - Make sure the backend server is running on port 3001
   - Check if MySQL is running

2. **"Access denied for user"**
   - Verify MySQL credentials in `db-config.js`
   - Make sure the MySQL user has proper permissions

3. **"Port 3001 already in use"**
   - Change the PORT variable in `server.js`
   - Kill the process using port 3001

4. **"Database connection failed"**
   - Verify MySQL server is running
   - Check database credentials
   - Ensure MySQL is accepting connections on port 3306

### Testing the Setup

1. **Test Backend**:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Database Connection**:
   - Start the server and check console logs
   - Should see: "Connected to MySQL database successfully!"

## Development

### Adding New Features
1. Add new API endpoints in `server.js`
2. Create new React components in `src/components/`
3. Update the main `App.jsx` as needed

### Database Migrations
- The application automatically creates the database and table
- For schema changes, update the table creation query in `server.js`


