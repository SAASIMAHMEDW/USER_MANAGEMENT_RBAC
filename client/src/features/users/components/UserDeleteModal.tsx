import React from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { User } from '../types';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isLoading,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deactivate User" size="sm">
      <div className="space-y-6">
        <p className="font-body text-body text-silver-mist">
          Are you sure you want to deactivate{' '}
          <span className="font-body text-white">{user?.name}</span>?
        </p>
        <p className="font-body text-compact text-silver-mist">
          The user will not be able to log in until their account is reactivated.
        </p>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
