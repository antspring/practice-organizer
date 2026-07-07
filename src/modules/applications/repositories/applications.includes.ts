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
  answers: orderedAnswersInclude,
};

const applicationDetailsInclude = {
  cohort: true,
  user: true,
  answers: orderedAnswersInclude,
};

export {
  applicationDetailsInclude,
  applicationWithCohortInclude,
};
