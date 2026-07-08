import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import { errorResponseSchema, practiceProfileDetailsResponseSchema } from '../../shared/docs/apiSchemas';
import { updatePracticeProfileSchema } from './profiles.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerProfilesDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/profiles/me',
    tags: ['Profiles'],
    summary: 'Get current student practice profile',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Current student practice profile',
        content: jsonContent(practiceProfileDetailsResponseSchema),
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
    method: 'patch',
    path: '/profiles/me',
    tags: ['Profiles'],
    summary: 'Update current student practice profile',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: jsonContent(updatePracticeProfileSchema),
      },
    },
    responses: {
      200: {
        description: 'Current student practice profile updated',
        content: jsonContent(practiceProfileDetailsResponseSchema),
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
    },
  });
};

export { registerProfilesDocs };
