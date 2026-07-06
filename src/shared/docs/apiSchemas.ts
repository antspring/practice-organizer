import { z } from 'zod';

import { UserRole } from '../../generated/prisma/enums';

const errorResponseSchema = z.object({
  message: z.string(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum([UserRole.student, UserRole.admin]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const authResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

const paginationSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  pages: z.number().int(),
});

const usersListResponseSchema = z.object({
  items: z.array(userResponseSchema),
  pagination: paginationSchema,
});

export { authResponseSchema, errorResponseSchema, userResponseSchema, usersListResponseSchema };
