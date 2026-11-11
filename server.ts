/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Express Full-Stack Server
 * Integrates Vite middleware in dev and MySQL database connection via mysql2.
 * Uses secrets: DB_HOST, DB_USER, DB_PASS, DB_NAME
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDbPool, getDbConfigStatus, testDbConnection } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConfigured: getDbConfigStatus(),
  });
});

// MySQL connection test endpoint
app.get('/api/db-test', async (_req: Request, res: Response) => {
  const status = getDbConfigStatus();

  if (!status.hasHost || !status.hasUser) {
    return res.status(503).json({
      success: false,
      message: 'MySQL secrets are not yet configured in environment variables.',
      requiredSecrets: ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'],
      currentStatus: status,
    });
  }

  try {
    const startTime = Date.now();
    const result = await testDbConnection();
    const durationMs = Date.now() - startTime;

    return res.json({
      success: true,
      message: 'Successfully connected to MySQL database and executed test query!',
      query: 'SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version',
      result,
      durationMs,
      connectionInfo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        database: process.env.DB_NAME || '(none selected)',
      },
    });
  } catch (error: any) {
    console.error('MySQL connection test query failed:', error);
    let hint: string | undefined;
    if (error.code === 'ENOTFOUND' && process.env.DB_HOST?.includes('stackcp')) {
      hint = 'StackCP internal hostnames (sdb-*.hosting.stackcp.net) only resolve inside StackCP hosting. For external connections, go to StackCP -> Web Tools -> Remote MySQL Access, whitelist % (all hosts) or your IP, and use the remote proxy hostname (e.g., mysql.gb.stackcp.com or mysql.us.stackcp.com) and the specific port shown on that page.';
    } else if (
      (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') &&
      process.env.DB_HOST?.includes('stackcp.com') &&
      (!process.env.DB_PORT || process.env.DB_PORT === '3306')
    ) {
      hint = 'StackCP uses a unique custom port for each database on mysql.gb.stackcp.com rather than the default 3306. Check your StackCP "Remote MySQL Access" page for the specific port assigned to your database, and configure the DB_PORT secret with that number.';
    }

    return res.status(500).json({
      success: false,
      message: 'MySQL connection failed',
      error: error.message || String(error),
      code: error.code || 'UNKNOWN_ERROR',
      errno: error.errno,
      sqlState: error.sqlState,
      hint,
      connectionInfo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
      },
    });
  }
});

// Quote Request API (saves to MySQL table if database is accessible)
app.post('/api/quote-request', async (req: Request, res: Response) => {
  const { name, company, email, phone, category, message } = req.body;
  const status = getDbConfigStatus();

  if (status.isFullyConfigured) {
    try {
      const pool = getDbPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS quote_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(100),
          category VARCHAR(100),
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(
        'INSERT INTO quote_requests (name, company, email, phone, category, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name || '', company || '', email || '', phone || '', category || '', message || '']
      );

      return res.json({ success: true, savedToDb: true, message: 'Quote request saved successfully' });
    } catch (err: any) {
      console.warn('Could not persist inquiry to MySQL:', err.message);
    }
  }

  // Graceful fallback if database is not configured
  return res.json({
    success: true,
    savedToDb: false,
    message: 'Quote request logged (database pending configuration)',
  });
});

// Global process guards to prevent server crashing on transient network/db errors
process.on('uncaughtException', (err) => {
  console.error('Unhandled Server Exception (prevented crash):', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection (prevented crash):', reason);
});

async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    } else {
      // Dynamic import of Vite for development server
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);

      // Test connection on startup if secrets are configured
      const status = getDbConfigStatus();
      if (status.hasHost && status.hasUser) {
        console.log(`Connecting to MySQL at ${process.env.DB_HOST} with user ${process.env.DB_USER}...`);
        testDbConnection()
          .then((rows) => {
            console.log('✅ MySQL connection query test succeeded:', rows);
          })
          .catch((err) => {
            console.error('⚠️ MySQL connection test error on startup:', err.message);
          });
      } else {
        console.log('ℹ️ MySQL database secrets (DB_HOST, DB_USER, DB_PASS, DB_NAME) pending configuration in environment variables.');
      }
    });

    server.on('error', (err: any) => {
      console.error('HTTP Server listen error:', err);
    });
  } catch (startupError) {
    console.error('Failed to start server:', startupError);
  }
}

startServer().catch((err) => {
  console.error('Fatal startServer error:', err);
});
