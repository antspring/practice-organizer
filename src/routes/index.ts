import { Router } from 'express';

import { applicationsRouter } from '../modules/applications/applications.routes';
import { assignmentsRouter } from '../modules/assignments/assignments.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { cohortsRouter } from '../modules/cohorts/cohorts.routes';
import { healthRouter } from '../modules/health/health.routes';
import { usersRouter } from '../modules/users/users.routes';

const router = Router();

router.use('/applications', applicationsRouter);
router.use('/assignments', assignmentsRouter);
router.use('/auth', authRouter);
router.use('/cohorts', cohortsRouter);
router.use('/health', healthRouter);
router.use('/users', usersRouter);

export { router };
