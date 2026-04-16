import React from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { Button } from '../../../shared/components/ui/Button';
import { User } from '../types';
import { formatDateTime } from '../../../shared/utils/format.utils';

interface UserDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
  canEdit: boolean;
}

export const UserDetailPanel: React.FC<UserDetailPanelProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
  canEdit,
}) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
            <p className="text-slate-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={user.role as 'admin' | 'manager' | 'user'}>
                {user.role}
              </Badge>
              <Badge variant={user.status === 'active' ? 'active' : 'inactive'}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Audit Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Created</span>
              <div className="text-sm text-slate-900 text-right">
                <p>{user.createdAt ? formatDateTime(user.createdAt) : '-'}</p>
                <p className="text-slate-500">
                  by {user.createdBy?.name || 'System'}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Last Updated</span>
              <div className="text-sm text-slate-900 text-right">
                <p>{user.updatedAt ? formatDateTime(user.updatedAt) : '-'}</p>
                <p className="text-slate-500">
                  by {user.updatedBy?.name || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {canEdit && (
            <Button className="flex-1" onClick={() => onEdit(user)}>
              Edit User
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
