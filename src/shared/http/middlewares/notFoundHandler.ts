import { RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Route not found' });
};

export { notFoundHandler };
