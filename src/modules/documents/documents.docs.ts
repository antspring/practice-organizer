import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { cohortDocumentSummaryResponseSchema, errorResponseSchema } from '../../shared/docs/apiSchemas';
import { documentApplicationParamsSchema, documentCohortParamsSchema } from './documents.schemas';

const docxResponseContent = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    schema: {
      type: 'string',
      format: 'binary',
    },
  },
} as const;

const registerDocumentsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/documents/cohorts/{cohortId}/summary',
    tags: ['Documents'],
    summary: 'Get cohort document readiness summary',
    security: [{ bearerAuth: [] }],
    request: {
      params: documentCohortParamsSchema,
    },
    responses: {
      200: {
        description: 'Approved cohort applications and document readiness',
        content: {
          'application/json': {
            schema: cohortDocumentSummaryResponseSchema,
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
        description: 'Cohort not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

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
        content: docxResponseContent,
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

  registry.registerPath({
    method: 'get',
    path: '/documents/applications/{applicationId}/supervisor-review',
    tags: ['Documents'],
    summary: 'Download supervisor review document',
    security: [{ bearerAuth: [] }],
    request: {
      params: documentApplicationParamsSchema,
    },
    responses: {
      200: {
        description: 'Supervisor review docx',
        content: docxResponseContent,
      },
      400: {
        description: 'Application or review is not ready for document generation',
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

  registry.registerPath({
    method: 'get',
    path: '/documents/applications/{applicationId}/report-title-page',
    tags: ['Documents'],
    summary: 'Download report title page document',
    security: [{ bearerAuth: [] }],
    request: {
      params: documentApplicationParamsSchema,
    },
    responses: {
      200: {
        description: 'Report title page docx',
        content: docxResponseContent,
      },
      400: {
        description: 'Application, report, or review is not ready for document generation',
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
