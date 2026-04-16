import React from 'react';
import { User } from '../types';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { Badge } from '../../../shared/components/ui/Badge';
import { formatDate } from '../../../shared/utils/format.utils';

interface UserTableRowProps {
  user: User;
  currentUserRole: string;
  currentUserId: string;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  currentUserRole,
  currentUserId,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const isSelf = user._id === currentUserId;
  const isAdmin = user.role === 'admin';
  const canEditThisUser = canEdit && !isSelf && !(isAdmin && currentUserRole !== 'admin');

  return (
    <tr className="hover:bg-white/10 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <span className="font-body text-body text-white">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 font-body text-compact text-silver-mist">{user.email}</td>
      <td className="px-4 py-3">
        <Badge variant={user.role as 'admin' | 'manager' | 'user'}>
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.status === 'active' ? 'active' : 'inactive'}>
          {user.status}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-micro text-silver-mist">
        {user.createdAt ? formatDate(user.createdAt) : '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(user)}
            className="p-1.5 text-silver-mist hover:text-white hover:bg-white/10 rounded-sm transition-colors"
            title="View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {canEditThisUser && (
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 text-silver-mist hover:text-white hover:bg-white/10 rounded-sm transition-colors"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {canDelete && !isSelf && (
            <button
              onClick={() => onDelete(user)}
              className="p-1.5 text-silver-mist hover:text-white hover:bg-white/10 rounded-sm transition-colors"
              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
            >
              {user.status === 'active' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
