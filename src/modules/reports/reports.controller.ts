import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { presentPracticeReport } from './reports.presenter';
import { reportApplicationParamsSchema, updateReportApprovalBodySchema } from './reports.schemas';
import { downloadReport, getReport, setReportApproval, uploadReport } from './reports.service';

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

const updatePracticeReportApproval: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reportApplicationParamsSchema.parse(request.params);
  const { isApproved } = updateReportApprovalBodySchema.parse(request.body);
  const report = await setReportApproval(applicationId, response.locals.user, isApproved);

  response.status(200).json({ report: presentPracticeReport(report) });
});

export { downloadPracticeReport, getPracticeReport, updatePracticeReportApproval, uploadPracticeReport };
