import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { createApplication, listMyApplications, updateApplication } from './applications.controller';

const applicationsRouter = Router();

applicationsRouter.use(authenticate, authorize(UserRole.student));
applicationsRouter.get('/me', listMyApplications);
applicationsRouter.patch('/:id', updateApplication);
applicationsRouter.post('/', createApplication);

export { applicationsRouter };
