import { Router } from 'express';

import { authenticate } from '../auth/auth.middleware';
import {
  getIndividualAssignmentDocument,
  getSupervisorReviewDocument,
} from './documents.controller';

const documentsRouter = Router();

documentsRouter.use(authenticate);
documentsRouter.get('/applications/:applicationId/individual-assignment', getIndividualAssignmentDocument);
documentsRouter.get('/applications/:applicationId/supervisor-review', getSupervisorReviewDocument);

export { documentsRouter };
