import { z } from 'zod';

const cohortAssignmentParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

const upsertCohortAssignmentSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).nullable().optional(),
  content: z.string().trim().min(1),
  isPublished: z.boolean().default(false),
});

export { cohortAssignmentParamsSchema, upsertCohortAssignmentSchema };
