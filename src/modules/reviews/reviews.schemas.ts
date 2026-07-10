import { z } from 'zod';

const reviewApplicationParamsSchema = z.object({
  applicationId: z.string().uuid(),
});

const upsertPracticeReviewBodySchema = z.object({
  activities: z.string().trim().min(1).max(5000).nullable().optional(),
  characteristic: z.string().trim().min(1).max(5000).nullable().optional(),
  isEmployed: z.boolean().nullable().optional(),
  employmentPosition: z.string().trim().min(1).max(255).nullable().optional(),
  isNextPracticeOffered: z.boolean().nullable().optional(),
  isEmploymentOffered: z.boolean().nullable().optional(),
  suggestions: z.string().trim().min(1).max(5000).nullable().optional(),
  grade: z.string().trim().min(1).max(100).nullable().optional(),
  isReady: z.boolean().optional(),
});

const upsertPracticeReviewSchema = upsertPracticeReviewBodySchema
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .transform((data) => ({
    isReady: false,
    ...data,
  }));

export { reviewApplicationParamsSchema, upsertPracticeReviewBodySchema, upsertPracticeReviewSchema };
