import 'dotenv/config';

const DEFAULT_PORT = 3000;
const MIN_PORT = 1;
const MAX_PORT = 65535;

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

export const appConfig = {
  port: parsePort(process.env.PORT),
  databaseUrl: getRequiredEnv('DATABASE_URL'),
};
