import { FormFieldType } from '../../generated/prisma/enums';
import { prismaClient } from '../../shared/database/prismaClient';

type CreateCohortData = {
  title: string;
  description?: string;
  publicSlug: string;
  startsAt: Date;
  endsAt: Date;
  applicationStartsAt: Date;
  applicationEndsAt: Date;
  isActive?: boolean;
  isPubliclyListed?: boolean;
};

type UpdateCohortData = {
  title?: string;
  description?: string | null;
  publicSlug?: string;
  startsAt?: Date;
  endsAt?: Date;
  applicationStartsAt?: Date;
  applicationEndsAt?: Date;
  isActive?: boolean;
  isPubliclyListed?: boolean;
};

type ListCohortsParams = {
  skip: number;
  take: number;
};

type ReplaceCohortFormFieldData = {
  key: string;
  label: string;
  type: FormFieldType;
  isRequired: boolean;
  sortOrder: number;
  options: {
    label: string;
    value: string;
    sortOrder: number;
  }[];
};

const countCohorts = () => {
  return prismaClient.cohort.count();
};

const createCohort = (data: CreateCohortData) => {
  return prismaClient.cohort.create({ data });
};

const findCohortById = (id: string) => {
  return prismaClient.cohort.findUnique({
    where: { id },
  });
};

const findCohortByPublicSlug = (publicSlug: string) => {
  return prismaClient.cohort.findUnique({
    where: { publicSlug },
  });
};

const findPublicCohortBySlug = (publicSlug: string) => {
  return prismaClient.cohort.findUnique({
    where: { publicSlug },
    include: {
      formFields: {
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
};

const listCohorts = ({ skip, take }: ListCohortsParams) => {
  return prismaClient.cohort.findMany({
    orderBy: { startsAt: 'desc' },
    skip,
    take,
  });
};

const getCohortFormFields = (cohortId: string) => {
  return prismaClient.cohortFormField.findMany({
    where: { cohortId },
    include: {
      options: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
};

const replaceCohortFormFields = async (cohortId: string, fields: ReplaceCohortFormFieldData[]) => {
  return prismaClient.$transaction(async (transaction) => {
    await transaction.cohortFormField.deleteMany({
      where: { cohortId },
    });

    for (const field of fields) {
      await transaction.cohortFormField.create({
        data: {
          cohortId,
          key: field.key,
          label: field.label,
          type: field.type,
          isRequired: field.isRequired,
          sortOrder: field.sortOrder,
          options: {
            create: field.options.map((option) => ({
              label: option.label,
              value: option.value,
              sortOrder: option.sortOrder,
            })),
          },
        },
      });
    }

    return transaction.cohortFormField.findMany({
      where: { cohortId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  });
};

const updateCohort = (id: string, data: UpdateCohortData) => {
  return prismaClient.cohort.update({
    where: { id },
    data,
  });
};

export {
  countCohorts,
  createCohort,
  findCohortById,
  findCohortByPublicSlug,
  findPublicCohortBySlug,
  getCohortFormFields,
  listCohorts,
  replaceCohortFormFields,
  updateCohort,
};
