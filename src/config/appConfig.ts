import 'dotenv/config';

import type { SignOptions } from 'jsonwebtoken';

const DEFAULT_PORT = 3000;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;
const DEFAULT_NODE_ENV = 'development';

const parsePort = (value: string | undefined) => {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
};

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }

  return value;
};

const parsePositiveInteger = (value: string | undefined, fallback: number, name: string) => {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
};

export const appConfig = {
  nodeEnv: process.env.NODE_ENV || DEFAULT_NODE_ENV,
  port: parsePort(process.env.PORT),
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  accessTokenExpiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as NonNullable<SignOptions['expiresIn']>,
  refreshTokenExpiresInDays: parsePositiveInteger(
    process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    DEFAULT_REFRESH_TOKEN_EXPIRES_IN_DAYS,
    'REFRESH_TOKEN_EXPIRES_IN_DAYS',
  ),
};
