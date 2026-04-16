import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/response.utils';

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden: insufficient permissions', 403);
    }

    next();
  };
};
