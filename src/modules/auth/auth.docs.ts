import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z, ZodType } from 'zod';

import { authResponseSchema, errorResponseSchema, userResponseSchema } from '../../shared/docs/apiSchemas';
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from './auth.schemas';

const meResponseSchema = z.object({
  user: userResponseSchema,
});

const jsonContent = (schema: ZodType) => ({
  'application/json': {
    schema,
  },
});

const registerAuthDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: ['Auth'],
    summary: 'Register a new user',
    request: {
      body: {
        required: true,
        content: jsonContent(registerSchema),
      },
    },
    responses: {
      201: {
        description: 'User registered',
        content: jsonContent(authResponseSchema),
      },
      400: {
        description: 'Validation error',
        content: jsonContent(errorResponseSchema),
      },
      409: {
        description: 'Email already exists',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    summary: 'Login with email and password',
    request: {
      body: {
        required: true,
        content: jsonContent(loginSchema),
      },
    },
    responses: {
      200: {
        description: 'User logged in',
        content: jsonContent(authResponseSchema),
      },
      401: {
        description: 'Invalid credentials',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/refresh',
    tags: ['Auth'],
    summary: 'Refresh access and refresh tokens',
    request: {
      body: {
        required: true,
        content: jsonContent(refreshTokenSchema),
      },
    },
    responses: {
      200: {
        description: 'Tokens refreshed',
        content: jsonContent(authResponseSchema),
      },
      401: {
        description: 'Invalid or expired refresh token',
        content: jsonContent(errorResponseSchema),
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    tags: ['Auth'],
    summary: 'Logout by refresh token',
    request: {
      body: {
        required: true,
        content: jsonContent(logoutSchema),
      },
    },
    responses: {
      204: {
        description: 'Logged out',
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/auth/me',
    tags: ['Auth'],
    summary: 'Get current user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Current user',
        content: jsonContent(meResponseSchema),
      },
      401: {
        description: 'Missing or invalid access token',
        content: jsonContent(errorResponseSchema),
      },
    },
  });
};

export { registerAuthDocs };
