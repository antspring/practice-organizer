import { AppError } from '../../shared/http/errors/AppError';
import { findApplicationByUserAndCohort } from '../applications/applications.repository';
import { getCohortById } from '../cohorts/cohorts.service';
import {
  findCohortAssignmentByCohortId,
  findPublishedCohortAssignmentByCohortId,
  upsertCohortAssignment,
} from './assignments.repository';
import { UpsertCohortAssignmentInput } from './types/assignments.types';

const getCohortAssignmentForAdmin = async (cohortId: string) => {
  await getCohortById(cohortId);
  const assignment = await findCohortAssignmentByCohortId(cohortId);

  return { assignment };
};

const upsertCohortAssignmentForAdmin = async (cohortId: string, input: UpsertCohortAssignmentInput) => {
  await getCohortById(cohortId);
  const assignment = await upsertCohortAssignment(cohortId, input);

  return { assignment };
};

const getPublishedCohortAssignmentForStudent = async (userId: string, cohortId: string) => {
  const application = await findApplicationByUserAndCohort(userId, cohortId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const assignment = await findPublishedCohortAssignmentByCohortId(cohortId);

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  return { assignment };
};

export { getCohortAssignmentForAdmin, getPublishedCohortAssignmentForStudent, upsertCohortAssignmentForAdmin };
