import 'dotenv/config';
import { Pool } from 'pg';

// =============================
// LOGGER UTILITY (for database operations)
// =============================
const logger = {
  info: (message) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
  warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
  error: (message) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
  debug: (message) => {
    if (process.env.DEBUG_MODE?.toLowerCase() === 'true') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  },
};

// =============================
// DATABASE CONFIGURATION
// =============================
const getPassword = () => {
  const password = process.env.DB_PASSWORD;
  if (password === undefined || password === null) return '';
  return String(password);
};

let dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'n8n_db',
  user: process.env.DB_USER || 'n8n_user',
  password: getPassword(),
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10),
  ssl: { rejectUnauthorized: false },
};

// Support DATABASE_URL if provided
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig.host = url.hostname || dbConfig.host;
    dbConfig.port = url.port ? parseInt(url.port, 10) : dbConfig.port;
    dbConfig.database = url.pathname.slice(1) || dbConfig.database;
    dbConfig.user = url.username || dbConfig.user;
    dbConfig.password = (url.password !== null && url.password !== undefined) ? String(url.password) : dbConfig.password;
    if (url.searchParams.get('sslmode') === 'require') {
      dbConfig.ssl = { rejectUnauthorized: false };
    }
    logger.info('✅ Using DATABASE_URL for connection configuration');
  } catch (error) {
    logger.error('❌ Invalid DATABASE_URL format:', error.message);
    throw new Error('Invalid DATABASE_URL configuration');
  }
}

dbConfig.password = dbConfig.password !== null && dbConfig.password !== undefined ? String(dbConfig.password) : '';

if (!dbConfig.host || !dbConfig.database || !dbConfig.user) {
  logger.error('❌ Database configuration incomplete. Missing required fields.');
  throw new Error('Invalid database configuration: missing required fields');
}

// =============================
// CONNECTION POOL
// =============================
const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client:', { message: err.message, code: err.code });
});

// =============================
// DATABASE FUNCTIONS
// =============================

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    logger.info('✅ PostgreSQL connection successful');
    logger.debug(`Database time: ${result.rows[0].current_time}`);
    logger.debug(`PostgreSQL version: ${result.rows[0].pg_version.split(',')[0]}`);
    client.release();
    return true;
  } catch (error) {
    if (client) client.release();
    logger.error('❌ PostgreSQL connection failed');
    logger.error(`Error message: ${error.message}`);
    if (error.message && error.message.includes('client password must be a string')) {
      logger.error('❌ Password configuration error: Password must be a string.');
      logger.error('❌ Check your DB_PASSWORD environment variable.');
    }
    return false;
  }
}

/**
 * Execute a database query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function query(text, params = []) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Query text must be a non-empty string');
    }
    const result = await pool.query(text, params);
    if (process.env.DEBUG_MODE === 'true') {
      logger.debug(`Query executed: ${text.substring(0, 100)}...`);
    }
    return result;
  } catch (error) {
    logger.error('Query error:', { query: text.substring(0, 200), error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} PostgreSQL client
 */
export async function getClient() {
  try {
    const client = await pool.connect();
    if (process.env.DEBUG_MODE === 'true') {
      logger.debug(`Client acquired from pool. Pool stats - Total: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount}`);
    }
    return client;
  } catch (error) {
    logger.error('Failed to get client from pool:', { message: error.message, code: error.code });
    throw error;
  }
}

/**
 * Close all connections in the pool
 * @returns {Promise<void>}
 */
export async function closePool() {
  try {
    logger.info('Closing PostgreSQL connection pool...');
    await pool.end();
    logger.info('✅ PostgreSQL pool closed successfully');
  } catch (error) {
    logger.error('Error closing PostgreSQL pool:', error.message);
    throw error;
  }
}

/**
 * Get current pool statistics
 * @returns {Object} Pool statistics
 */
export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: pool.options.max,
  };
}

/**
 * Log database configuration
 */
export function logDatabaseConfig() {
  logger.info('Database Configuration');
  logger.info('='.repeat(60));
  logger.info(`DB Host: ${process.env.DB_HOST || 'localhost'}`);
  logger.info(`DB Port: ${process.env.DB_PORT || '5432'}`);
  logger.info(`DB Name: ${process.env.DB_NAME || 'n8n_db'}`);
  logger.info(`DB User: ${process.env.DB_USER || 'n8n_user'}`);
  logger.info(`DB Password: ${process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET'}`);
  logger.info('='.repeat(60));
}

// Export pool for direct access
export { pool };
