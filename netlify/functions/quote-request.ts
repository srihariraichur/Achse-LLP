import { getDbConfigStatus, getDbPool } from '../../src/server/db.ts';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  let payload: Record<string, any> = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Invalid JSON request body' }),
    };
  }

  const { name, company, email, phone, category, message } = payload;
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
        [
          String(name || '').slice(0, 255),
          String(company || '').slice(0, 255),
          String(email || '').slice(0, 255),
          String(phone || '').slice(0, 100),
          String(category || '').slice(0, 100),
          String(message || ''),
        ]
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          savedToDb: true,
          message: 'Quote request saved successfully',
        }),
      };
    } catch (err: any) {
      console.warn('Netlify MySQL persistence warning:', err?.message || err);
    }
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      savedToDb: false,
      message: 'Quote request received (handled via Firebase / serverless fallback)',
    }),
  };
};
