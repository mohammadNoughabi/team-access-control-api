import helmet from 'helmet';
import cors from 'cors';
import type { Express } from 'express';

export const applySecurityMiddleware = (app: Express) => {
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
};
