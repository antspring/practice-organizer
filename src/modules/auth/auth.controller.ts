import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from './auth.schemas';
import { login, logout, refresh, register } from './auth.service';

const registerUser: RequestHandler = asyncHandler(async (request, response) => {
  const data = registerSchema.parse(request.body);
  const result = await register(data);

  response.status(201).json(result);
});

const loginUser: RequestHandler = asyncHandler(async (request, response) => {
  const data = loginSchema.parse(request.body);
  const result = await login(data);

  response.status(200).json(result);
});

const getMe: RequestHandler = (_request, response) => {
  response.status(200).json({ user: response.locals.user });
};

const refreshTokens: RequestHandler = asyncHandler(async (request, response) => {
  const { refreshToken } = refreshTokenSchema.parse(request.body);
  const result = await refresh(refreshToken);

  response.status(200).json(result);
});

const logoutUser: RequestHandler = asyncHandler(async (request, response) => {
  const { refreshToken } = logoutSchema.parse(request.body);

  await logout(refreshToken);

  response.status(204).send();
});

export { getMe, loginUser, logoutUser, refreshTokens, registerUser };
