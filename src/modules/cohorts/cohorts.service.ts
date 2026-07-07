import { AppError } from '../../shared/http/errors/AppError';
import {
  countCohorts,
  createCohort,
  findCohortById,
  findCohortByPublicSlug,
  listCohorts,
  updateCohort,
} from './cohorts.repository';

type CreateCohortInput = {
  title: string;
  description?: string;
  publicSlug: string;
  startsAt: string;
  endsAt: string;
  applicationStartsAt: string;
  applicationEndsAt: string;
  isActive?: boolean;
};

type UpdateCohortInput = {
  title?: string;
  description?: string | null;
  publicSlug?: string;
  startsAt?: string;
  endsAt?: string;
  applicationStartsAt?: string;
  applicationEndsAt?: string;
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

const ensureDateRangeIsValid = (startsAt: Date, endsAt: Date, message: string) => {
  if (startsAt >= endsAt) {
    throw new AppError(message, 400);
  }
};

const ensurePublicSlugIsAvailable = async (publicSlug: string, currentCohortId?: string) => {
  const cohort = await findCohortByPublicSlug(publicSlug);

  if (cohort && cohort.id !== currentCohortId) {
    throw new AppError('Cohort public slug already exists', 409);
  }
};

const createCohortForAdmin = async (input: CreateCohortInput) => {
  const { startsAt, endsAt } = toDateRange(input);
  const applicationStartsAt = new Date(input.applicationStartsAt);
  const applicationEndsAt = new Date(input.applicationEndsAt);

  ensureDateRangeIsValid(startsAt, endsAt, 'startsAt must be earlier than endsAt');
  ensureDateRangeIsValid(
    applicationStartsAt,
    applicationEndsAt,
    'applicationStartsAt must be earlier than applicationEndsAt',
  );
  await ensurePublicSlugIsAvailable(input.publicSlug);

  return createCohort({
    title: input.title,
    description: input.description,
    publicSlug: input.publicSlug,
    startsAt,
    endsAt,
    applicationStartsAt,
    applicationEndsAt,
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
  const applicationStartsAt = input.applicationStartsAt
    ? new Date(input.applicationStartsAt)
    : cohort.applicationStartsAt;
  const applicationEndsAt = input.applicationEndsAt ? new Date(input.applicationEndsAt) : cohort.applicationEndsAt;

  ensureDateRangeIsValid(startsAt, endsAt, 'startsAt must be earlier than endsAt');
  ensureDateRangeIsValid(
    applicationStartsAt,
    applicationEndsAt,
    'applicationStartsAt must be earlier than applicationEndsAt',
  );

  if (input.publicSlug) {
    await ensurePublicSlugIsAvailable(input.publicSlug, id);
  }

  return updateCohort(id, {
    title: input.title,
    description: input.description,
    publicSlug: input.publicSlug,
    startsAt: input.startsAt ? startsAt : undefined,
    endsAt: input.endsAt ? endsAt : undefined,
    applicationStartsAt: input.applicationStartsAt ? applicationStartsAt : undefined,
    applicationEndsAt: input.applicationEndsAt ? applicationEndsAt : undefined,
    isActive: input.isActive,
  });
};

export { createCohortForAdmin, getCohortById, listCohortsForUser, updateCohortForAdmin };
