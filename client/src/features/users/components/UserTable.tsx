import React from 'react';
import { User } from '../types';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentUserRole: string;
  currentUserId: string;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  currentUserRole,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}) => {
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager';
  const canDelete = currentUserRole === 'admin';

  return (
    <div className="border border-silver-mist overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-silver-mist/30 bg-black">
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Name</th>
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Email</th>
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Role</th>
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Status</th>
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Created</th>
              <th className="px-4 py-3 text-left font-mono text-caption uppercase tracking-widest text-silver-mist">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-mist/30 bg-black">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-silver-mist mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-silver-mist font-body">No users found</p>
                    <p className="text-silver-mist text-sm mt-1 font-body">
                      Try adjusting your filters or create a new user
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
