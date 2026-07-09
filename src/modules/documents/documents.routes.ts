import { Router } from 'express';

import { authenticate } from '../auth/auth.middleware';
import { getIndividualAssignmentDocument } from './documents.controller';

const documentsRouter = Router();

documentsRouter.use(authenticate);
documentsRouter.get('/applications/:applicationId/individual-assignment', getIndividualAssignmentDocument);

export { documentsRouter };
