import { ROLES } from './roles';

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canViewAllUsers: true,
    canCreateUsers: true,
    canEditAllUsers: true,
    canDeleteUsers: true,
    canChangeRoles: true,
  },
  [ROLES.MANAGER]: {
    canManageUsers: true,
    canViewAllUsers: true,
    canCreateUsers: false,
    canEditAllUsers: false,
    canDeleteUsers: false,
    canChangeRoles: false,
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canViewAllUsers: false,
    canCreateUsers: false,
    canEditAllUsers: false,
    canDeleteUsers: false,
    canChangeRoles: false,
  },
} as const;
