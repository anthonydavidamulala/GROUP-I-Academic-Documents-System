const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

// A pool reuses connections instead of opening one for every request.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academic_document_system',
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 5000,
  charset: 'utf8mb4',
  timezone: 'Z'
});

// Match MySQL's session clock to the UTC dates returned by the API.
pool.on('connection', (connection) => {
  connection.query("SET time_zone = '+00:00'");
});

module.exports = pool;
