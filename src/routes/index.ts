import { Router } from 'express';

import { applicationsRouter } from '../modules/applications/applications.routes';
import { assignmentsRouter } from '../modules/assignments/assignments.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { cohortsRouter } from '../modules/cohorts/cohorts.routes';
import { documentsRouter } from '../modules/documents/documents.routes';
import { healthRouter } from '../modules/health/health.routes';
import { profilesRouter } from '../modules/profiles/profiles.routes';
import { reviewsRouter } from '../modules/reviews/reviews.routes';
import { reportsRouter } from '../modules/reports/reports.routes';
import { tracksRouter } from '../modules/tracks/tracks.routes';
import { tasksRouter } from '../modules/tasks/tasks.routes';
import { usersRouter } from '../modules/users/users.routes';

const router = Router();

router.use('/applications', applicationsRouter);
router.use('/assignments', assignmentsRouter);
router.use('/auth', authRouter);
router.use('/cohorts', cohortsRouter);
router.use('/documents', documentsRouter);
router.use('/health', healthRouter);
router.use('/profiles', profilesRouter);
router.use('/reviews', reviewsRouter);
router.use('/reports', reportsRouter);
router.use('/tracks', tracksRouter);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);

export { router };
