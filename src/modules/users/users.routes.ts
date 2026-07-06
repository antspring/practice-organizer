import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import { listUsers } from './users.controller';

const usersRouter = Router();

usersRouter.use(authenticate, authorize(UserRole.admin));
usersRouter.get('/', listUsers);

export { usersRouter };
