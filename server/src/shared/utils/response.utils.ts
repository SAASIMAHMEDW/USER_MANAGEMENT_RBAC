import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}
