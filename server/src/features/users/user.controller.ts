import { Response } from 'express';
import { AuthRequest } from '../../shared/types';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  softDeleteUser,
  getOwnProfile,
  updateOwnProfile,
  getStats,
} from './user.service';
import { successResponse } from '../../shared/utils/response.utils';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ROLES } from '../../shared/constants/roles';

export const getAllUsersController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { page, limit, role, status, search } = req.query;
    const result = await getAllUsers(
      {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        role: role as string,
        status: status as string,
        search: search as string,
      },
      req.user!
    );

    successResponse(res, result);
  }
);

export const getUserByIdController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await getUserById(req.params.id as string, req.user!);
    successResponse(res, { user });
  }
);

export const createUserController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await createUser(req.body, req.user!);
    successResponse(res, result, undefined, 201);
  }
);

export const updateUserController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await updateUser(req.params.id as string, req.body, req.user!);
    successResponse(res, { user });
  }
);

export const deleteUserController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    await softDeleteUser(req.params.id as string, req.user!);
    successResponse(res, undefined, 'User deactivated');
  }
);

export const getOwnProfileController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await getOwnProfile(req.user!);
    successResponse(res, { user });
  }
);

export const updateOwnProfileController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await updateOwnProfile(req.user!.id, req.body, req.user!);
    successResponse(res, { user });
  }
);

export const getStatsController = asyncHandler(
  async (_req: AuthRequest, res: Response): Promise<void> => {
    const stats = await getStats();
    successResponse(res, stats);
  }
);
