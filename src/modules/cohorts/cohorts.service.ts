import { AppError } from '../../shared/http/errors/AppError';
import { countCohorts, createCohort, findCohortById, listCohorts, updateCohort } from './cohorts.repository';

type CreateCohortInput = {
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
};

type UpdateCohortInput = {
  title?: string;
  description?: string | null;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
};

type ListCohortsInput = {
  page: number;
  limit: number;
};

const toDateRange = ({ startsAt, endsAt }: Pick<CreateCohortInput, 'startsAt' | 'endsAt'>) => {
  return {
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
  };
};

const ensureDateRangeIsValid = (startsAt: Date, endsAt: Date) => {
  if (startsAt >= endsAt) {
    throw new AppError('startsAt must be earlier than endsAt', 400);
  }
};

const createCohortForAdmin = async (input: CreateCohortInput) => {
  const { startsAt, endsAt } = toDateRange(input);

  ensureDateRangeIsValid(startsAt, endsAt);

  return createCohort({
    title: input.title,
    description: input.description,
    startsAt,
    endsAt,
    isActive: input.isActive,
  });
};

const getCohortById = async (id: string) => {
  const cohort = await findCohortById(id);

  if (!cohort) {
    throw new AppError('Cohort not found', 404);
  }

  return cohort;
};

const listCohortsForUser = async ({ page, limit }: ListCohortsInput) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([listCohorts({ skip, take: limit }), countCohorts()]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const updateCohortForAdmin = async (id: string, input: UpdateCohortInput) => {
  const cohort = await getCohortById(id);
  const startsAt = input.startsAt ? new Date(input.startsAt) : cohort.startsAt;
  const endsAt = input.endsAt ? new Date(input.endsAt) : cohort.endsAt;

  ensureDateRangeIsValid(startsAt, endsAt);

  return updateCohort(id, {
    title: input.title,
    description: input.description,
    startsAt: input.startsAt ? startsAt : undefined,
    endsAt: input.endsAt ? endsAt : undefined,
    isActive: input.isActive,
  });
};

export { createCohortForAdmin, getCohortById, listCohortsForUser, updateCohortForAdmin };
