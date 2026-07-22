import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import {
  cohortIdParamsSchema,
  createCohortSchema,
  listCohortsQuerySchema,
  publicCohortParamsSchema,
  replaceCohortFormSchema,
  updateCohortSchema,
} from './cohorts.schemas';
import {
  createCohortForAdmin,
  getCohortById,
  getCohortFormForAdmin,
  getPublicCohortBySlug,
  listAvailableCohortsForStudent,
  listCohortsForUser,
  replaceCohortFormForAdmin,
  updateCohortForAdmin,
} from './cohorts.service';

const createCohort: RequestHandler = asyncHandler(async (request, response) => {
  const data = createCohortSchema.parse(request.body);
  const cohort = await createCohortForAdmin(data);

  response.status(201).json({ cohort });
});

const getCohort: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = cohortIdParamsSchema.parse(request.params);
  const cohort = await getCohortById(id);

  response.status(200).json({ cohort });
});

const getCohortForm: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = cohortIdParamsSchema.parse(request.params);
  const result = await getCohortFormForAdmin(id);

  response.status(200).json(result);
});

const listCohorts: RequestHandler = asyncHandler(async (request, response) => {
  const query = listCohortsQuerySchema.parse(request.query);
  const result = await listCohortsForUser(query);

  response.status(200).json(result);
});

const listAvailableCohorts: RequestHandler = asyncHandler(async (_request, response) => {
  const result = await listAvailableCohortsForStudent(response.locals.user.id);

  response.status(200).json(result);
});

const getPublicCohort: RequestHandler = asyncHandler(async (request, response) => {
  const { publicSlug } = publicCohortParamsSchema.parse(request.params);
  const result = await getPublicCohortBySlug(publicSlug);

  response.status(200).json(result);
});

const updateCohort: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = cohortIdParamsSchema.parse(request.params);
  const data = updateCohortSchema.parse(request.body);
  const cohort = await updateCohortForAdmin(id, data);

  response.status(200).json({ cohort });
});

const replaceCohortForm: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = cohortIdParamsSchema.parse(request.params);
  const data = replaceCohortFormSchema.parse(request.body);
  const result = await replaceCohortFormForAdmin(id, data);

  response.status(200).json(result);
});

export {
  createCohort,
  getCohort,
  getCohortForm,
  getPublicCohort,
  listAvailableCohorts,
  listCohorts,
  replaceCohortForm,
  updateCohort,
};
