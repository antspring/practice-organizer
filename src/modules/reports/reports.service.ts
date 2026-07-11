import { PracticeApplicationStatus, UserRole } from '../../generated/prisma/enums';
import { AppError } from '../../shared/http/errors/AppError';
import { fileStorage } from '../../shared/storage';
import { findReportApplicationById, upsertPracticeReport } from './reports.repository';

type ReportUser = {
  id: string;
  role: UserRole;
};

type UploadedReport = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

const REPORT_FILE_EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

const ensureCanReadReport = (user: ReportUser, applicationUserId: string) => {
  if (user.role === UserRole.admin || (user.role === UserRole.student && user.id === applicationUserId)) {
    return;
  }

  throw new AppError('Forbidden', 403);
};

const getReportApplication = async (applicationId: string) => {
  const application = await findReportApplicationById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  return application;
};

const uploadReport = async (applicationId: string, user: ReportUser, file: UploadedReport | undefined) => {
  if (!file) {
    throw new AppError('Report file is required', 400);
  }

  const application = await getReportApplication(applicationId);

  if (user.role !== UserRole.student || application.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  if (application.status !== PracticeApplicationStatus.approved) {
    throw new AppError('Application must be approved', 400);
  }

  const storedFile = await fileStorage.store({
    data: file.buffer,
    extension: REPORT_FILE_EXTENSIONS[file.mimetype],
  });

  try {
    const report = await upsertPracticeReport({
      applicationId,
      storageKey: storedFile.key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    if (application.report) {
      fileStorage.delete(application.report.storageKey).catch(console.error);
    }

    return report;
  } catch (error) {
    await fileStorage.delete(storedFile.key);
    throw error;
  }
};

const getReport = async (applicationId: string, user: ReportUser) => {
  const application = await getReportApplication(applicationId);
  ensureCanReadReport(user, application.userId);

  return application.report;
};

const downloadReport = async (applicationId: string, user: ReportUser) => {
  const report = await getReport(applicationId, user);

  if (!report) {
    throw new AppError('Practice report not found', 404);
  }

  return {
    report,
    buffer: await fileStorage.read(report.storageKey),
  };
};

export { downloadReport, getReport, uploadReport };
