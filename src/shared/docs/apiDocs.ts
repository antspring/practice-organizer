import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { appConfig } from '../../config/appConfig';
import { openApiDocument } from './openApiDocument';

const isApiDocsEnabled = () => {
  return appConfig.nodeEnv !== 'production';
};

const setupApiDocs = (app: Express) => {
  if (!isApiDocsEnabled()) {
    return;
  }

  app.get('/docs.json', (_request, response) => {
    response.status(200).json(openApiDocument);
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'Practice Organizer API Docs',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
};

export { setupApiDocs };
