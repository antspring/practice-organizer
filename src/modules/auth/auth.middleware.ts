import { RequestHandler } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { AppError } from '../../shared/http/errors/AppError';
import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { AuthPayload, getCurrentUser, verifyAccessToken } from './auth.service';

const AUTHORIZATION_HEADER_PARTS_COUNT = 2;

const authenticate: RequestHandler = asyncHandler(async (request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    throw new AppError('Authorization header is required', 401);
  }

  const authorizationParts = authorizationHeader.split(' ');
  const [scheme, token] = authorizationParts;

  if (scheme !== 'Bearer' || !token || authorizationParts.length !== AUTHORIZATION_HEADER_PARTS_COUNT) {
    throw new AppError('Authorization header must use Bearer token', 401);
  }

  const payload = verifyAccessToken(token);
  response.locals.auth = payload;
  response.locals.user = await getCurrentUser(payload.userId);

  next();
});

const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (_request, response, next) => {
    const auth = response.locals.auth as AuthPayload | undefined;

    if (!auth) {
      throw new AppError('Authentication is required', 401);
    }

    if (!allowedRoles.includes(auth.role)) {
      throw new AppError('Forbidden', 403);
    }

    next();
  };
};

export { authenticate, authorize };
