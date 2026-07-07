import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import {
  applicationAutofillParamsSchema,
  applicationIdParamsSchema,
  cohortApplicationsParamsSchema,
  createApplicationSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from './applications.schemas';
import {
  createApplicationForStudent,
  getApplicationAutofillForStudent,
  listCohortApplicationsForAdmin,
  listCurrentUserApplications,
  updateApplicationStatusForAdmin,
  updateApplicationForStudent,
} from './applications.service';

const createApplication: RequestHandler = asyncHandler(async (request, response) => {
  const data = createApplicationSchema.parse(request.body);
  const result = await createApplicationForStudent(response.locals.user.id, data);

  response.status(201).json(result);
});

const listMyApplications: RequestHandler = asyncHandler(async (_request, response) => {
  const result = await listCurrentUserApplications(response.locals.user.id);

  response.status(200).json(result);
});

const listCohortApplications: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = cohortApplicationsParamsSchema.parse(request.params);
  const result = await listCohortApplicationsForAdmin(cohortId);

  response.status(200).json(result);
});

const getApplicationAutofill: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = applicationAutofillParamsSchema.parse(request.params);
  const result = await getApplicationAutofillForStudent(response.locals.user.id, cohortId);

  response.status(200).json(result);
});

const updateApplication: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = applicationIdParamsSchema.parse(request.params);
  const data = updateApplicationSchema.parse(request.body);
  const result = await updateApplicationForStudent(id, response.locals.user.id, data);

  response.status(200).json(result);
});

const updateApplicationStatus: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = applicationIdParamsSchema.parse(request.params);
  const data = updateApplicationStatusSchema.parse(request.body);
  const result = await updateApplicationStatusForAdmin(id, data);

  response.status(200).json(result);
});

export {
  createApplication,
  getApplicationAutofill,
  listCohortApplications,
  listMyApplications,
  updateApplication,
  updateApplicationStatus,
};
