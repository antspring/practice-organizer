import { prismaClient } from '../../shared/database/prismaClient';
import { PracticeApplicationStatus } from '../../generated/prisma/enums';

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

const findApplicationDetailsById = (id: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: { id },
    include: {
      cohort: true,
      user: true,
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

const findLatestPreviousApplicationWithAnswers = (userId: string, excludedCohortId: string) => {
  return prismaClient.practiceApplication.findFirst({
    where: {
      userId,
      cohortId: {
        not: excludedCohortId,
      },
    },
    include: {
      answers: {
        include: {
          field: true,
          option: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
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

const listApplicationsByCohort = (cohortId: string) => {
  return prismaClient.practiceApplication.findMany({
    where: { cohortId },
    include: {
      cohort: true,
      user: true,
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

const updateApplicationStatus = (id: string, status: PracticeApplicationStatus) => {
  return prismaClient.practiceApplication.update({
    where: { id },
    data: { status },
    include: {
      cohort: true,
      user: true,
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

export {
  createApplication,
  findApplicationDetailsById,
  findApplicationById,
  findApplicationByUserAndCohort,
  findLatestPreviousApplicationWithAnswers,
  listApplicationsByCohort,
  listApplicationsByUser,
  replaceApplicationAnswers,
  updateApplicationStatus,
};
