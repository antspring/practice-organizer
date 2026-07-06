import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { listUsersQuerySchema } from './users.schemas';
import { listUsersForAdmin } from './users.service';

const listUsers: RequestHandler = asyncHandler(async (request, response) => {
  const query = listUsersQuerySchema.parse(request.query);
  const result = await listUsersForAdmin(query);

  response.status(200).json(result);
});

export { listUsers };
