import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { errorResponseSchema } from '../../shared/docs/apiSchemas';
import { documentApplicationParamsSchema } from './documents.schemas';

const registerDocumentsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/documents/applications/{applicationId}/individual-assignment',
    tags: ['Documents'],
    summary: 'Download individual assignment document',
    security: [{ bearerAuth: [] }],
    request: {
      params: documentApplicationParamsSchema,
    },
    responses: {
      200: {
        description: 'Individual assignment docx',
        content: {
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            schema: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
      400: {
        description: 'Application is not ready for document generation',
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

export { registerDocumentsDocs };
