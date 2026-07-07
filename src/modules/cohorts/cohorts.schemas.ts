import { z } from 'zod';

const dateTimeSchema = z.string().datetime();

const validateDateRange = <T extends { startsAt?: string; endsAt?: string }>(data: T) => {
  if (!data.startsAt || !data.endsAt) {
    return true;
  }

  return new Date(data.startsAt) < new Date(data.endsAt);
};

const cohortIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const listCohortsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const createCohortSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().max(2000).optional(),
    startsAt: dateTimeSchema,
    endsAt: dateTimeSchema,
    isActive: z.boolean().optional(),
  })
  .refine(validateDateRange, {
    message: 'startsAt must be earlier than endsAt',
    path: ['endsAt'],
  });

const updateCohortSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    startsAt: dateTimeSchema.optional(),
    endsAt: dateTimeSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .refine(validateDateRange, {
    message: 'startsAt must be earlier than endsAt',
    path: ['endsAt'],
  });

export { cohortIdParamsSchema, createCohortSchema, listCohortsQuerySchema, updateCohortSchema };
