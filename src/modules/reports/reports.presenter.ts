type PracticeReportView = {
  id: string;
  applicationId: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
};

const presentPracticeReport = (report: PracticeReportView | null) => {
  if (!report) {
    return null;
  }

  return {
    id: report.id,
    applicationId: report.applicationId,
    originalName: report.originalName,
    mimeType: report.mimeType,
    size: report.size,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
};

export { presentPracticeReport };
