import { User, IUser } from '../users/user.model';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt.utils';
import { AppError } from '../../shared/utils/response.utils';
import { Role, ROLES } from '../../shared/constants/roles';
import { hashPassword } from '../../shared/utils/password.utils';

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: Role;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

interface RefreshResult {
  accessToken: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Account is deactivated', 403);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = signAccessToken({ id: user._id.toString(), role: user.role as Role });
  const refreshToken = signRefreshToken({ id: user._id.toString() });

  const userResponse = user.toJSON();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as Role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

interface RegisterResult {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: Role;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export const register = async (
  name: string,
  email: string,
  password: string,
  role?: Role
): Promise<RegisterResult> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const userRole = role || ROLES.USER;

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    status: 'active',
  });

  const accessToken = signAccessToken({ id: user._id.toString(), role: user.role as Role });
  const refreshToken = signRefreshToken({ id: user._id.toString() });

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as Role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

export const refresh = async (refreshToken: string): Promise<RefreshResult> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.status === 'inactive') {
      throw new AppError('Account is deactivated', 403);
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role as Role,
    });

    return { accessToken };
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};
