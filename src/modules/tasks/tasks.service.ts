import { AppError } from '../../shared/http/errors/AppError';
import {
  createPracticeTask,
  deletePracticeTask,
  findApprovedTaskApplication,
  findPracticeTaskByDate,
  findPracticeTaskById,
  findTaskCohortById,
  listPracticeTasksByWeek,
  updatePracticeTask,
} from './tasks.repository';

type CreateTaskInput = {
  date: string;
  title: string;
  description: string;
  artifactLink?: string | null;
};

type UpdateTaskInput = {
  title?: string;
  description?: string;
  artifactLink?: string | null;
};

const WEEKDAY_MONDAY = 1;
const WEEKDAY_FRIDAY = 5;
const DAYS_IN_WORK_WEEK = 5;

const parseDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

const addUtcDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const ensureApprovedApplication = async (userId: string, cohortId: string) => {
  const application = await findApprovedTaskApplication(userId, cohortId);

  if (!application) {
    throw new AppError('Approved application is required', 403);
  }
};

const getTaskCohort = async (cohortId: string) => {
  const cohort = await findTaskCohortById(cohortId);

  if (!cohort) {
    throw new AppError('Cohort not found', 404);
  }

  return cohort;
};

const ensureTaskDateIsAllowed = (date: Date, cohortStartsAt: Date, cohortEndsAt: Date) => {
  const weekday = date.getUTCDay();

  if (weekday < WEEKDAY_MONDAY || weekday > WEEKDAY_FRIDAY) {
    throw new AppError('Task date must be a weekday', 400);
  }

  if (date < cohortStartsAt || date > cohortEndsAt) {
    throw new AppError('Task date must be within practice period', 400);
  }
};

const listMyTasksByWeek = async (userId: string, cohortId: string, weekStart: string) => {
  const startsAt = parseDate(weekStart);

  if (startsAt.getUTCDay() !== WEEKDAY_MONDAY) {
    throw new AppError('weekStart must be a Monday', 400);
  }

  const cohort = await getTaskCohort(cohortId);
  await ensureApprovedApplication(userId, cohortId);

  return listPracticeTasksByWeek(userId, cohortId, startsAt, addUtcDays(startsAt, DAYS_IN_WORK_WEEK - 1));
};

const createMyTask = async (userId: string, cohortId: string, input: CreateTaskInput) => {
  const cohort = await getTaskCohort(cohortId);
  await ensureApprovedApplication(userId, cohortId);

  const date = parseDate(input.date);
  ensureTaskDateIsAllowed(date, cohort.startsAt, cohort.endsAt);

  if (await findPracticeTaskByDate(userId, cohortId, date)) {
    throw new AppError('Task already exists for this date', 409);
  }

  return createPracticeTask({
    userId,
    cohortId,
    date,
    title: input.title,
    description: input.description,
    artifactLink: input.artifactLink,
  });
};

const updateMyTask = async (userId: string, taskId: string, input: UpdateTaskInput) => {
  const task = await findPracticeTaskById(taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await ensureApprovedApplication(userId, task.cohortId);

  return updatePracticeTask(taskId, input);
};

const deleteMyTask = async (userId: string, taskId: string) => {
  const task = await findPracticeTaskById(taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await ensureApprovedApplication(userId, task.cohortId);
  await deletePracticeTask(taskId);
};

export { createMyTask, deleteMyTask, listMyTasksByWeek, updateMyTask };
