import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { documentApplicationParamsSchema } from './documents.schemas';
import {
  generateIndividualAssignmentDocument,
  generateReportTitlePageDocument,
  generateSupervisorReviewDocument,
} from './documents.service';

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

export { getIndividualAssignmentDocument, getReportTitlePageDocument, getSupervisorReviewDocument };
