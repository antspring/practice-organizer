import { AppError } from '../../../shared/http/errors/AppError';
import { findCohortById } from '../../cohorts/cohorts.repository';
import { findTrackById } from '../../tracks/tracks.repository';
import {
  findApplicationDetailsById,
  listApplicationsByCohort,
  updateApplicationStatus,
} from '../applications.repository';
import { UpdateApplicationStatusInput } from '../types/applications.types';

const listCohortApplicationsForAdmin = async (cohortId: string) => {
  const cohort = await findCohortById(cohortId);

  if (!cohort) {
    throw new AppError('Cohort not found', 404);
  }

  const items = await listApplicationsByCohort(cohortId);

  return { items };
};

const updateApplicationStatusForAdmin = async (applicationId: string, input: UpdateApplicationStatusInput) => {
  const application = await findApplicationDetailsById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (input.trackId) {
    const track = await findTrackById(input.trackId);

    if (!track || track.cohortId !== application.cohortId || !track.isActive) {
      throw new AppError('Track not found', 404);
    }
  }

  const updatedApplication = await updateApplicationStatus(applicationId, input.status, input.trackId);

  return { application: updatedApplication };
};

export { listCohortApplicationsForAdmin, updateApplicationStatusForAdmin };
