import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors/AppError';

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation error',
      errors: error.issues,
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);

  response.status(500).json({ message: 'Internal server error' });
};

export { errorHandler };
