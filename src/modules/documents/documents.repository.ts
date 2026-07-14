import { PracticeApplicationStatus } from '../../generated/prisma/enums';
import { prismaClient } from '../../shared/database/prismaClient';

const findApplicationForDocumentById = (id: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: { id },
    include: {
      cohort: true,
      track: true,
      user: {
        select: {
          id: true,
          practiceProfile: true,
        },
      },
      review: true,
      report: true,
    },
  });
};

const listApprovedApplicationsForDocumentSummary = (cohortId: string) => {
  return prismaClient.practiceApplication.findMany({
    where: {
      cohortId,
      status: PracticeApplicationStatus.approved,
    },
    select: {
      id: true,
      userId: true,
      track: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          practiceProfile: true,
        },
      },
      review: true,
      report: {
        select: {
          isApproved: true,
        },
      },
    },
    orderBy: {
      user: {
        practiceProfile: {
          fullName: 'asc',
        },
      },
    },
  });
};

export { findApplicationForDocumentById, listApprovedApplicationsForDocumentSummary };
