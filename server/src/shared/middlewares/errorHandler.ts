import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import { AppError } from '../utils/response.utils';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue)[0];
    message = `${field} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(statusCode !== 500 && (err as any).errors ? { errors: (err as any).errors } : {}),
  });
};
