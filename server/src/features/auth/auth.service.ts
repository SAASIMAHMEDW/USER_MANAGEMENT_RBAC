import { User, IUser } from '../users/user.model';
import { RefreshToken, IRefreshToken } from './refreshToken.model';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateTokenId,
} from '../../shared/utils/jwt.utils';
import { AppError } from '../../shared/utils/response.utils';
import { Role, ROLES } from '../../shared/constants/roles';

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
  refreshToken: string;
}

const createRefreshToken = async (userId: string): Promise<string> => {
  const tokenId = generateTokenId();
  const refreshToken = signRefreshToken({ id: userId, tokenId });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: userId,
    token: refreshToken,
    expiresAt,
    revoked: false,
  });

  return refreshToken;
};

const validateRefreshToken = async (refreshToken: string): Promise<IRefreshToken> => {
  const decoded = verifyRefreshToken(refreshToken);
  
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    userId: decoded.id,
  });

  if (!storedToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  if (storedToken.revoked) {
    throw new AppError('Refresh token has been revoked', 401);
  }

  if (storedToken.isExpired()) {
    throw new AppError('Refresh token has expired', 401);
  }

  return storedToken;
};

const revokeRefreshToken = async (tokenId: string): Promise<void> => {
  await RefreshToken.findOneAndUpdate(
    { token: tokenId },
    { revoked: true }
  );
};

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
  const refreshToken = await createRefreshToken(user._id.toString());

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

export const register = async (
  name: string,
  email: string,
  password: string,
  role?: Role
): Promise<LoginResult> => {
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
  const refreshToken = await createRefreshToken(user._id.toString());

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
    const storedToken = await validateRefreshToken(refreshToken);
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.status === 'inactive') {
      throw new AppError('Account is deactivated', 403);
    }

    await revokeRefreshToken(refreshToken);

    const newAccessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role as Role,
    });

    const newRefreshToken = await createRefreshToken(user._id.toString());

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const logout = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await revokeRefreshToken(refreshToken);
    } catch {
    }
  }
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await RefreshToken.updateMany(
    { userId, revoked: false },
    { revoked: true }
  );
};