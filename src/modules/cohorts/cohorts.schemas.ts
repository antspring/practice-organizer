import { z } from 'zod';

import { FormFieldType } from '../../generated/prisma/enums';

const dateTimeSchema = z.string().datetime();
const publicSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'publicSlug must contain lowercase letters, numbers and hyphens only');

const validateDateRange = <T extends { startsAt?: string; endsAt?: string }>(data: T) => {
  if (!data.startsAt || !data.endsAt) {
    return true;
  }

  return new Date(data.startsAt) < new Date(data.endsAt);
};

const validateApplicationDateRange = <T extends { applicationStartsAt?: string; applicationEndsAt?: string }>(data: T) => {
  if (!data.applicationStartsAt || !data.applicationEndsAt) {
    return true;
  }

  return new Date(data.applicationStartsAt) < new Date(data.applicationEndsAt);
};

const cohortIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const publicCohortParamsSchema = z.object({
  publicSlug: publicSlugSchema,
});

const listCohortsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const cohortFormFieldOptionSchema = z.object({
  label: z.string().trim().min(1).max(255),
  value: z.string().trim().min(1).max(255),
  sortOrder: z.number().int().min(0).default(0),
});

const cohortFormFieldSchema = z
  .object({
    label: z.string().trim().min(1).max(255),
    type: z.enum([FormFieldType.text, FormFieldType.select]),
    isRequired: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
    options: z.array(cohortFormFieldOptionSchema).default([]),
  })
  .superRefine((field, context) => {
    if (field.type === FormFieldType.select && field.options.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Select field must have at least one option',
        path: ['options'],
      });
    }

    if (field.type === FormFieldType.text && field.options.length > 0) {
      context.addIssue({
        code: 'custom',
        message: 'Text field cannot have options',
        path: ['options'],
      });
    }

    const optionValues = new Set<string>();

    field.options.forEach((option, index) => {
      if (optionValues.has(option.value)) {
        context.addIssue({
          code: 'custom',
          message: 'Option values must be unique within a field',
          path: ['options', index, 'value'],
        });
      }

      optionValues.add(option.value);
    });
  });

const replaceCohortFormSchema = z.object({
  fields: z.array(cohortFormFieldSchema),
});

const createCohortSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().max(2000).optional(),
    publicSlug: publicSlugSchema,
    startsAt: dateTimeSchema,
    endsAt: dateTimeSchema,
    applicationStartsAt: dateTimeSchema,
    applicationEndsAt: dateTimeSchema,
    isActive: z.boolean().optional(),
  })
  .refine(validateDateRange, {
    message: 'startsAt must be earlier than endsAt',
    path: ['endsAt'],
  })
  .refine(validateApplicationDateRange, {
    message: 'applicationStartsAt must be earlier than applicationEndsAt',
    path: ['applicationEndsAt'],
  });

const updateCohortSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    publicSlug: publicSlugSchema.optional(),
    startsAt: dateTimeSchema.optional(),
    endsAt: dateTimeSchema.optional(),
    applicationStartsAt: dateTimeSchema.optional(),
    applicationEndsAt: dateTimeSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .refine(validateDateRange, {
    message: 'startsAt must be earlier than endsAt',
    path: ['endsAt'],
  })
  .refine(validateApplicationDateRange, {
    message: 'applicationStartsAt must be earlier than applicationEndsAt',
    path: ['applicationEndsAt'],
  });

export {
  cohortIdParamsSchema,
  createCohortSchema,
  listCohortsQuerySchema,
  publicCohortParamsSchema,
  replaceCohortFormSchema,
  updateCohortSchema,
};
