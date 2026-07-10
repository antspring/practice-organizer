import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { errorResponseSchema, practiceReviewDetailsResponseSchema } from '../../shared/docs/apiSchemas';
import {
  reviewApplicationParamsSchema,
  upsertPracticeReviewBodySchema,
} from './reviews.schemas';

const registerReviewsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/reviews/applications/{applicationId}',
    tags: ['Reviews'],
    summary: 'Get practice review by application',
    security: [{ bearerAuth: [] }],
    request: {
      params: reviewApplicationParamsSchema,
    },
    responses: {
      200: {
        description: 'Practice review details',
        content: {
          'application/json': {
            schema: practiceReviewDetailsResponseSchema,
          },
        },
      },
      401: {
        description: 'Missing or invalid access token',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Application not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/reviews/applications/{applicationId}',
    tags: ['Reviews'],
    summary: 'Create or update practice review by application',
    security: [{ bearerAuth: [] }],
    request: {
      params: reviewApplicationParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: upsertPracticeReviewBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Practice review details',
        content: {
          'application/json': {
            schema: practiceReviewDetailsResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid request body',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      401: {
        description: 'Missing or invalid access token',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Application not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
};

export { registerReviewsDocs };
