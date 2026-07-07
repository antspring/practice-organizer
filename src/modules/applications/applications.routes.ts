import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  createApplication,
  getApplicationAutofill,
  listCohortApplications,
  listMyApplications,
  updateApplication,
  updateApplicationStatus,
} from './applications.controller';

const applicationsRouter = Router();

applicationsRouter.use(authenticate);
applicationsRouter.get('/cohorts/:cohortId', authorize(UserRole.admin), listCohortApplications);
applicationsRouter.get('/me', authorize(UserRole.student), listMyApplications);
applicationsRouter.get('/autofill/:cohortId', authorize(UserRole.student), getApplicationAutofill);
applicationsRouter.patch('/:id/status', authorize(UserRole.admin), updateApplicationStatus);
applicationsRouter.patch('/:id', authorize(UserRole.student), updateApplication);
applicationsRouter.post('/', authorize(UserRole.student), createApplication);

export { applicationsRouter };
