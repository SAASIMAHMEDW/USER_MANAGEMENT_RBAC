import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsersService } from '../../users/services/users.service';
import { Button } from '../../../shared/components/ui/Button';
import { Spinner } from '../../../shared/components/ui/Spinner';

export const ManagerDashboard: React.FC = () => {
  const { getUsers } = useUsersService();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUsers({ limit: 100 });
        const users = response.data.users;
        setStats({
          total: response.data.total,
          active: users.filter((u: any) => u.status === 'active').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [getUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-display text-white mb-2 sm:mb-3">
          MANAGER DASHBOARD
        </h1>
        <p className="font-body text-sm sm:text-body text-silver-mist">
          Overview of user management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="border border-silver-mist p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-micro sm:text-caption uppercase tracking-widest text-silver-mist">Total Users</p>
              <p className="font-display text-2xl sm:text-section text-white mt-1 sm:mt-2">{stats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-silver-mist p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-micro sm:text-caption uppercase tracking-widest text-silver-mist">Active Users</p>
              <p className="font-display text-2xl sm:text-section text-white mt-1 sm:mt-2">{stats.active}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-silver-mist flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Link to="/users">
          <Button variant="secondary" className="w-full sm:w-auto">View User List</Button>
        </Link>
      </div>
    </div>
  );
};
