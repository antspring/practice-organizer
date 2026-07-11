import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  errorResponseSchema,
  practiceTaskDetailsResponseSchema,
  practiceTasksListResponseSchema,
  taskParticipantsListResponseSchema,
} from '../../shared/docs/apiSchemas';
import {
  createTaskBodySchema,
  taskCohortParamsSchema,
  taskIdParamsSchema,
  taskWeekQuerySchema,
  updateTaskBodySchema,
} from './tasks.schemas';

const commonErrorContent = {
  'application/json': {
    schema: errorResponseSchema,
  },
};

const registerTasksDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/tasks/cohorts/{cohortId}/week',
    tags: ['Tasks'],
    summary: 'List cohort participants and tasks for a work week',
    security: [{ bearerAuth: [] }],
    request: { params: taskCohortParamsSchema, query: taskWeekQuerySchema },
    responses: {
      200: {
        description: 'Cohort task board',
        content: { 'application/json': { schema: taskParticipantsListResponseSchema } },
      },
      400: { description: 'Invalid week start', content: commonErrorContent },
      401: { description: 'Missing or invalid access token', content: commonErrorContent },
      403: { description: 'Approved application is required for students', content: commonErrorContent },
      404: { description: 'Cohort not found', content: commonErrorContent },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/tasks/cohorts/{cohortId}/me',
    tags: ['Tasks'],
    summary: 'List my practice tasks for a work week',
    security: [{ bearerAuth: [] }],
    request: { params: taskCohortParamsSchema, query: taskWeekQuerySchema },
    responses: {
      200: {
        description: 'Practice tasks',
        content: { 'application/json': { schema: practiceTasksListResponseSchema } },
      },
      400: { description: 'Invalid week start', content: commonErrorContent },
      401: { description: 'Missing or invalid access token', content: commonErrorContent },
      403: { description: 'Approved application is required', content: commonErrorContent },
      404: { description: 'Cohort not found', content: commonErrorContent },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/tasks/cohorts/{cohortId}',
    tags: ['Tasks'],
    summary: 'Create my practice task',
    security: [{ bearerAuth: [] }],
    request: {
      params: taskCohortParamsSchema,
      body: { content: { 'application/json': { schema: createTaskBodySchema } } },
    },
    responses: {
      201: {
        description: 'Created task',
        content: { 'application/json': { schema: practiceTaskDetailsResponseSchema } },
      },
      400: { description: 'Invalid task data', content: commonErrorContent },
      401: { description: 'Missing or invalid access token', content: commonErrorContent },
      403: { description: 'Approved application is required', content: commonErrorContent },
      404: { description: 'Cohort not found', content: commonErrorContent },
      409: { description: 'Task already exists for date', content: commonErrorContent },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/tasks/{taskId}',
    tags: ['Tasks'],
    summary: 'Update my practice task',
    security: [{ bearerAuth: [] }],
    request: {
      params: taskIdParamsSchema,
      body: { content: { 'application/json': { schema: updateTaskBodySchema } } },
    },
    responses: {
      200: {
        description: 'Updated task',
        content: { 'application/json': { schema: practiceTaskDetailsResponseSchema } },
      },
      400: { description: 'Invalid task data', content: commonErrorContent },
      401: { description: 'Missing or invalid access token', content: commonErrorContent },
      403: { description: 'Forbidden', content: commonErrorContent },
      404: { description: 'Task not found', content: commonErrorContent },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/tasks/{taskId}',
    tags: ['Tasks'],
    summary: 'Delete my practice task',
    security: [{ bearerAuth: [] }],
    request: { params: taskIdParamsSchema },
    responses: {
      204: { description: 'Task deleted' },
      401: { description: 'Missing or invalid access token', content: commonErrorContent },
      403: { description: 'Forbidden', content: commonErrorContent },
      404: { description: 'Task not found', content: commonErrorContent },
    },
  });
};

export { registerTasksDocs };
