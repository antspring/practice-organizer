import { z } from 'zod';

const taskIdParamsSchema = z.object({
  taskId: z.string().uuid(),
});

const taskCohortParamsSchema = z.object({
  cohortId: z.string().uuid(),
});

const taskWeekQuerySchema = z.object({
  weekStart: z.iso.date(),
});

const createTaskBodySchema = z.object({
  date: z.iso.date(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  artifactLink: z.url().nullable().optional(),
});

const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    artifactLink: z.url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export {
  createTaskBodySchema,
  taskCohortParamsSchema,
  taskIdParamsSchema,
  taskWeekQuerySchema,
  updateTaskBodySchema,
};
