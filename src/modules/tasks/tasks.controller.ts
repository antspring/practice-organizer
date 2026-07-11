import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { presentPracticeTask, presentTaskParticipant } from './tasks.presenter';
import {
  createTaskBodySchema,
  taskCohortParamsSchema,
  taskIdParamsSchema,
  taskWeekQuerySchema,
  updateTaskBodySchema,
} from './tasks.schemas';
import {
  createMyTask,
  deleteMyTask,
  listCohortTasksByWeek,
  listMyTasksByWeek,
  updateMyTask,
} from './tasks.service';

const listMyPracticeTasks: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = taskCohortParamsSchema.parse(request.params);
  const { weekStart } = taskWeekQuerySchema.parse(request.query);
  const tasks = await listMyTasksByWeek(response.locals.user.id, cohortId, weekStart);

  response.status(200).json({ items: tasks.map(presentPracticeTask) });
});

const createMyPracticeTask: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = taskCohortParamsSchema.parse(request.params);
  const input = createTaskBodySchema.parse(request.body);
  const task = await createMyTask(response.locals.user.id, cohortId, input);

  response.status(201).json({ task: presentPracticeTask(task) });
});

const listCohortPracticeTasks: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = taskCohortParamsSchema.parse(request.params);
  const { weekStart } = taskWeekQuerySchema.parse(request.query);
  const participants = await listCohortTasksByWeek(response.locals.user, cohortId, weekStart);

  response.status(200).json({ items: participants.map(presentTaskParticipant) });
});

const updateMyPracticeTask: RequestHandler = asyncHandler(async (request, response) => {
  const { taskId } = taskIdParamsSchema.parse(request.params);
  const input = updateTaskBodySchema.parse(request.body);
  const task = await updateMyTask(response.locals.user.id, taskId, input);

  response.status(200).json({ task: presentPracticeTask(task) });
});

const deleteMyPracticeTask: RequestHandler = asyncHandler(async (request, response) => {
  const { taskId } = taskIdParamsSchema.parse(request.params);
  await deleteMyTask(response.locals.user.id, taskId);

  response.status(204).send();
});

export {
  createMyPracticeTask,
  deleteMyPracticeTask,
  listCohortPracticeTasks,
  listMyPracticeTasks,
  updateMyPracticeTask,
};
