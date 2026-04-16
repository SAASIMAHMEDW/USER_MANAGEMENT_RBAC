import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt.utils';
import { AppError } from '../utils/response.utils';
import { Role } from '../constants/roles';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token);
      req.user = { id: decoded.id, role: decoded.role as Role };
      next();
    } catch (err: any) {
      if (err.message === 'ACCESS_TOKEN_EXPIRED') {
        throw new AppError('Access token has expired, please login again', 401);
      }
      if (err.message === 'INVALID_ACCESS_TOKEN') {
        throw new AppError('Invalid access token', 401);
      }
      throw new AppError('Invalid or expired token', 401);
    }
  } catch (error) {
    next(error);
  }
};
