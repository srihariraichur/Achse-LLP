// server.ts
import express from "express";
import dotenv2 from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// src/server/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
var pool = null;
function getDbConfigStatus() {
  const hasHost = Boolean(process.env.DB_HOST);
  const hasUser = Boolean(process.env.DB_USER);
  const hasPass = Boolean(process.env.DB_PASS);
  const hasName = Boolean(process.env.DB_NAME);
  return {
    hasHost,
    hasUser,
    hasPass,
    hasName,
    isFullyConfigured: hasHost && hasUser && hasName
  };
}
function cleanSecret(val) {
  if (!val) return "";
  let str = val.trim();
  if (str.startsWith('"') && str.endsWith('"') || str.startsWith("'") && str.endsWith("'")) {
    str = str.slice(1, -1);
  }
  return str;
}
var currentConfigKey = "";
function getDbPool() {
  const host = cleanSecret(process.env.DB_HOST) || "localhost";
  const user = cleanSecret(process.env.DB_USER) || "root";
  const password = cleanSecret(process.env.DB_PASS);
  const database = cleanSecret(process.env.DB_NAME);
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT.trim(), 10) : 3306;
  const ssl = process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : void 0;
  const configKey = `${host}:${port}:${user}:${database}:${process.env.DB_SSL}`;
  if (!pool || configKey !== currentConfigKey) {
    if (pool) {
      pool.end().catch(() => {
      });
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
      connectTimeout: 8e3,
      enableKeepAlive: true,
      keepAliveInitialDelay: 1e4
    });
  }
  return pool;
}
async function testDbConnection() {
  const host = cleanSecret(process.env.DB_HOST) || "localhost";
  const user = cleanSecret(process.env.DB_USER) || "root";
  const password = cleanSecret(process.env.DB_PASS);
  const database = cleanSecret(process.env.DB_NAME);
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT.trim(), 10) : 3306;
  const sslConfigured = process.env.DB_SSL === "true";
  try {
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: sslConfigured ? { rejectUnauthorized: false } : void 0,
      connectTimeout: 8e3
    });
    try {
      const [rows] = await conn.query(
        "SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version"
      );
      return rows;
    } finally {
      await conn.end().catch(() => {
      });
    }
  } catch (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST" && !sslConfigured) {
      try {
        const connSsl = await mysql.createConnection({
          host,
          port,
          user,
          password,
          database,
          ssl: { rejectUnauthorized: false },
          connectTimeout: 8e3
        });
        try {
          const [rows] = await connSsl.query(
            "SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version"
          );
          return rows;
        } finally {
          await connSsl.end().catch(() => {
          });
        }
      } catch (sslErr) {
        throw err;
      }
    }
    throw err;
  }
}

// server.ts
dotenv2.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    dbConfigured: getDbConfigStatus()
  });
});
app.get("/api/db-test", async (_req, res) => {
  const status = getDbConfigStatus();
  if (!status.hasHost || !status.hasUser) {
    return res.status(503).json({
      success: false,
      message: "MySQL secrets are not yet configured in environment variables.",
      requiredSecrets: ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"],
      currentStatus: status
    });
  }
  try {
    const startTime = Date.now();
    const result = await testDbConnection();
    const durationMs = Date.now() - startTime;
    return res.json({
      success: true,
      message: "Successfully connected to MySQL database and executed test query!",
      query: "SELECT 1 + 1 AS solution, NOW() AS server_time, DATABASE() AS current_database, VERSION() AS mysql_version",
      result,
      durationMs,
      connectionInfo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        database: process.env.DB_NAME || "(none selected)"
      }
    });
  } catch (error) {
    console.error("MySQL connection test query failed:", error);
    let hint;
    if (error.code === "ENOTFOUND" && process.env.DB_HOST?.includes("stackcp")) {
      hint = "StackCP internal hostnames (sdb-*.hosting.stackcp.net) only resolve inside StackCP hosting. For external connections, go to StackCP -> Web Tools -> Remote MySQL Access, whitelist % (all hosts) or your IP, and use the remote proxy hostname (e.g., mysql.gb.stackcp.com or mysql.us.stackcp.com) and the specific port shown on that page.";
    } else if ((error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") && process.env.DB_HOST?.includes("stackcp.com") && (!process.env.DB_PORT || process.env.DB_PORT === "3306")) {
      hint = 'StackCP uses a unique custom port for each database on mysql.gb.stackcp.com rather than the default 3306. Check your StackCP "Remote MySQL Access" page for the specific port assigned to your database, and configure the DB_PORT secret with that number.';
    }
    return res.status(500).json({
      success: false,
      message: "MySQL connection failed",
      error: error.message || String(error),
      code: error.code || "UNKNOWN_ERROR",
      errno: error.errno,
      sqlState: error.sqlState,
      hint,
      connectionInfo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
      }
    });
  }
});
app.post("/api/quote-request", async (req, res) => {
  const { name, company, email, phone, category, message } = req.body;
  const status = getDbConfigStatus();
  if (status.isFullyConfigured) {
    try {
      const pool2 = getDbPool();
      await pool2.query(`
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
      await pool2.query(
        "INSERT INTO quote_requests (name, company, email, phone, category, message) VALUES (?, ?, ?, ?, ?, ?)",
        [name || "", company || "", email || "", phone || "", category || "", message || ""]
      );
      return res.json({ success: true, savedToDb: true, message: "Quote request saved successfully" });
    } catch (err) {
      console.warn("Could not persist inquiry to MySQL:", err.message);
    }
  }
  return res.json({
    success: true,
    savedToDb: false,
    message: "Quote request logged (database pending configuration)"
  });
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    const status = getDbConfigStatus();
    if (status.hasHost && status.hasUser) {
      console.log(`Connecting to MySQL at ${process.env.DB_HOST} with user ${process.env.DB_USER}...`);
      testDbConnection().then((rows) => {
        console.log("\u2705 MySQL connection query test succeeded:", rows);
      }).catch((err) => {
        console.error("\u26A0\uFE0F MySQL connection test error on startup:", err.message);
      });
    } else {
      console.log("\u2139\uFE0F MySQL database secrets (DB_HOST, DB_USER, DB_PASS, DB_NAME) pending configuration in environment variables.");
    }
  });
}
startServer();
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
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Express Full-Stack Server
 * Integrates Vite middleware in dev and MySQL database connection via mysql2.
 * Uses secrets: DB_HOST, DB_USER, DB_PASS, DB_NAME
 */
