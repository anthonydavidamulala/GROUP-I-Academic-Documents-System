const path = require('path');
require('dotenv').config({ quiet: true });
const express = require('express');
const pool = require('./db/database');
const requestRoutes = require('./routes/requests');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/requests', requestRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});
app.use(errorHandler);

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL database connected');
  } catch (error) {
    console.error('MySQL connection failed. Start MySQL, import schema.sql, and check .env settings.');
    // Keep the pages available so setup problems can be diagnosed.
  }

  const port = Number(process.env.PORT || 3000);
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  server.on('error', (error) => {
    console.error(`Server could not start (${error.code || 'unknown error'}). Check PORT.`);
    pool.end().finally(() => { process.exitCode = 1; });
  });
}

// Importing app lets the smoke tests start it on a free temporary port.
if (require.main === module) {
  startServer();
}

module.exports = app;
