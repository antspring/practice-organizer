import { AppError } from '../../shared/http/errors/AppError';
import {
  countCohorts,
  createCohort,
  findCohortById,
  findPublicCohortBySlug,
  getCohortFormFields,
  listCohorts,
  replaceCohortFormFields,
  updateCohort,
} from './cohorts.repository';
import { toPublicCohortResponse } from './presenters/cohorts-public.presenter';
import { CreateCohortInput, ListCohortsInput, ReplaceCohortFormInput, UpdateCohortInput } from './types/cohorts.types';
import { ensureDateRangeIsValid, ensurePublicSlugIsAvailable, toDateRange } from './validators/cohorts.validators';

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

const getPublicCohortBySlug = async (publicSlug: string) => {
  const cohort = await findPublicCohortBySlug(publicSlug);

  if (!cohort || !cohort.isActive) {
    throw new AppError('Cohort not found', 404);
  }

  return {
    cohort: toPublicCohortResponse(cohort),
  };
};

const getCohortFormForAdmin = async (cohortId: string) => {
  await getCohortById(cohortId);
  const fields = await getCohortFormFields(cohortId);

  return { fields };
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

const replaceCohortFormForAdmin = async (cohortId: string, input: ReplaceCohortFormInput) => {
  await getCohortById(cohortId);
  const fields = await replaceCohortFormFields(cohortId, input.fields);

  return { fields };
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

export {
  createCohortForAdmin,
  getCohortById,
  getCohortFormForAdmin,
  getPublicCohortBySlug,
  listCohortsForUser,
  replaceCohortFormForAdmin,
  updateCohortForAdmin,
};
