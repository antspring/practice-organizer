import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { createTrack, listCohortTracks, updateTrack } from './tracks.controller';

const tracksRouter = Router();

tracksRouter.use(authenticate);
tracksRouter.get('/cohorts/:cohortId', authorize(UserRole.admin), listCohortTracks);
tracksRouter.post('/cohorts/:cohortId', authorize(UserRole.admin), createTrack);
tracksRouter.patch('/:id', authorize(UserRole.admin), updateTrack);

export { tracksRouter };
