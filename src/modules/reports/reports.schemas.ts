import { z } from 'zod';

const reportApplicationParamsSchema = z.object({
  applicationId: z.string().uuid(),
});

const updateReportApprovalBodySchema = z.object({
  isApproved: z.boolean(),
});

export { reportApplicationParamsSchema, updateReportApprovalBodySchema };
