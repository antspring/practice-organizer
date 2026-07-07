import { prismaClient } from '../../shared/database/prismaClient';

type CreateApplicationAnswerData = {
  fieldId: string;
  value?: string;
  optionId?: string;
};

type CreateApplicationData = {
  userId: string;
  cohortId: string;
  answers: CreateApplicationAnswerData[];
};

const findApplicationByUserAndCohort = (userId: string, cohortId: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: {
      userId_cohortId: {
        userId,
        cohortId,
      },
    },
  });
};

const findApplicationById = (id: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: { id },
    include: {
      cohort: true,
    },
  });
};

const createApplication = ({ userId, cohortId, answers }: CreateApplicationData) => {
  return prismaClient.practiceApplication.create({
    data: {
      userId,
      cohortId,
      answers: {
        create: answers.map((answer) => ({
          fieldId: answer.fieldId,
          value: answer.value,
          optionId: answer.optionId,
        })),
      },
    },
    include: {
      cohort: true,
      answers: {
        include: {
          field: true,
          option: true,
        },
        orderBy: {
          field: {
            sortOrder: 'asc',
          },
        },
      },
    },
  });
};

const replaceApplicationAnswers = (applicationId: string, answers: CreateApplicationAnswerData[]) => {
  return prismaClient.$transaction(async (transaction) => {
    await transaction.practiceApplicationAnswer.deleteMany({
      where: { applicationId },
    });

    await transaction.practiceApplication.update({
      where: { id: applicationId },
      data: {
        answers: {
          create: answers.map((answer) => ({
            fieldId: answer.fieldId,
            value: answer.value,
            optionId: answer.optionId,
          })),
        },
      },
    });

    return transaction.practiceApplication.findUniqueOrThrow({
      where: { id: applicationId },
      include: {
        cohort: true,
        answers: {
          include: {
            field: true,
            option: true,
          },
          orderBy: {
            field: {
              sortOrder: 'asc',
            },
          },
        },
      },
    });
  });
};

const listApplicationsByUser = (userId: string) => {
  return prismaClient.practiceApplication.findMany({
    where: { userId },
    include: {
      cohort: true,
      answers: {
        include: {
          field: true,
          option: true,
        },
        orderBy: {
          field: {
            sortOrder: 'asc',
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export { createApplication, findApplicationById, findApplicationByUserAndCohort, listApplicationsByUser, replaceApplicationAnswers };
