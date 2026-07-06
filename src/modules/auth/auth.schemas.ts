import { z } from 'zod';

const emailSchema = z.string().trim().email().toLowerCase();

const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const logoutSchema = refreshTokenSchema;

export { loginSchema, logoutSchema, refreshTokenSchema, registerSchema };
