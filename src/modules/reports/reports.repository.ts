import { prismaClient } from '../../shared/database/prismaClient';

type UpsertPracticeReportData = {
  applicationId: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
};

const findReportApplicationById = (applicationId: string) => {
  return prismaClient.practiceApplication.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      userId: true,
      status: true,
      report: true,
    },
  });
};

const upsertPracticeReport = (data: UpsertPracticeReportData) => {
  const { applicationId, ...reportData } = data;

  return prismaClient.practiceReport.upsert({
    where: { applicationId },
    create: data,
    update: reportData,
  });
};

export { findReportApplicationById, upsertPracticeReport };
