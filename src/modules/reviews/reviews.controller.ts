import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { reviewApplicationParamsSchema, upsertPracticeReviewSchema } from './reviews.schemas';
import { getPracticeReviewForAdmin, upsertPracticeReviewForAdmin } from './reviews.service';

const getPracticeReview: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reviewApplicationParamsSchema.parse(request.params);
  const result = await getPracticeReviewForAdmin(applicationId);

  response.status(200).json(result);
});

const upsertPracticeReview: RequestHandler = asyncHandler(async (request, response) => {
  const { applicationId } = reviewApplicationParamsSchema.parse(request.params);
  const data = upsertPracticeReviewSchema.parse(request.body);
  const result = await upsertPracticeReviewForAdmin(applicationId, data);

  response.status(200).json(result);
});

export { getPracticeReview, upsertPracticeReview };
