import './extendZodWithOpenApi';

import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerApplicationsDocs } from '../../modules/applications/applications.docs';
import { registerAuthDocs } from '../../modules/auth/auth.docs';
import { registerCohortsDocs } from '../../modules/cohorts/cohorts.docs';
import { registerHealthDocs } from '../../modules/health/health.docs';
import { registerUsersDocs } from '../../modules/users/users.docs';
import {
  authResponseSchema,
  cohortDetailsResponseSchema,
  cohortFormFieldOptionResponseSchema,
  cohortFormFieldResponseSchema,
  cohortFormResponseSchema,
  cohortResponseSchema,
  cohortsListResponseSchema,
  errorResponseSchema,
  practiceApplicationAnswerResponseSchema,
  practiceApplicationDetailsResponseSchema,
  practiceApplicationResponseSchema,
  practiceApplicationsListResponseSchema,
  publicCohortDetailsResponseSchema,
  publicCohortResponseSchema,
  userResponseSchema,
  usersListResponseSchema,
} from './apiSchemas';

const createOpenApiRegistry = () => {
  const registry = new OpenAPIRegistry();

  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  registry.register('User', userResponseSchema);
  registry.register('Cohort', cohortResponseSchema);
  registry.register('CohortFormField', cohortFormFieldResponseSchema);
  registry.register('CohortFormFieldOption', cohortFormFieldOptionResponseSchema);
  registry.register('PublicCohort', publicCohortResponseSchema);
  registry.register('AuthResponse', authResponseSchema);
  registry.register('CohortDetailsResponse', cohortDetailsResponseSchema);
  registry.register('CohortFormResponse', cohortFormResponseSchema);
  registry.register('CohortsListResponse', cohortsListResponseSchema);
  registry.register('ErrorResponse', errorResponseSchema);
  registry.register('PracticeApplication', practiceApplicationResponseSchema);
  registry.register('PracticeApplicationAnswer', practiceApplicationAnswerResponseSchema);
  registry.register('PracticeApplicationDetailsResponse', practiceApplicationDetailsResponseSchema);
  registry.register('PracticeApplicationsListResponse', practiceApplicationsListResponseSchema);
  registry.register('PublicCohortDetailsResponse', publicCohortDetailsResponseSchema);
  registry.register('UsersListResponse', usersListResponseSchema);

  registerHealthDocs(registry);
  registerApplicationsDocs(registry);
  registerAuthDocs(registry);
  registerCohortsDocs(registry);
  registerUsersDocs(registry);

  return registry;
};

const createOpenApiDocument = () => {
  const registry = createOpenApiRegistry();
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Practice Organizer API',
      version: '1.0.0',
    },
    servers: [{ url: '/' }],
  });
};

const openApiDocument = createOpenApiDocument();

export { openApiDocument };
