// src/index.ts
import { app } from './app.js';
import { env } from '@config/env.js';
import { logger } from '@common/lib/logger.js';
import { connectPostgres, disconnectPostgres } from '@database/postgres.js';

const start = async () => {
  await connectPostgres();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📖 API docs available at http://localhost:${env.PORT}/api-docs`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await disconnectPostgres();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
