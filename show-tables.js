import mysql from 'mysql2/promise';
import dbConfig from './db-config.js';

async function showDatabaseTables() {
  try {
    const pool = mysql.createPool(dbConfig);
    
    console.log('🗄️  DATABASE TABLES OVERVIEW');
    console.log('=' .repeat(60));
    console.log(`Database: ${dbConfig.database}`);
    console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log('=' .repeat(60));
    
    // Show all tables
    console.log('\n📋 TABLES IN DATABASE:');
    const [tables] = await pool.execute('SHOW TABLES');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });
    
    // Show auth_users table structure
    console.log('\n🔐 AUTH_USERS TABLE STRUCTURE:');
    console.log('-'.repeat(50));
    const [authStructure] = await pool.execute('DESCRIBE auth_users');
    console.table(authStructure);
    
    // Show auth_users data (without passwords)
    console.log('\n👥 AUTH_USERS DATA:');
    console.log('-'.repeat(50));
    const [authUsers] = await pool.execute(`
      SELECT 
        id, 
        username, 
        email, 
        fullName, 
        isActive, 
        lastLogin, 
        createdAt 
      FROM auth_users 
      ORDER BY createdAt DESC
    `);
    
    if (authUsers.length > 0) {
      console.table(authUsers);
    } else {
      console.log('No authentication users found.');
    }
    
    // Show users table structure
    console.log('\n📝 USERS TABLE STRUCTURE:');
    console.log('-'.repeat(50));
    const [usersStructure] = await pool.execute('DESCRIBE users');
    console.table(usersStructure);
    
    // Show users data
    console.log('\n📊 USERS DATA:');
    console.log('-'.repeat(50));
    const [users] = await pool.execute('SELECT * FROM users ORDER BY createdAt DESC LIMIT 10');
    
    if (users.length > 0) {
      console.table(users);
    } else {
      console.log('No form users found.');
    }
    
    // Show table counts
    console.log('\n📈 TABLE STATISTICS:');
    console.log('-'.repeat(30));
    
    const [authCount] = await pool.execute('SELECT COUNT(*) as count FROM auth_users');
    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    console.log(`Auth Users: ${authCount[0].count}`);
    console.log(`Form Users: ${usersCount[0].count}`);
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error accessing database:', error.message);
  }
}

showDatabaseTables();