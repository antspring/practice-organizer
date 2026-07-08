import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { getMyPracticeProfile, updateMyPracticeProfile } from './profiles.controller';

const profilesRouter = Router();

profilesRouter.use(authenticate);
profilesRouter.get('/me', authorize(UserRole.student), getMyPracticeProfile);
profilesRouter.patch('/me', authorize(UserRole.student), updateMyPracticeProfile);

export { profilesRouter };
