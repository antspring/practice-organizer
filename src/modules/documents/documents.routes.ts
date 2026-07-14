import { Router } from 'express';

import { UserRole } from '../../generated/prisma/enums';
import { authenticate, authorize } from '../auth/auth.middleware';
import {
  getCohortDocumentsSummary,
  getIndividualAssignmentDocument,
  getReportTitlePageDocument,
  getSupervisorReviewDocument,
} from './documents.controller';

const documentsRouter = Router();

documentsRouter.use(authenticate);
documentsRouter.get('/cohorts/:cohortId/summary', authorize(UserRole.admin), getCohortDocumentsSummary);
documentsRouter.get('/applications/:applicationId/individual-assignment', getIndividualAssignmentDocument);
documentsRouter.get('/applications/:applicationId/supervisor-review', getSupervisorReviewDocument);
documentsRouter.get('/applications/:applicationId/report-title-page', getReportTitlePageDocument);

export { documentsRouter };
