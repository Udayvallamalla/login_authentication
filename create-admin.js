import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dbConfig from './db-config.js';

async function createAdminUser() {
  try {
    const pool = mysql.createPool(dbConfig);
    
    // Check if admin user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM auth_users WHERE username = ?', 
      ['admin']
    );
    
    if (existingUsers.length > 0) {
      console.log('Admin user already exists!');
      await pool.end();
      return;
    }
    
    // Create admin user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    const userId = crypto.randomUUID();
    
    const insertQuery = `
      INSERT INTO auth_users (id, username, password, email, fullName) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await pool.execute(insertQuery, [
      userId, 
      'admin', 
      hashedPassword, 
      'admin@example.com', 
      'System Administrator'
    ]);
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@example.com');
    
    await pool.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();