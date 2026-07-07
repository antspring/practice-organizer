import { z } from 'zod';

import { PracticeApplicationStatus } from '../../generated/prisma/enums';

const applicationAnswerSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string().trim().min(1).max(2000).optional(),
  optionId: z.string().uuid().optional(),
});

const validateAnswerFieldIdsAreUnique = <T extends { answers: { fieldId: string }[] }>(
  data: T,
  context: z.RefinementCtx,
) => {
  const fieldIds = new Set<string>();

  data.answers.forEach((answer, index) => {
    if (fieldIds.has(answer.fieldId)) {
      context.addIssue({
        code: 'custom',
        message: 'Answer fieldId must be unique',
        path: ['answers', index, 'fieldId'],
      });
    }

    fieldIds.add(answer.fieldId);
  });
};

const applicationIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const applicationAutofillParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

const cohortApplicationsParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

const createApplicationSchema = z
  .object({
    cohortId: z.string().uuid(),
    answers: z.array(applicationAnswerSchema),
  })
  .superRefine(validateAnswerFieldIdsAreUnique);

const updateApplicationSchema = z
  .object({
    answers: z.array(applicationAnswerSchema),
  })
  .superRefine(validateAnswerFieldIdsAreUnique);

const updateApplicationStatusSchema = z.object({
  status: z.enum([
    PracticeApplicationStatus.pending,
    PracticeApplicationStatus.approved,
    PracticeApplicationStatus.rejected,
  ]),
});

export {
  applicationAutofillParamsSchema,
  applicationIdParamsSchema,
  cohortApplicationsParamsSchema,
  createApplicationSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
};
