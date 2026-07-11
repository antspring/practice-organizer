import { prismaClient } from '../../shared/database/prismaClient';

type CreateTaskData = {
  userId: string;
  cohortId: string;
  date: Date;
  title: string;
  description: string;
  artifactLink?: string | null;
};

type UpdateTaskData = {
  title?: string;
  description?: string;
  artifactLink?: string | null;
};

const findTaskCohortById = (id: string) => {
  return prismaClient.cohort.findUnique({ where: { id } });
};

const findApprovedTaskApplication = (userId: string, cohortId: string) => {
  return prismaClient.practiceApplication.findFirst({
    where: {
      userId,
      cohortId,
      status: 'approved',
    },
  });
};

const findPracticeTaskById = (id: string) => {
  return prismaClient.practiceTask.findUnique({ where: { id } });
};

const findPracticeTaskByDate = (userId: string, cohortId: string, date: Date) => {
  return prismaClient.practiceTask.findUnique({
    where: {
      userId_cohortId_date: {
        userId,
        cohortId,
        date,
      },
    },
  });
};

const listPracticeTasksByWeek = (userId: string, cohortId: string, startsAt: Date, endsAt: Date) => {
  return prismaClient.practiceTask.findMany({
    where: {
      userId,
      cohortId,
      date: {
        gte: startsAt,
        lte: endsAt,
      },
    },
    orderBy: { date: 'asc' },
  });
};

const createPracticeTask = (data: CreateTaskData) => {
  return prismaClient.practiceTask.create({ data });
};

const updatePracticeTask = (id: string, data: UpdateTaskData) => {
  return prismaClient.practiceTask.update({
    where: { id },
    data,
  });
};

const deletePracticeTask = (id: string) => {
  return prismaClient.practiceTask.delete({ where: { id } });
};

export {
  createPracticeTask,
  deletePracticeTask,
  findApprovedTaskApplication,
  findPracticeTaskByDate,
  findPracticeTaskById,
  findTaskCohortById,
  listPracticeTasksByWeek,
  updatePracticeTask,
};
