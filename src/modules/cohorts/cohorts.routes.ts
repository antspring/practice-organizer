import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { createCohort, getCohort, listCohorts, updateCohort } from './cohorts.controller';

const cohortsRouter = Router();

cohortsRouter.use(authenticate);
cohortsRouter.get('/', listCohorts);
cohortsRouter.get('/:id', getCohort);
cohortsRouter.post('/', authorize(UserRole.admin), createCohort);
cohortsRouter.patch('/:id', authorize(UserRole.admin), updateCohort);

export { cohortsRouter };
