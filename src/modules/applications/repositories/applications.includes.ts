const orderedAnswersInclude = {
  include: {
    field: true,
    option: true,
  },
  orderBy: {
    field: {
      sortOrder: 'asc' as const,
    },
  },
};

const applicationWithCohortInclude = {
  cohort: true,
  track: true,
  answers: orderedAnswersInclude,
};

const applicationDetailsInclude = {
  cohort: true,
  track: true,
  user: true,
  answers: orderedAnswersInclude,
};

export {
  applicationDetailsInclude,
  applicationWithCohortInclude,
};
