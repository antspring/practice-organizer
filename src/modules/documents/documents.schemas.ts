import { z } from 'zod';

const documentApplicationParamsSchema = z.object({
  applicationId: z.string().uuid(),
});

export { documentApplicationParamsSchema };
