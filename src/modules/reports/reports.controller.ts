import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { presentPracticeReport } from './reports.presenter';
import { reportApplicationParamsSchema } from './reports.schemas';
import { downloadReport, getReport, uploadReport } from './reports.service';

const uploadPracticeReport: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reportApplicationParamsSchema.parse(request.params);
  const report = await uploadReport(applicationId, response.locals.user, request.file);

  response.status(200).json({ report: presentPracticeReport(report) });
});

const getPracticeReport: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reportApplicationParamsSchema.parse(request.params);
  const report = await getReport(applicationId, response.locals.user);

  response.status(200).json({ report: presentPracticeReport(report) });
});

const downloadPracticeReport: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reportApplicationParamsSchema.parse(request.params);
  const { report, buffer } = await downloadReport(applicationId, response.locals.user);
  const encodedFileName = encodeURIComponent(report.originalName);

  response.setHeader('Content-Type', report.mimeType);
  response.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
  response.status(200).send(buffer);
});

export { downloadPracticeReport, getPracticeReport, uploadPracticeReport };
