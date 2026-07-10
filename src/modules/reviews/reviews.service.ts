import { AppError } from '../../shared/http/errors/AppError';
import { findApplicationDetailsById } from '../applications/applications.repository';
import { findReviewByApplicationId, upsertReviewByApplicationId } from './reviews.repository';
import { UpsertPracticeReviewInput } from './types/reviews.types';

const ensureApplicationExists = async (applicationId: string) => {
  const application = await findApplicationDetailsById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }
};

const getPracticeReviewForAdmin = async (applicationId: string) => {
  await ensureApplicationExists(applicationId);
  const review = await findReviewByApplicationId(applicationId);

  return { review };
};

const upsertPracticeReviewForAdmin = async (applicationId: string, input: UpsertPracticeReviewInput) => {
  await ensureApplicationExists(applicationId);
  const review = await upsertReviewByApplicationId(applicationId, input);

  return { review };
};

export { getPracticeReviewForAdmin, upsertPracticeReviewForAdmin };
