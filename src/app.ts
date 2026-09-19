import express from 'express';
import { errorHandler } from '@common/middlewares/errorHandler.js';
import { setupSwagger } from '@config/swagger.js';
import router from '@routes/index.js';

export const app = express();

app.use(express.json());

setupSwagger(app);

app.use('/api', router);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

app.use(errorHandler);
