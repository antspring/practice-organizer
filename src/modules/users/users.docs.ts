import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import { errorResponseSchema, usersListResponseSchema } from '../../shared/docs/apiSchemas';
import { listUsersQuerySchema } from './users.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerUsersDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: 'List users',
    security: [{ bearerAuth: [] }],
    request: {
      query: listUsersQuerySchema,
    },
    responses: {
      200: {
        description: 'Users list',
        content: jsonContent(usersListResponseSchema),
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

export { registerUsersDocs };
