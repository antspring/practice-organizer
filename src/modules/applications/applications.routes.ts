import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  createApplication,
  getApplicationAutofill,
  listMyApplications,
  updateApplication,
} from './applications.controller';

const applicationsRouter = Router();

applicationsRouter.use(authenticate, authorize(UserRole.student));
applicationsRouter.get('/me', listMyApplications);
applicationsRouter.get('/autofill/:cohortId', getApplicationAutofill);
applicationsRouter.patch('/:id', updateApplication);
applicationsRouter.post('/', createApplication);

export { applicationsRouter };
