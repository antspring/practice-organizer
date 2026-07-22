import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import {
  availableCohortsListResponseSchema,
  cohortDetailsResponseSchema,
  cohortFormResponseSchema,
  cohortsListResponseSchema,
  errorResponseSchema,
  publicCohortDetailsResponseSchema,
} from '../../shared/docs/apiSchemas';
import {
  cohortIdParamsSchema,
  createCohortSchema,
  listCohortsQuerySchema,
  publicCohortParamsSchema,
  replaceCohortFormSchema,
  updateCohortSchema,
} from './cohorts.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerCohortsDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/cohorts/public/{publicSlug}',
    tags: ['Public'],
    summary: 'Get public cohort by slug',
    request: {
      params: publicCohortParamsSchema,
    },
    responses: {
      200: {
        description: 'Public cohort details',
        content: jsonContent(publicCohortDetailsResponseSchema),
      },
      404: {
        description: 'Cohort not found',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cohorts/available',
    tags: ['Cohorts'],
    summary: 'List publicly listed cohorts for a student',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Publicly listed cohorts without an existing application from the current student',
        content: jsonContent(availableCohortsListResponseSchema),
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
    method: 'get',
    path: '/cohorts',
    tags: ['Cohorts'],
    summary: 'List cohorts',
    security: [{ bearerAuth: [] }],
    request: {
      query: listCohortsQuerySchema,
    },
    responses: {
      200: {
        description: 'Cohorts list',
        content: jsonContent(cohortsListResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cohorts/{id}',
    tags: ['Cohorts'],
    summary: 'Get cohort by id',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Cohort details',
        content: jsonContent(cohortDetailsResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
      404: {
        description: 'Cohort not found',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cohorts/{id}/form',
    tags: ['Cohorts'],
    summary: 'Get cohort form fields',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Cohort form fields',
        content: jsonContent(cohortFormResponseSchema),
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
    method: 'post',
    path: '/cohorts',
    tags: ['Cohorts'],
    summary: 'Create cohort',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: jsonContent(createCohortSchema),
      },
    },
    responses: {
      201: {
        description: 'Cohort created',
        content: jsonContent(cohortDetailsResponseSchema),
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

  registry.registerPath({
    method: 'put',
    path: '/cohorts/{id}/form',
    tags: ['Cohorts'],
    summary: 'Replace cohort form fields',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortIdParamsSchema,
      body: {
        required: true,
        content: jsonContent(replaceCohortFormSchema),
      },
    },
    responses: {
      200: {
        description: 'Cohort form fields replaced',
        content: jsonContent(cohortFormResponseSchema),
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

  registry.registerPath({
    method: 'patch',
    path: '/cohorts/{id}',
    tags: ['Cohorts'],
    summary: 'Update cohort',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortIdParamsSchema,
      body: {
        required: true,
        content: jsonContent(updateCohortSchema),
      },
    },
    responses: {
      200: {
        description: 'Cohort updated',
        content: jsonContent(cohortDetailsResponseSchema),
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

export { registerCohortsDocs };
