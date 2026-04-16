import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../../users/services/users.service';
import { User } from '../../users/types';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { formatDate } from '../../../shared/utils/format.utils';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    managers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          usersService.getStats(),
          usersService.getUsers({ limit: 5 }),
        ]);
        setStats(statsResponse.data.data);
        setRecentUsers(usersResponse.data.data.users);
      } catch (err: any) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-display text-white mb-3">
          WELCOME BACK
        </h1>
        <p className="font-body text-body text-silver-mist">
          Here's what's happening with your system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-silver-mist p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-caption uppercase tracking-widest text-silver-mist">Total Users</p>
              <p className="font-display text-section text-white mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-silver-mist p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-caption uppercase tracking-widest text-silver-mist">Active Users</p>
              <p className="font-display text-section text-white mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-silver-mist p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-caption uppercase tracking-widest text-silver-mist">Inactive Users</p>
              <p className="font-display text-section text-white mt-2">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-silver-mist" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-silver-mist p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-caption uppercase tracking-widest text-silver-mist">Managers</p>
              <p className="font-display text-section text-white mt-2">{stats.managers}</p>
            </div>
            <div className="w-12 h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/users">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create User
          </Button>
        </Link>
        <Link to="/users">
          <Button variant="secondary">View All Users</Button>
        </Link>
      </div>

      <div className="border border-silver-mist">
        <div className="px-6 py-4 border-b border-silver-mist/30">
          <h3 className="font-display text-body text-white uppercase">Recent Users</h3>
        </div>
        <div className="divide-y divide-silver-mist/30">
          {recentUsers.length > 0 ? (
            recentUsers.map((u) => (
              <div key={u._id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <p className="font-body text-body text-white">{u.name}</p>
                    <p className="font-body text-compact text-silver-mist">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.role as 'admin' | 'manager' | 'user'} size="sm">
                    {u.role}
                  </Badge>
                  <Badge variant={u.status === 'active' ? 'active' : 'inactive'} size="sm">
                    {u.status}
                  </Badge>
                  <span className="font-mono text-micro text-silver-mist">
                    {u.createdAt ? formatDate(u.createdAt) : '-'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-silver-mist font-body">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
