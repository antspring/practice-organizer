import { Router } from 'express';

import { authenticate } from './auth.middleware';
import { getMe, loginUser, logoutUser, refreshTokens, registerUser } from './auth.controller';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refreshTokens);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', authenticate, getMe);

export { authRouter };
