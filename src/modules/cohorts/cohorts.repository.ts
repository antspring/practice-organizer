import { prismaClient } from '../../shared/database/prismaClient';

type CreateCohortData = {
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  isActive?: boolean;
};

type UpdateCohortData = {
  title?: string;
  description?: string | null;
  startsAt?: Date;
  endsAt?: Date;
  isActive?: boolean;
};

type ListCohortsParams = {
  skip: number;
  take: number;
};

const countCohorts = () => {
  return prismaClient.cohort.count();
};

const createCohort = (data: CreateCohortData) => {
  return prismaClient.cohort.create({ data });
};

const findCohortById = (id: string) => {
  return prismaClient.cohort.findUnique({
    where: { id },
  });
};

const listCohorts = ({ skip, take }: ListCohortsParams) => {
  return prismaClient.cohort.findMany({
    orderBy: { startsAt: 'desc' },
    skip,
    take,
  });
};

const updateCohort = (id: string, data: UpdateCohortData) => {
  return prismaClient.cohort.update({
    where: { id },
    data,
  });
};

export { countCohorts, createCohort, findCohortById, listCohorts, updateCohort };
