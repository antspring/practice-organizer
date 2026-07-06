import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes';
import { healthRouter } from '../modules/health/health.routes';
import { usersRouter } from '../modules/users/users.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/users', usersRouter);

export { router };
