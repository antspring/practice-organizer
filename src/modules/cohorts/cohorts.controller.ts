import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { cohortIdParamsSchema, createCohortSchema, listCohortsQuerySchema, updateCohortSchema } from './cohorts.schemas';
import { createCohortForAdmin, getCohortById, listCohortsForUser, updateCohortForAdmin } from './cohorts.service';

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

const listCohorts: RequestHandler = asyncHandler(async (request, response) => {
  const query = listCohortsQuerySchema.parse(request.query);
  const result = await listCohortsForUser(query);

  response.status(200).json(result);
});

const updateCohort: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = cohortIdParamsSchema.parse(request.params);
  const data = updateCohortSchema.parse(request.body);
  const cohort = await updateCohortForAdmin(id, data);

  response.status(200).json({ cohort });
});

export { createCohort, getCohort, listCohorts, updateCohort };
