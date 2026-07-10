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
    },
  });
};

export { findApplicationForDocumentById };
