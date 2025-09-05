// Database configuration
// Update these values according to your MySQL setup

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Uday6264@',
  database: 'mine',
  port: 3306, // Default MySQL port
  connectionLimit: 10, // Maximum number of connections in pool
  waitForConnections: true,
  queueLimit: 0
};

export default dbConfig;