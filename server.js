import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dbConfig from './db-config.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// This will be initialized after we ensure the database exists.
let pool;

// Initialize database, pool, and tables
async function initializeDatabaseAndPool() {
  try {
    // 1. Connect to MySQL server without a specific database
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    console.log('Successfully connected to MySQL server.');

    // 2. Create the database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database "${dbConfig.database}" is ready.`);
    await tempConnection.end();

    // 3. Now, create the pool with the database selected
    pool = mysql.createPool(dbConfig);

    // 4. Get a connection from the pool to create tables
    const connection = await pool.getConnection();
    console.log(`Connected to database "${dbConfig.database}" successfully!`);

    // 5. Create tables if they don't exist
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phoneNumber VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    const createAuthTableQuery = `
      CREATE TABLE IF NOT EXISTS auth_users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        fullName VARCHAR(255),
        isActive BOOLEAN DEFAULT TRUE,
        lastLogin TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createUsersTableQuery);
    await connection.execute(createAuthTableQuery);
    console.log('Tables "users" and "auth_users" are initialized.');

    connection.release();
    return true; // Indicate success
  } catch (error) {
    console.error('FATAL: Could not initialize database.');
    console.error('Please ensure your MySQL server is running and db-config.js is correct.');
    console.error('Error details:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Hint: Check your username and password in db-config.js.');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('Hint: Is the MySQL server running on the configured host and port?');
    }
    return false; // Indicate failure
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if username already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM auth_users WHERE username = ?', 
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Check if email already exists (if provided)
    if (email) {
      const [existingEmails] = await pool.execute(
        'SELECT id FROM auth_users WHERE email = ?', 
        [email]
      );
      
      if (existingEmails.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate user ID
    const userId = crypto.randomUUID();
    
    // Insert new user
    const insertQuery = `
      INSERT INTO auth_users (id, username, password, email, fullName) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await pool.execute(insertQuery, [userId, username, hashedPassword, email || null, fullName || null]);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: userId, username, email, fullName }
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    // Provide more specific error messages during development
    if (error.code === 'ER_DUP_ENTRY') {
      // This is a fallback in case the pre-check fails for some reason
      return res.status(409).json({ error: 'Username or email already exists.' });
    }
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ error: isDev ? error.message : 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Find user by username
    const [users] = await pool.execute(
      'SELECT * FROM auth_users WHERE username = ? AND isActive = TRUE', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Update last login
    await pool.execute(
      'UPDATE auth_users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email,
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Verify token and get user info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, fullName, lastLogin, createdAt FROM auth_users WHERE id = ? AND isActive = TRUE',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// Logout (client-side token removal, but we can track it server-side if needed)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a more complex setup, you might want to blacklist the token
  res.json({ message: 'Logout successful' });
});

// API Routes

// GET all users (protected)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID (protected)
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create new user (protected)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { id, name, gender, email, phoneNumber } = req.body;
    
    // Validate required fields
    if (!id || !name || !gender || !email || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate gender
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }
    
    const insertQuery = `
      INSERT INTO users (id, name, gender, email, phoneNumber) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await pool.execute(insertQuery, [id, name, gender, email, phoneNumber]);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id, name, gender, email, phoneNumber }
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user (protected)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { name, gender, email, phoneNumber } = req.body;
    const userId = req.params.id;
    
    // Validate required fields
    if (!name || !gender || !email || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate gender
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }
    
    const updateQuery = `
      UPDATE users 
      SET name = ?, gender = ?, email = ?, phoneNumber = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(updateQuery, [name, gender, email, phoneNumber, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User updated successfully',
      user: { id: userId, name, gender, email, phoneNumber }
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user (protected)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database info endpoint
app.get('/api/db-info', (req, res) => {
  res.json({
    status: 'Connected',
    database: {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      // Don't expose password for security
      passwordSet: dbConfig.password ? true : false
    },
    message: 'Database configuration details'
  });
});

async function startServer() {
  console.log('Initializing server...');
  const dbReady = await initializeDatabaseAndPool();

  if (!dbReady) {
    console.error('Server cannot start due to database initialization failure.');
    process.exit(1); // Exit with an error code
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (pool) {
    await pool.end();
    console.log('Database pool closed.');
  }
  process.exit(0);
});