import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';

import { cohortTrackDetailsResponseSchema, cohortTracksListResponseSchema, errorResponseSchema } from '../../shared/docs/apiSchemas';
import { cohortTracksParamsSchema, createTrackSchema, trackIdParamsSchema, updateTrackSchema } from './tracks.schemas';

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerTracksDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/tracks/cohorts/{cohortId}',
    tags: ['Tracks'],
    summary: 'List cohort tracks',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortTracksParamsSchema,
    },
    responses: {
      200: {
        description: 'Cohort tracks',
        content: jsonContent(cohortTracksListResponseSchema),
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
    path: '/tracks/cohorts/{cohortId}',
    tags: ['Tracks'],
    summary: 'Create cohort track',
    security: [{ bearerAuth: [] }],
    request: {
      params: cohortTracksParamsSchema,
      body: {
        required: true,
        content: jsonContent(createTrackSchema),
      },
    },
    responses: {
      201: {
        description: 'Cohort track created',
        content: jsonContent(cohortTrackDetailsResponseSchema),
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
        description: 'Track title already exists in cohort',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/tracks/{id}',
    tags: ['Tracks'],
    summary: 'Update cohort track',
    security: [{ bearerAuth: [] }],
    request: {
      params: trackIdParamsSchema,
      body: {
        required: true,
        content: jsonContent(updateTrackSchema),
      },
    },
    responses: {
      200: {
        description: 'Cohort track updated',
        content: jsonContent(cohortTrackDetailsResponseSchema),
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
        description: 'Track not found',
        content: jsonContent(errorResponseSchema),
      },
      409: {
        description: 'Track title already exists in cohort',
        content: jsonContent(errorResponseSchema),
      },
    },
  });
};

export { registerTracksDocs };
