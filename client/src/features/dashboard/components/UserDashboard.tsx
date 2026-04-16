import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { Button } from '../../../shared/components/ui/Button';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-display text-white mb-3">
          WELCOME
        </h1>
        <p className="font-body text-body text-silver-mist">
          Here's your account overview
        </p>
      </div>

      <div className="border border-silver-mist p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || ''} size="lg" />
          <div>
            <h2 className="font-display text-body text-white">{user?.name}</h2>
            <p className="font-body text-compact text-silver-mist">{user?.email}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant={user?.role as 'admin' | 'manager' | 'user'}>
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-silver-mist p-6">
        <h3 className="font-display text-body text-white uppercase mb-6">Profile Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-silver-mist/30">
            <span className="font-mono text-caption uppercase tracking-widest text-silver-mist">Email</span>
            <span className="font-body text-body text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-silver-mist/30">
            <span className="font-mono text-caption uppercase tracking-widest text-silver-mist">Role</span>
            <span className="font-body text-body text-white capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-mono text-caption uppercase tracking-widest text-silver-mist">Member Since</span>
            <span className="font-body text-body text-white">-</span>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/profile">
            <Button variant="secondary">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
