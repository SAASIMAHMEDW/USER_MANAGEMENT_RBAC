import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/authenticate';
import { authorize } from '../../shared/middlewares/authorize';
import { validate } from '../../shared/middlewares/validate';
import {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
  idParamValidator,
} from './user.validation';
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getOwnProfileController,
  updateOwnProfileController,
  getStatsController,
} from './user.controller';
import { ROLES } from '../../shared/constants/roles';

const router = Router();

router.get(
  '/stats',
  authenticate,
  authorize([ROLES.ADMIN]),
  getStatsController
);

router.get(
  '/',
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  getAllUsersController
);

router.post(
  '/',
  authenticate,
  authorize([ROLES.ADMIN]),
  createUserValidator,
  validate,
  createUserController
);

router.get('/me', authenticate, getOwnProfileController);

router.put(
  '/me',
  authenticate,
  updateProfileValidator,
  validate,
  updateOwnProfileController
);

router.get(
  '/:id',
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  idParamValidator,
  validate,
  getUserByIdController
);

router.put(
  '/:id',
  authenticate,
  authorize([ROLES.ADMIN, ROLES.MANAGER]),
  idParamValidator,
  validate,
  updateUserValidator,
  validate,
  updateUserController
);

router.delete(
  '/:id',
  authenticate,
  authorize([ROLES.ADMIN]),
  idParamValidator,
  validate,
  deleteUserController
);

export default router;
