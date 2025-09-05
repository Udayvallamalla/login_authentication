import mysql from 'mysql2/promise';
import dbConfig from './db-config.js';

async function testDbConnection() {
  let connection;
  try {
    console.log('------------------------------------');
    console.log('DATABASE CONNECTION TEST');
    console.log('------------------------------------');

    // Step 1: Test connection to the MySQL server itself
    console.log(`Attempting to connect to MySQL server at ${dbConfig.host}:${dbConfig.port}...`);
    const serverConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    console.log('✅ Step 1/2: Successfully connected to MySQL server.');
    await serverConnection.end();

    // Step 2: Test connection to the specific database
    console.log(`Attempting to connect to database "${dbConfig.database}"...`);
    connection = await mysql.createConnection(dbConfig);
    console.log(`✅ Step 2/2: Successfully connected to database "${dbConfig.database}".`);

    console.log('\n🎉 SUCCESS! Your database connection is configured correctly.');
    console.log('You can now start your server with `npm run server`.');

  } catch (error) {
    console.error('\n❌ FAILED: Database connection test failed.');
    console.error('------------------------------------');
    console.error('Error Details:');
    console.error(`  Code:    ${error.code}`);
    console.error(`  Message: ${error.message}`);
    console.error('------------------------------------');
    console.error('Troubleshooting Tips:');

    if (error.code === 'ECONNREFUSED') {
      console.error('  - Is your MySQL server running?');
      console.error(`  - Is it accessible at ${dbConfig.host}:${dbConfig.port}? Check your firewall.`);
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  - Are the username and password in `db-config.js` correct?');
      console.error(`    - User: '${dbConfig.user}'`);
      console.error(`    - Password: '********'`);
    }
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`  - The database "${dbConfig.database}" does not seem to exist.`);
      console.error('    - Run the main server first (`npm run server`) to create it automatically.');
    }
    console.error('  - Double-check all values in your `c:\\Users\\hi\\Desktop\\Form - Copy\\form-filling\\db-config.js` file.');
    console.error('------------------------------------');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDbConnection();