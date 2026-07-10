import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { getPracticeReview, upsertPracticeReview } from './reviews.controller';

const reviewsRouter = Router();

reviewsRouter.use(authenticate, authorize(UserRole.admin));
reviewsRouter.get('/applications/:applicationId', getPracticeReview);
reviewsRouter.put('/applications/:applicationId', upsertPracticeReview);

export { reviewsRouter };
