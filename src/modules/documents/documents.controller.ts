import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { documentApplicationParamsSchema, documentCohortParamsSchema } from './documents.schemas';
import {
  generateIndividualAssignmentDocument,
  generateReportTitlePageDocument,
  generateSupervisorReviewDocument,
} from './documents.service';
import { getCohortDocumentSummary } from './services/documents-summary.service';

const getCohortDocumentsSummary: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = documentCohortParamsSchema.parse(request.params);
  const result = await getCohortDocumentSummary(cohortId);

  response.status(200).json(result);
});

const getIndividualAssignmentDocument: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = documentApplicationParamsSchema.parse(request.params);
  const result = await generateIndividualAssignmentDocument(applicationId, response.locals.user);

  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  response.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
  response.status(200).send(result.buffer);
});

const getSupervisorReviewDocument: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = documentApplicationParamsSchema.parse(request.params);
  const result = await generateSupervisorReviewDocument(applicationId, response.locals.user);

  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  response.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
  response.status(200).send(result.buffer);
});

const getReportTitlePageDocument: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = documentApplicationParamsSchema.parse(request.params);
  const result = await generateReportTitlePageDocument(applicationId, response.locals.user);

  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  response.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
  response.status(200).send(result.buffer);
});

export {
  getCohortDocumentsSummary,
  getIndividualAssignmentDocument,
  getReportTitlePageDocument,
  getSupervisorReviewDocument,
};
