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

const cohortResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  publicSlug: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  applicationStartsAt: z.string().datetime(),
  applicationEndsAt: z.string().datetime(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const publicCohortResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  applicationStartsAt: z.string().datetime(),
  applicationEndsAt: z.string().datetime(),
  isApplicationOpen: z.boolean(),
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

const cohortDetailsResponseSchema = z.object({
  cohort: cohortResponseSchema,
});

const publicCohortDetailsResponseSchema = z.object({
  cohort: publicCohortResponseSchema,
});

const cohortsListResponseSchema = z.object({
  items: z.array(cohortResponseSchema),
  pagination: paginationSchema,
});

export {
  authResponseSchema,
  cohortDetailsResponseSchema,
  cohortResponseSchema,
  cohortsListResponseSchema,
  errorResponseSchema,
  publicCohortDetailsResponseSchema,
  publicCohortResponseSchema,
  userResponseSchema,
  usersListResponseSchema,
};
