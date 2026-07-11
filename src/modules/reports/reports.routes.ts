import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  downloadPracticeReport,
  getPracticeReport,
  updatePracticeReportApproval,
  uploadPracticeReport as uploadPracticeReportController,
} from './reports.controller';
import { uploadPracticeReport } from './reports.upload';

const reportsRouter = Router();

reportsRouter.use(authenticate);
reportsRouter.get('/applications/:applicationId', getPracticeReport);
reportsRouter.get('/applications/:applicationId/file', downloadPracticeReport);
reportsRouter.patch(
  '/applications/:applicationId/approval',
  authorize(UserRole.admin),
  updatePracticeReportApproval,
);
reportsRouter.put(
  '/applications/:applicationId',
  authorize(UserRole.student),
  uploadPracticeReport,
  uploadPracticeReportController,
);

export { reportsRouter };
