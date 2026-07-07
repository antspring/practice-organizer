import { PracticeApplicationStatus } from '../../../generated/prisma/enums';
import { AppError } from '../../../shared/http/errors/AppError';
import { findCohortById, getCohortFormFields } from '../../cohorts/cohorts.repository';
import { validateAnswers } from '../validators/applications-answer.validator';
import {
  createApplication,
  findApplicationById,
  findApplicationByUserAndCohort,
  listApplicationsByUser,
  replaceApplicationAnswers,
} from '../applications.repository';
import { isApplicationOpen } from './applications-shared.service';
import { CreateApplicationInput } from '../types/applications.types';

const createApplicationForStudent = async (userId: string, input: CreateApplicationInput) => {
  const cohort = await findCohortById(input.cohortId);

  if (!cohort || !cohort.isActive) {
    throw new AppError('Cohort not found', 404);
  }

  if (!isApplicationOpen(cohort.applicationStartsAt, cohort.applicationEndsAt)) {
    throw new AppError('Application period is closed', 400);
  }

  const existingApplication = await findApplicationByUserAndCohort(userId, input.cohortId);

  if (existingApplication) {
    throw new AppError('Application already exists', 409);
  }

  const fields = await getCohortFormFields(input.cohortId);
  validateAnswers(fields, input.answers);

  const application = await createApplication({
    userId,
    cohortId: input.cohortId,
    answers: input.answers,
  });

  return { application };
};

const listCurrentUserApplications = async (userId: string) => {
  const items = await listApplicationsByUser(userId);

  return { items };
};

const updateApplicationForStudent = async (
  applicationId: string,
  userId: string,
  input: Pick<CreateApplicationInput, 'answers'>,
) => {
  const application = await findApplicationById(applicationId);

  if (!application || application.userId !== userId) {
    throw new AppError('Application not found', 404);
  }

  if (application.status !== PracticeApplicationStatus.pending) {
    throw new AppError('Only pending application can be updated', 400);
  }

  if (!isApplicationOpen(application.cohort.applicationStartsAt, application.cohort.applicationEndsAt)) {
    throw new AppError('Application period is closed', 400);
  }

  const fields = await getCohortFormFields(application.cohortId);
  validateAnswers(fields, input.answers);

  const updatedApplication = await replaceApplicationAnswers(applicationId, input.answers);

  return { application: updatedApplication };
};

export { createApplicationForStudent, listCurrentUserApplications, updateApplicationForStudent };
