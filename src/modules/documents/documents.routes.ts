import { Router } from 'express';

import { authenticate } from '../auth/auth.middleware';
import {
  getIndividualAssignmentDocument,
  getReportTitlePageDocument,
  getSupervisorReviewDocument,
} from './documents.controller';

const documentsRouter = Router();

documentsRouter.use(authenticate);
documentsRouter.get('/applications/:applicationId/individual-assignment', getIndividualAssignmentDocument);
documentsRouter.get('/applications/:applicationId/supervisor-review', getSupervisorReviewDocument);
documentsRouter.get('/applications/:applicationId/report-title-page', getReportTitlePageDocument);

export { documentsRouter };
