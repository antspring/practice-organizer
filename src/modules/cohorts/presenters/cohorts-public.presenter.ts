import { findCohortByPublicSlug, findPublicCohortBySlug } from '../cohorts.repository';

type CohortEntity = NonNullable<Awaited<ReturnType<typeof findCohortByPublicSlug>>>;
type PublicCohortEntity = NonNullable<Awaited<ReturnType<typeof findPublicCohortBySlug>>>;

const isApplicationOpen = (cohort: CohortEntity) => {
  const now = new Date();

  return cohort.applicationStartsAt <= now && cohort.applicationEndsAt >= now;
};

const toPublicCohortResponse = (cohort: PublicCohortEntity) => {
  return {
    id: cohort.id,
    title: cohort.title,
    description: cohort.description,
    startsAt: cohort.startsAt,
    endsAt: cohort.endsAt,
    applicationStartsAt: cohort.applicationStartsAt,
    applicationEndsAt: cohort.applicationEndsAt,
    isApplicationOpen: isApplicationOpen(cohort),
    form: {
      fields: cohort.formFields,
    },
  };
};

export { toPublicCohortResponse };
