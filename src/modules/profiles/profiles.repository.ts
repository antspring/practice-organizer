import { prismaClient } from '../../shared/database/prismaClient';

type UpsertPracticeProfileData = {
  fullName?: string | null;
  specialty?: string | null;
  group?: string | null;
};

const findPracticeProfileByUserId = (userId: string) => {
  return prismaClient.practiceProfile.findUnique({
    where: { userId },
  });
};

const upsertPracticeProfile = (userId: string, data: UpsertPracticeProfileData) => {
  return prismaClient.practiceProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
};

export { findPracticeProfileByUserId, upsertPracticeProfile };
