const DEFAULT_PORT = 3000;

export const appConfig = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
};
