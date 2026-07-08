import { z } from 'zod';

const cohortTracksParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

const trackIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const createTrackSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const updateTrackSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export { cohortTracksParamsSchema, createTrackSchema, trackIdParamsSchema, updateTrackSchema };
