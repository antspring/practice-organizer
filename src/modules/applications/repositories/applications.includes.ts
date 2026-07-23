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
  review: {
    select: {
      isReady: true,
    },
  },
  answers: orderedAnswersInclude,
};

const applicationDetailsInclude = {
  cohort: true,
  track: true,
  user: {
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  answers: orderedAnswersInclude,
};

export {
  applicationDetailsInclude,
  applicationWithCohortInclude,
};
