import { User, IUser } from './user.model';
import { AppError } from '../../shared/utils/response.utils';
import { hashPassword } from '../../shared/utils/password.utils';
import { ROLES, Role } from '../../shared/constants/roles';
import mongoose from 'mongoose';

interface UserQuery {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

interface PaginationResult {
  users: any[];
  total: number;
  page: number;
  totalPages: number;
}

const MAX_LIMIT = 100;

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const getAllUsers = async (
  query: UserQuery,
  requestingUser: { id: string; role: string }
): Promise<PaginationResult> => {
  const page = query.page || 1;
  const limit = Math.min(query.limit || 10, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getUserById = async (
  id: string,
  requestingUser: { id: string; role: string }
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  const user = await User.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

interface CreateUserBody {
  name: string;
  email: string;
  password?: string;
  role: Role;
  status?: 'active' | 'inactive';
}

interface CreateUserResult {
  user: any;
  generatedPassword?: string;
}

export const createUser = async (
  body: CreateUserBody,
  requestingUser: { id: string; role: string }
): Promise<CreateUserResult> => {
  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  let generatedPassword: string | undefined;

  if (!body.password) {
    generatedPassword = generatePassword();
    body.password = generatedPassword;
  }

  const user = await User.create({
    ...body,
    createdBy: requestingUser.id,
  });

  const userResponse = user.toJSON();

  return {
    user: userResponse,
    generatedPassword,
  };
};

interface UpdateUserBody {
  name?: string;
  email?: string;
  role?: Role;
  status?: 'active' | 'inactive';
}

export const updateUser = async (
  id: string,
  body: UpdateUserBody,
  requestingUser: { id: string; role: string }
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (requestingUser.role === ROLES.MANAGER) {
    if (body.role === ROLES.ADMIN) {
      throw new AppError('Managers cannot assign admin role', 403);
    }
    if (user.role === ROLES.ADMIN) {
      throw new AppError('Managers cannot update admin users', 403);
    }
    delete body.role;
  }

  if (body.email && body.email !== user.email) {
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }
  }

  Object.assign(user, body);
  user.updatedBy = new mongoose.Types.ObjectId(requestingUser.id);
  await user.save();

  const updatedUser = await User.findById(user._id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .lean();

  return updatedUser;
};

export const softDeleteUser = async (
  id: string,
  requestingUser: { id: string; role: string }
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  if (id === requestingUser.id) {
    throw new AppError('You cannot deactivate yourself', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (requestingUser.role !== ROLES.ADMIN && user.role === ROLES.ADMIN) {
    throw new AppError('Only admins can deactivate admin users', 403);
  }

  user.status = 'inactive';
  user.updatedBy = new mongoose.Types.ObjectId(requestingUser.id);
  await user.save();
};

interface StatsResult {
  total: number;
  active: number;
  inactive: number;
  managers: number;
}

export const getStats = async (): Promise<StatsResult> => {
  const [total, active, inactive, managers] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'inactive' }),
    User.countDocuments({ role: ROLES.MANAGER }),
  ]);

  return { total, active, inactive, managers };
};

export const getOwnProfile = async (
  requestingUser: { id: string; role: string }
): Promise<any> => {
  const user = await User.findById(requestingUser.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

interface UpdateOwnProfileBody {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateOwnProfile = async (
  id: string,
  body: UpdateOwnProfileBody,
  requestingUser: { id: string; role: string }
): Promise<any> => {
  if (id !== requestingUser.id) {
    throw new AppError('You can only update your own profile', 403);
  }

  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (body.name) {
    user.name = body.name;
  }

  if (body.newPassword) {
    if (!body.currentPassword) {
      throw new AppError('Current password is required', 400);
    }

    const isPasswordValid = await user.comparePassword(body.currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = await hashPassword(body.newPassword);
  }

  user.updatedBy = new mongoose.Types.ObjectId(requestingUser.id);
  await user.save();

  const updatedUser = await User.findById(user._id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .lean();

  return updatedUser;
};
