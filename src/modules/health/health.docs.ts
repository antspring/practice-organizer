import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

const registerHealthDocs = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['Health'],
    summary: 'Check API health',
    responses: {
      200: {
        description: 'API is running',
      },
    },
  });
};

export { registerHealthDocs };
