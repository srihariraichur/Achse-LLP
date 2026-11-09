/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MySQL Database Connection & Query Module
 * Configured using secrets:
 * - DB_HOST
 * - DB_USER
 * - DB_PASS
 * - DB_NAME
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;

export interface DbConfigStatus {
  hasHost: boolean;
  hasUser: boolean;
  hasPass: boolean;
  hasName: boolean;
  isFullyConfigured: boolean;
}

export function getDbConfigStatus(): DbConfigStatus {
  const hasHost = Boolean(process.env.DB_HOST);
  const hasUser = Boolean(process.env.DB_USER);
  const hasPass = Boolean(process.env.DB_PASS);
  const hasName = Boolean(process.env.DB_NAME);

  return {
    hasHost,
    hasUser,
    hasPass,
    hasName,
    isFullyConfigured: hasHost && hasUser && hasName,
  };
}

function cleanSecret(val?: string): string {
  if (!val) return '';
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  return str;
}

let currentConfigKey = '';

export function getDbPool(): mysql.Pool {
  const host = cleanSecret(process.env.DB_HOST) || 'localhost';
  const user = cleanSecret(process.env.DB_USER) || 'root';
  const password = cleanSecret(process.env.DB_PASS);
  const database = cleanSecret(process.env.DB_NAME);
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT.trim(), 10) : 3306;
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

  const configKey = `${host}:${port}:${user}:${database}:${process.env.DB_SSL}`;

  if (!pool || configKey !== currentConfigKey) {
    if (pool) {
      pool.end().catch(() => {});
    }
    currentConfigKey = configKey;
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      ssl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

/**
 * Executes a simple query to test the MySQL database connection.
 * Tests basic arithmetic, server timestamp, selected database, and engine version.
 */
export async function testDbConnection() {
  const host = cleanSecret(process.env.DB_HOST) || 'localhost';
  const user = cleanSecret(process.env.DB_USER) || 'root';
  const password = cleanSecret(process.env.DB_PASS);
  const database = cleanSecret(process.env.DB_NAME);
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT.trim(), 10) : 3306;
  const sslConfigured = process.env.DB_SSL === 'true';

  // Attempt connection (with auto-fallback to SSL if non-SSL drops)
  try {
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: sslConfigured ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 8000,
    });

    try {
      const [rows] = await conn.query(
        'SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version'
      );
      return rows;
    } finally {
      await conn.end().catch(() => {});
    }
  } catch (err: any) {
    // If connection dropped and SSL was not set, attempt with SSL
    if (err.code === 'PROTOCOL_CONNECTION_LOST' && !sslConfigured) {
      try {
        const connSsl = await mysql.createConnection({
          host,
          port,
          user,
          password,
          database,
          ssl: { rejectUnauthorized: false },
          connectTimeout: 8000,
        });

        try {
          const [rows] = await connSsl.query(
            'SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version'
          );
          return rows;
        } finally {
          await connSsl.end().catch(() => {});
        }
      } catch (sslErr) {
        // rethrow original error
        throw err;
      }
    }
    throw err;
  }
}
