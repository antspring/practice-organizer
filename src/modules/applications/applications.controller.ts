import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import {
  applicationAutofillParamsSchema,
  applicationIdParamsSchema,
  createApplicationSchema,
  updateApplicationSchema,
} from './applications.schemas';
import {
  createApplicationForStudent,
  getApplicationAutofillForStudent,
  listCurrentUserApplications,
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

export { createApplication, getApplicationAutofill, listMyApplications, updateApplication };
