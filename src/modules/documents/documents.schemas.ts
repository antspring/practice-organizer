import { z } from 'zod';

const documentApplicationParamsSchema = z.object({
  applicationId: z.string().uuid(),
});

const documentCohortParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

export { documentApplicationParamsSchema, documentCohortParamsSchema };
