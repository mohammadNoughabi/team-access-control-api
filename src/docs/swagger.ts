import { join, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: JSON.parse(readFileSync(join(__dirname, '../..', 'package.json'), 'utf8')).title,
    version: JSON.parse(readFileSync(join(__dirname, '../..', 'package.json'), 'utf8')).version,
    description: 'Auto-generated API documentation',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
