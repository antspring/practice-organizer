import express from 'express';

import { router } from '../routes';
import { errorHandler } from '../shared/http/middlewares/errorHandler';
import { notFoundHandler } from '../shared/http/middlewares/notFoundHandler';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
