import React, { useState, useEffect } from 'react';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface UserFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    role: string;
    status: string;
  }) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch, role, status });
  }, [debouncedSearch, role, status, onFiltersChange]);

  const handleClear = () => {
    setSearch('');
    setRole('');
    setStatus('');
  };

  const hasFilters = search || role || status;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="user">User</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {hasFilters && (
        <Button variant="ghost" size="md" onClick={handleClear}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};
