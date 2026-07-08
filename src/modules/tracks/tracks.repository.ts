import { prismaClient } from '../../shared/database/prismaClient';

type CreateTrackData = {
  cohortId: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
};

type UpdateTrackData = {
  title?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

const createTrack = (data: CreateTrackData) => {
  return prismaClient.cohortTrack.create({ data });
};

const findTrackById = (id: string) => {
  return prismaClient.cohortTrack.findUnique({
    where: { id },
  });
};

const findTrackByCohortAndTitle = (cohortId: string, title: string) => {
  return prismaClient.cohortTrack.findUnique({
    where: {
      cohortId_title: {
        cohortId,
        title,
      },
    },
  });
};

const listTracksByCohort = (cohortId: string) => {
  return prismaClient.cohortTrack.findMany({
    where: { cohortId },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
};

const updateTrack = (id: string, data: UpdateTrackData) => {
  return prismaClient.cohortTrack.update({
    where: { id },
    data,
  });
};

export { createTrack, findTrackByCohortAndTitle, findTrackById, listTracksByCohort, updateTrack };
