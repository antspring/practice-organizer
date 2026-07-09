import { prismaClient } from '../../shared/database/prismaClient';

const findApplicationForDocumentById = (id: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: { id },
    include: {
      cohort: true,
      track: true,
      user: {
        include: {
          practiceProfile: true,
        },
      },
    },
  });
};

export { findApplicationForDocumentById };
