import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import {
  applicationAutofillResponseSchema,
  errorResponseSchema,
  practiceApplicationDetailsResponseSchema,
  practiceApplicationsListResponseSchema,
} from '../../shared/docs/apiSchemas';
import {
  applicationAutofillParamsSchema,
  applicationIdParamsSchema,
  createApplicationSchema,
  updateApplicationSchema,
} from './applications.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerApplicationsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/applications/me',
    tags: ['Applications'],
    summary: 'List current student applications',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Current student applications',
        content: jsonContent(practiceApplicationsListResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
      403: {
        description: 'Forbidden',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/applications',
    tags: ['Applications'],
    summary: 'Create practice application',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: jsonContent(createApplicationSchema),
      },
    },
    responses: {
      201: {
        description: 'Practice application created',
        content: jsonContent(practiceApplicationDetailsResponseSchema),
      },
      400: {
        description: 'Validation error',
        content: jsonContent(errorResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
      403: {
        description: 'Forbidden',
        content: jsonContent(errorResponseSchema),
      },
      404: {
        description: 'Cohort not found',
        content: jsonContent(errorResponseSchema),
      },
      409: {
        description: 'Application already exists',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/applications/autofill/{cohortId}',
    tags: ['Applications'],
    summary: 'Get autofill answers for new application',
    security: [{ bearerAuth: [] }],
    request: {
      params: applicationAutofillParamsSchema,
    },
    responses: {
      200: {
        description: 'Autofill answers',
        content: jsonContent(applicationAutofillResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
      403: {
        description: 'Forbidden',
        content: jsonContent(errorResponseSchema),
      },
      404: {
        description: 'Cohort not found',
        content: jsonContent(errorResponseSchema),
      },
      409: {
        description: 'Application already exists',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/applications/{id}',
    tags: ['Applications'],
    summary: 'Update current student pending application',
    security: [{ bearerAuth: [] }],
    request: {
      params: applicationIdParamsSchema,
      body: {
        required: true,
        content: jsonContent(updateApplicationSchema),
      },
    },
    responses: {
      200: {
        description: 'Practice application updated',
        content: jsonContent(practiceApplicationDetailsResponseSchema),
      },
      400: {
        description: 'Validation error',
        content: jsonContent(errorResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
      403: {
        description: 'Forbidden',
        content: jsonContent(errorResponseSchema),
      },
      404: {
        description: 'Application not found',
        content: jsonContent(errorResponseSchema),
      },
    },
  });
};

export { registerApplicationsDocs };
