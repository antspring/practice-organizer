import { prismaClient } from '../../shared/database/prismaClient';
import { UpsertPracticeReviewInput } from './types/reviews.types';

const findReviewByApplicationId = (applicationId: string) => {
  return prismaClient.practiceReview.findUnique({
    where: { applicationId },
  });
};

const upsertReviewByApplicationId = (applicationId: string, data: UpsertPracticeReviewInput) => {
  return prismaClient.practiceReview.upsert({
    where: { applicationId },
    create: {
      applicationId,
      ...data,
    },
    update: data,
  });
};

export { findReviewByApplicationId, upsertReviewByApplicationId };
