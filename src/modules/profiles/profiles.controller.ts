import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { updatePracticeProfileSchema } from './profiles.schemas';
import { getCurrentUserPracticeProfile, updateCurrentUserPracticeProfile } from './profiles.service';

const getMyPracticeProfile: RequestHandler = asyncHandler(async (_request, response) => {
  const result = await getCurrentUserPracticeProfile(response.locals.user.id);

  response.status(200).json(result);
});

const updateMyPracticeProfile: RequestHandler = asyncHandler(async (request, response) => {
  const data = updatePracticeProfileSchema.parse(request.body);
  const result = await updateCurrentUserPracticeProfile(response.locals.user.id, data);

  response.status(200).json(result);
});

export { getMyPracticeProfile, updateMyPracticeProfile };
