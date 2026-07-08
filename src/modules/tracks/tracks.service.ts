import { AppError } from '../../shared/http/errors/AppError';
import { getCohortById } from '../cohorts/cohorts.service';
import {
  createTrack,
  findTrackByCohortAndTitle,
  findTrackById,
  listTracksByCohort,
  updateTrack,
} from './tracks.repository';
import { CreateTrackInput, UpdateTrackInput } from './types/tracks.types';

const ensureTrackTitleIsAvailable = async (cohortId: string, title: string, currentTrackId?: string) => {
  const track = await findTrackByCohortAndTitle(cohortId, title);

  if (track && track.id !== currentTrackId) {
    throw new AppError('Track title already exists in cohort', 409);
  }
};

const createTrackForAdmin = async (cohortId: string, input: CreateTrackInput) => {
  await getCohortById(cohortId);
  await ensureTrackTitleIsAvailable(cohortId, input.title);

  const track = await createTrack({
    cohortId,
    title: input.title,
    description: input.description,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  });

  return { track };
};

const listCohortTracksForAdmin = async (cohortId: string) => {
  await getCohortById(cohortId);
  const items = await listTracksByCohort(cohortId);

  return { items };
};

const updateTrackForAdmin = async (id: string, input: UpdateTrackInput) => {
  const track = await findTrackById(id);

  if (!track) {
    throw new AppError('Track not found', 404);
  }

  if (input.title) {
    await ensureTrackTitleIsAvailable(track.cohortId, input.title, id);
  }

  const updatedTrack = await updateTrack(id, input);

  return { track: updatedTrack };
};

export { createTrackForAdmin, listCohortTracksForAdmin, updateTrackForAdmin };
