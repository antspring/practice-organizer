import { z } from 'zod';

const updatePracticeProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(255).nullable().optional(),
  fullNameGenitive: z.string().trim().min(1).max(255).nullable().optional(),
  directionCode: z.string().trim().min(1).max(50).nullable().optional(),
  directionName: z.string().trim().min(1).max(255).nullable().optional(),
  educationProgram: z.string().trim().min(1).max(255).nullable().optional(),
  group: z.string().trim().min(1).max(100).nullable().optional(),
  urfuPracticeSupervisor: z.string().trim().min(1).max(255).nullable().optional(),
  mainStageWorkList: z.string().trim().min(1).max(10_000).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export { updatePracticeProfileSchema };
