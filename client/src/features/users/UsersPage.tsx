import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from './hooks/useUsers';
import { useUserMutations } from './hooks/useUserMutations';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { UserCreateModal } from './components/UserCreateModal';
import { UserEditModal } from './components/UserEditModal';
import { UserDeleteModal } from './components/UserDeleteModal';
import { UserDetailPanel } from './components/UserDetailPanel';
import { Pagination } from '../../shared/components/ui/Pagination';
import { Button } from '../../shared/components/ui/Button';
import { Spinner } from '../../shared/components/ui/Spinner';
import toast from 'react-hot-toast';
import { User } from './types';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { createUser, updateUser, deleteUser, isLoading: isMutating } = useUserMutations();

  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [page, setPage] = useState(1);

  const { users, total, totalPages, isLoading, refetch } = useUsers({
    page,
    role: filters.role,
    status: filters.status,
    search: filters.search,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleCreate = async (data: any) => {
    const result = await createUser(data);
    await refetch();
    return result;
  };

  const handleUpdate = async (data: any) => {
    if (!selectedUser) return;
    await updateUser(selectedUser._id, data);
    await refetch();
    setIsEditOpen(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser._id);
    await refetch();
    setIsDeleteOpen(false);
    setSelectedUser(null);
    toast.success('User deactivated successfully');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display text-white mb-3">
            USER MANAGEMENT
          </h1>
          <p className="font-body text-body text-silver-mist">
            Manage and view all users
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create User
          </Button>
        )}
      </div>

      <div className="border border-silver-mist p-4">
        <UserFilters onFiltersChange={handleFiltersChange} />
      </div>

      {isLoading ? (
        <div className="border border-silver-mist p-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            isLoading={isLoading}
            currentUserRole={currentUser?.role || 'user'}
            currentUserId={currentUser?.id || ''}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="border border-silver-mist">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <UserCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isMutating}
      />

      <UserEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleUpdate}
        isLoading={isMutating}
        currentUserRole={currentUser?.role || 'user'}
      />

      <UserDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
        isLoading={isMutating}
      />

      <UserDetailPanel
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={handleEdit}
        canEdit={currentUser?.role === 'admin' || currentUser?.role === 'manager'}
      />
    </div>
  );
};
