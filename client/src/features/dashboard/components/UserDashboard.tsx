import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProfileService } from '../../profile/services/profile.service';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { Button } from '../../../shared/components/ui/Button';
import { formatDate } from '../../../shared/utils/format.utils';

export const UserDashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const { getProfile } = useProfileService();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.user);
      } catch (err) {
        setUser(authUser);
      }
    };
    fetchProfile();
  }, [getProfile, authUser]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-display text-white mb-2 sm:mb-3">
          WELCOME
        </h1>
        <p className="font-body text-sm sm:text-body text-silver-mist">
          Here's your account overview
        </p>
      </div>

      <div className="border border-silver-mist p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar name={user?.name || authUser?.name || ''} size="lg" />
          <div>
            <h2 className="font-display text-base sm:text-body text-white">{user?.name || authUser?.name}</h2>
            <p className="font-body text-xs sm:text-compact text-silver-mist">{user?.email || authUser?.email}</p>
            <div className="flex gap-2 mt-2 sm:mt-3">
              <Badge variant={user?.role as 'admin' | 'manager' | 'user' || authUser?.role as 'admin' | 'manager' | 'user'}>
                {user?.role || authUser?.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-silver-mist p-4 sm:p-6">
        <h3 className="font-display text-sm sm:text-body text-white uppercase mb-4 sm:mb-6">Profile Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-silver-mist/30">
            <span className="font-mono text-micro sm:text-caption uppercase tracking-widest text-silver-mist">Email</span>
            <span className="font-body text-sm sm:text-body text-white">{user?.email || authUser?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-silver-mist/30">
            <span className="font-mono text-micro sm:text-caption uppercase tracking-widest text-silver-mist">Role</span>
            <span className="font-body text-sm sm:text-body text-white capitalize">{user?.role || authUser?.role}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-mono text-micro sm:text-caption uppercase tracking-widest text-silver-mist">Member Since</span>
            <span className="font-body text-sm sm:text-body text-white">
              {user?.createdAt ? formatDate(user.createdAt) : user?.created_at ? formatDate(user.created_at) : '-'}
            </span>
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          <Link to="/profile">
            <Button variant="secondary" className="w-full sm:w-auto">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
