import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import { cohortAssignmentDetailsResponseSchema, errorResponseSchema } from '../../shared/docs/apiSchemas';
import { cohortAssignmentParamsSchema, upsertCohortAssignmentSchema } from './assignments.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerAssignmentsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/assignments/cohorts/{cohortId}',
    tags: ['Assignments'],
    summary: 'Get cohort assignment',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortAssignmentParamsSchema,
    },
    responses: {
      200: {
        description: 'Cohort assignment',
        content: jsonContent(cohortAssignmentDetailsResponseSchema),
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
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/assignments/cohorts/{cohortId}',
    tags: ['Assignments'],
    summary: 'Create or replace cohort assignment',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortAssignmentParamsSchema,
      body: {
        required: true,
        content: jsonContent(upsertCohortAssignmentSchema),
      },
    },
    responses: {
      200: {
        description: 'Cohort assignment saved',
        content: jsonContent(cohortAssignmentDetailsResponseSchema),
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
    },
  });
};

export { registerAssignmentsDocs };
