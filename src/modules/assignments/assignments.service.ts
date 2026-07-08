import { getCohortById } from '../cohorts/cohorts.service';
import { findCohortAssignmentByCohortId, upsertCohortAssignment } from './assignments.repository';
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

export { getCohortAssignmentForAdmin, upsertCohortAssignmentForAdmin };
