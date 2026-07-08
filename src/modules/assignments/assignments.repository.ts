import { prismaClient } from '../../shared/database/prismaClient';

type UpsertCohortAssignmentData = {
  title: string;
  description?: string | null;
  content: string;
  isPublished: boolean;
};

const findCohortAssignmentByCohortId = (cohortId: string) => {
  return prismaClient.cohortAssignment.findUnique({
    where: { cohortId },
  });
};

const upsertCohortAssignment = (cohortId: string, data: UpsertCohortAssignmentData) => {
  return prismaClient.cohortAssignment.upsert({
    where: { cohortId },
    create: {
      cohortId,
      ...data,
    },
    update: data,
  });
};

export { findCohortAssignmentByCohortId, upsertCohortAssignment };
