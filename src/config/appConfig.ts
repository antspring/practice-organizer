import 'dotenv/config';

import type { SignOptions } from 'jsonwebtoken';

const DEFAULT_PORT = 3000;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_MAIL_FROM = 'Practice Organizer <no-reply@example.com>';
const DEFAULT_FILE_STORAGE_DRIVER = 'local';
const DEFAULT_LOCAL_STORAGE_ROOT = 'uploads';

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

const parseBoolean = (value: string | undefined) => {
  return value === 'true';
};

const getRequiredEnvWhen = (name: string, condition: boolean) => {
  if (!condition) {
    return undefined;
  }

  return getRequiredEnv(name);
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
  fileStorage: {
    driver: process.env.FILE_STORAGE_DRIVER || DEFAULT_FILE_STORAGE_DRIVER,
    localRoot: process.env.LOCAL_STORAGE_ROOT || DEFAULT_LOCAL_STORAGE_ROOT,
  },
  mail: {
    enabled: parseBoolean(process.env.MAIL_ENABLED),
    from: process.env.MAIL_FROM || DEFAULT_MAIL_FROM,
    smtp: {
      host: getRequiredEnvWhen('SMTP_HOST', parseBoolean(process.env.MAIL_ENABLED)),
      port: parsePositiveInteger(process.env.SMTP_PORT, 587, 'SMTP_PORT'),
      secure: parseBoolean(process.env.SMTP_SECURE),
      user: getRequiredEnvWhen('SMTP_USER', parseBoolean(process.env.MAIL_ENABLED)),
      password: getRequiredEnvWhen('SMTP_PASSWORD', parseBoolean(process.env.MAIL_ENABLED)),
    },
  },
};
