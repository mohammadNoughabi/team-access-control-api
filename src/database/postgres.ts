import { Pool } from 'pg';
import { env } from '@config/env.js';
import { logger } from '@common/lib/logger.js';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
});

pool.on('error', (err) => {
  logger.error(err, 'Unexpected Postgres pool error');
});

export const connectPostgres = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('✅ Postgres connected');
  } finally {
    client.release();
  }
};

export const disconnectPostgres = async () => {
  await pool.end();
  logger.info('Postgres pool closed');
};
