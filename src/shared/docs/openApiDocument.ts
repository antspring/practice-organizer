import './extendZodWithOpenApi';

import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerApplicationsDocs } from '../../modules/applications/applications.docs';
import { registerAssignmentsDocs } from '../../modules/assignments/assignments.docs';
import { registerAuthDocs } from '../../modules/auth/auth.docs';
import { registerCohortsDocs } from '../../modules/cohorts/cohorts.docs';
import { registerDocumentsDocs } from '../../modules/documents/documents.docs';
import { registerHealthDocs } from '../../modules/health/health.docs';
import { registerProfilesDocs } from '../../modules/profiles/profiles.docs';
import { registerReviewsDocs } from '../../modules/reviews/reviews.docs';
import { registerReportsDocs } from '../../modules/reports/reports.docs';
import { registerTracksDocs } from '../../modules/tracks/tracks.docs';
import { registerTasksDocs } from '../../modules/tasks/tasks.docs';
import { registerUsersDocs } from '../../modules/users/users.docs';
import {
  applicationAutofillAnswerResponseSchema,
  applicationAutofillResponseSchema,
  authResponseSchema,
  cohortAssignmentDetailsResponseSchema,
  cohortAssignmentResponseSchema,
  cohortDetailsResponseSchema,
  cohortDocumentSummaryItemResponseSchema,
  cohortDocumentSummaryResponseSchema,
  cohortFormFieldOptionResponseSchema,
  cohortFormFieldResponseSchema,
  cohortFormResponseSchema,
  cohortResponseSchema,
  cohortTrackDetailsResponseSchema,
  cohortTrackResponseSchema,
  cohortTracksListResponseSchema,
  cohortsListResponseSchema,
  errorResponseSchema,
  practiceApplicationAnswerResponseSchema,
  practiceApplicationDetailsResponseSchema,
  practiceApplicationResponseSchema,
  practiceApplicationsListResponseSchema,
  practiceProfileDetailsResponseSchema,
  practiceProfileResponseSchema,
  practiceReportDetailsResponseSchema,
  practiceReportResponseSchema,
  practiceTaskDetailsResponseSchema,
  practiceTaskResponseSchema,
  practiceTasksListResponseSchema,
  taskParticipantResponseSchema,
  taskParticipantsListResponseSchema,
  practiceReviewDetailsResponseSchema,
  practiceReviewResponseSchema,
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
  registry.register('ApplicationAutofillAnswer', applicationAutofillAnswerResponseSchema);
  registry.register('ApplicationAutofillResponse', applicationAutofillResponseSchema);
  registry.register('Cohort', cohortResponseSchema);
  registry.register('CohortAssignment', cohortAssignmentResponseSchema);
  registry.register('CohortAssignmentDetailsResponse', cohortAssignmentDetailsResponseSchema);
  registry.register('CohortFormField', cohortFormFieldResponseSchema);
  registry.register('CohortFormFieldOption', cohortFormFieldOptionResponseSchema);
  registry.register('CohortTrack', cohortTrackResponseSchema);
  registry.register('CohortTrackDetailsResponse', cohortTrackDetailsResponseSchema);
  registry.register('CohortTracksListResponse', cohortTracksListResponseSchema);
  registry.register('PublicCohort', publicCohortResponseSchema);
  registry.register('AuthResponse', authResponseSchema);
  registry.register('CohortDetailsResponse', cohortDetailsResponseSchema);
  registry.register('CohortDocumentSummaryItem', cohortDocumentSummaryItemResponseSchema);
  registry.register('CohortDocumentSummaryResponse', cohortDocumentSummaryResponseSchema);
  registry.register('CohortFormResponse', cohortFormResponseSchema);
  registry.register('CohortsListResponse', cohortsListResponseSchema);
  registry.register('ErrorResponse', errorResponseSchema);
  registry.register('PracticeApplication', practiceApplicationResponseSchema);
  registry.register('PracticeApplicationAnswer', practiceApplicationAnswerResponseSchema);
  registry.register('PracticeApplicationDetailsResponse', practiceApplicationDetailsResponseSchema);
  registry.register('PracticeApplicationsListResponse', practiceApplicationsListResponseSchema);
  registry.register('PracticeProfile', practiceProfileResponseSchema);
  registry.register('PracticeProfileDetailsResponse', practiceProfileDetailsResponseSchema);
  registry.register('PracticeReport', practiceReportResponseSchema);
  registry.register('PracticeReportDetailsResponse', practiceReportDetailsResponseSchema);
  registry.register('PracticeTask', practiceTaskResponseSchema);
  registry.register('PracticeTaskDetailsResponse', practiceTaskDetailsResponseSchema);
  registry.register('PracticeTasksListResponse', practiceTasksListResponseSchema);
  registry.register('TaskParticipant', taskParticipantResponseSchema);
  registry.register('TaskParticipantsListResponse', taskParticipantsListResponseSchema);
  registry.register('PracticeReview', practiceReviewResponseSchema);
  registry.register('PracticeReviewDetailsResponse', practiceReviewDetailsResponseSchema);
  registry.register('PublicCohortDetailsResponse', publicCohortDetailsResponseSchema);
  registry.register('UsersListResponse', usersListResponseSchema);

  registerHealthDocs(registry);
  registerApplicationsDocs(registry);
  registerAssignmentsDocs(registry);
  registerAuthDocs(registry);
  registerCohortsDocs(registry);
  registerDocumentsDocs(registry);
  registerProfilesDocs(registry);
  registerReviewsDocs(registry);
  registerReportsDocs(registry);
  registerTracksDocs(registry);
  registerTasksDocs(registry);
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
