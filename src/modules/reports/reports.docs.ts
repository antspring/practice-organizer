import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { errorResponseSchema, practiceReportDetailsResponseSchema } from '../../shared/docs/apiSchemas';
import { reportApplicationParamsSchema } from './reports.schemas';

const registerReportsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'put',
    path: '/reports/applications/{applicationId}',
    tags: ['Reports'],
    summary: 'Upload or replace a practice report',
    security: [{ bearerAuth: [] }],
    request: {
      params: reportApplicationParamsSchema,
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['report'],
              properties: {
                report: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Uploaded report metadata',
        content: { 'application/json': { schema: practiceReportDetailsResponseSchema } },
      },
      400: {
        description: 'Invalid or missing report file',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      401: {
        description: 'Missing or invalid access token',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      403: {
        description: 'Forbidden',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      404: {
        description: 'Application not found',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/reports/applications/{applicationId}',
    tags: ['Reports'],
    summary: 'Get practice report metadata',
    security: [{ bearerAuth: [] }],
    request: { params: reportApplicationParamsSchema },
    responses: {
      200: {
        description: 'Report metadata or null',
        content: { 'application/json': { schema: practiceReportDetailsResponseSchema } },
      },
      401: {
        description: 'Missing or invalid access token',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      403: {
        description: 'Forbidden',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      404: {
        description: 'Application not found',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/reports/applications/{applicationId}/file',
    tags: ['Reports'],
    summary: 'Download a practice report',
    security: [{ bearerAuth: [] }],
    request: { params: reportApplicationParamsSchema },
    responses: {
      200: {
        description: 'Practice report file',
        content: {
          'application/pdf': { schema: { type: 'string', format: 'binary' } },
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            schema: { type: 'string', format: 'binary' },
          },
        },
      },
      401: {
        description: 'Missing or invalid access token',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      403: {
        description: 'Forbidden',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
      404: {
        description: 'Application or report not found',
        content: { 'application/json': { schema: errorResponseSchema } },
      },
    },
  });
};

export { registerReportsDocs };
