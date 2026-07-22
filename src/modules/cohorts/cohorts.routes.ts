import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  createCohort,
  getCohort,
  getCohortForm,
  getPublicCohort,
  listAvailableCohorts,
  listCohorts,
  replaceCohortForm,
  updateCohort,
} from './cohorts.controller';

const cohortsRouter = Router();

cohortsRouter.get('/public/:publicSlug', getPublicCohort);
cohortsRouter.use(authenticate);
cohortsRouter.get('/available', authorize(UserRole.student), listAvailableCohorts);
cohortsRouter.get('/', listCohorts);
cohortsRouter.get('/:id/form', authorize(UserRole.admin), getCohortForm);
cohortsRouter.put('/:id/form', authorize(UserRole.admin), replaceCohortForm);
cohortsRouter.get('/:id', getCohort);
cohortsRouter.post('/', authorize(UserRole.admin), createCohort);
cohortsRouter.patch('/:id', authorize(UserRole.admin), updateCohort);

export { cohortsRouter };
