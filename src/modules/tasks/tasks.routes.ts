import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  createMyPracticeTask,
  deleteMyPracticeTask,
  listMyPracticeTasks,
  updateMyPracticeTask,
} from './tasks.controller';

const tasksRouter = Router();

tasksRouter.use(authenticate, authorize(UserRole.student));
tasksRouter.get('/cohorts/:cohortId/me', listMyPracticeTasks);
tasksRouter.post('/cohorts/:cohortId', createMyPracticeTask);
tasksRouter.patch('/:taskId', updateMyPracticeTask);
tasksRouter.delete('/:taskId', deleteMyPracticeTask);

export { tasksRouter };
