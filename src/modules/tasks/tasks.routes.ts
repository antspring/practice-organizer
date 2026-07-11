import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  createMyPracticeTask,
  deleteMyPracticeTask,
  listCohortPracticeTasks,
  listMyPracticeTasks,
  updateMyPracticeTask,
} from './tasks.controller';

const tasksRouter = Router();

tasksRouter.use(authenticate);
tasksRouter.get('/cohorts/:cohortId/week', listCohortPracticeTasks);
tasksRouter.get('/cohorts/:cohortId/me', authorize(UserRole.student), listMyPracticeTasks);
tasksRouter.post('/cohorts/:cohortId', authorize(UserRole.student), createMyPracticeTask);
tasksRouter.patch('/:taskId', authorize(UserRole.student), updateMyPracticeTask);
tasksRouter.delete('/:taskId', authorize(UserRole.student), deleteMyPracticeTask);

export { tasksRouter };
