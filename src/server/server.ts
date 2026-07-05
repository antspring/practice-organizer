import { Express } from 'express';

import { appConfig } from '../config/appConfig';

export const startServer = (app: Express) => {
  const server = app.listen(appConfig.port, () => {
    console.log(`Server is running on http://localhost:${appConfig.port}`);
  });

  return server;
};
