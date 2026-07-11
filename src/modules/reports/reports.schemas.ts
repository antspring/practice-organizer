import { z } from 'zod';

const reportApplicationParamsSchema = z.object({
  applicationId: z.string().uuid(),
});

export { reportApplicationParamsSchema };
