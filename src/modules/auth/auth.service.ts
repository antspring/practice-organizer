import { createHash, randomBytes } from 'node:crypto';

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import { appConfig } from '../../config/appConfig';
import { AppError } from '../../shared/http/errors/AppError';
import {
  createRefreshToken,
  createUser,
  deleteRefreshTokenByHash,
  deleteRefreshTokenById,
  findRefreshTokenByHash,
  findUserByEmail,
  findUserById,
} from './auth.repository';

const PASSWORD_SALT_ROUNDS = 10;
const REFRESH_TOKEN_BYTES_LENGTH = 64;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

type AuthPayload = {
  userId: string;
};

type AuthInput = {
  email: string;
  password: string;
};

const toUserResponse = (user: Awaited<ReturnType<typeof findUserById>>) => {
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const createAccessToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: appConfig.accessTokenExpiresIn,
  };

  return jwt.sign({ userId } satisfies AuthPayload, appConfig.jwtSecret, options);
};

const hashRefreshToken = (refreshToken: string) => {
  return createHash('sha256').update(refreshToken).digest('hex');
};

const getRefreshTokenExpirationDate = () => {
  return new Date(Date.now() + appConfig.refreshTokenExpiresInDays * MILLISECONDS_IN_DAY);
};

const createRefreshTokenForUser = async (userId: string) => {
  const refreshToken = randomBytes(REFRESH_TOKEN_BYTES_LENGTH).toString('hex');

  await createRefreshToken({
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpirationDate(),
  });

  return refreshToken;
};

const createAuthResponse = async (user: NonNullable<Awaited<ReturnType<typeof findUserById>>>) => {
  return {
    user: toUserResponse(user),
    accessToken: createAccessToken(user.id),
    refreshToken: await createRefreshTokenForUser(user.id),
  };
};

const register = async ({ email, password }: AuthInput) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await createUser({ email, passwordHash });

  return createAuthResponse(user);
};

const login = async ({ email, password }: AuthInput) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  return createAuthResponse(user);
};

const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);

  return toUserResponse(user);
};

const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, appConfig.jwtSecret) as AuthPayload;

    return payload;
  } catch {
    throw new AppError('Invalid authorization token', 401);
  }
};

const refresh = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);
  const storedRefreshToken = await findRefreshTokenByHash(tokenHash);

  if (!storedRefreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  await deleteRefreshTokenById(storedRefreshToken.id);

  if (storedRefreshToken.expiresAt <= new Date()) {
    throw new AppError('Refresh token expired', 401);
  }

  return createAuthResponse(storedRefreshToken.user);
};

const logout = async (refreshToken: string) => {
  await deleteRefreshTokenByHash(hashRefreshToken(refreshToken));
};

export { getCurrentUser, login, logout, refresh, register, verifyAccessToken };
