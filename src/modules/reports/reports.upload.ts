import multer from 'multer';

import { AppError } from '../../shared/http/errors/AppError';

const MAX_REPORT_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_REPORT_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const uploadPracticeReport = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_REPORT_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_REPORT_MIME_TYPES.has(file.mimetype)) {
      callback(new AppError('Only PDF and DOCX reports are allowed', 400));
      return;
    }

    callback(null, true);
  },
}).single('report');

export { uploadPracticeReport };
