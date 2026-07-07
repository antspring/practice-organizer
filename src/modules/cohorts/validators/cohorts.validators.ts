import { AppError } from '../../../shared/http/errors/AppError';
import { findCohortByPublicSlug } from '../cohorts.repository';
import { CreateCohortInput } from '../types/cohorts.types';

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

export { ensureDateRangeIsValid, ensurePublicSlugIsAvailable, toDateRange };
