import { Response } from 'express';
import { AuthRequest } from '../../shared/types';
import { login, refresh, register } from './auth.service';
import { successResponse, AppError } from '../../shared/utils/response.utils';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { env } from '../../config/env';

export const registerController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;
    const result = await register(name, email, password, role);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
    }, 'Registration successful');
  }
);

export const loginController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await login(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
    });
  }
);

export const refreshController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    const result = await refresh(refreshToken);
    successResponse(res, { accessToken: result.accessToken });
  }
);

export const logoutController = asyncHandler(
  async (_req: AuthRequest, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');
    successResponse(res, undefined, 'Logged out');
  }
);
