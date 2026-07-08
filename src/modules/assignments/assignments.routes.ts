import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { getCohortAssignment, upsertCohortAssignment } from './assignments.controller';

const assignmentsRouter = Router();

assignmentsRouter.use(authenticate);
assignmentsRouter.get('/cohorts/:cohortId', authorize(UserRole.admin), getCohortAssignment);
assignmentsRouter.put('/cohorts/:cohortId', authorize(UserRole.admin), upsertCohortAssignment);

export { assignmentsRouter };
