import { z } from 'zod';

const updatePracticeProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(255).nullable().optional(),
  specialty: z.string().trim().min(1).max(255).nullable().optional(),
  group: z.string().trim().min(1).max(100).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export { updatePracticeProfileSchema };
