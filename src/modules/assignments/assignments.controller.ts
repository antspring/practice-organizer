import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { cohortAssignmentParamsSchema, upsertCohortAssignmentSchema } from './assignments.schemas';
import { getCohortAssignmentForAdmin, upsertCohortAssignmentForAdmin } from './assignments.service';

const getCohortAssignment: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = cohortAssignmentParamsSchema.parse(request.params);
  const result = await getCohortAssignmentForAdmin(cohortId);

  response.status(200).json(result);
});

const upsertCohortAssignment: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = cohortAssignmentParamsSchema.parse(request.params);
  const data = upsertCohortAssignmentSchema.parse(request.body);
  const result = await upsertCohortAssignmentForAdmin(cohortId, data);

  response.status(200).json(result);
});

export { getCohortAssignment, upsertCohortAssignment };
