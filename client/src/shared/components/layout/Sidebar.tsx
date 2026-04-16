import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      roles: ['admin', 'manager', 'user'],
    },
    {
      to: '/profile',
      label: 'My Profile',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      roles: ['admin', 'manager', 'user'],
    },
    {
      to: '/users',
      label: 'User Management',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      roles: ['admin', 'manager'],
      adminOnly: true,
    },
  ];

  const filteredLinks = navLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-velvet-black border-r border-silver-mist transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-silver-mist/30">
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-display text-lg">PM</span>
            </div>
            <div>
              <h1 className="font-display text-body text-white tracking-wide">PURPLE MERIT</h1>
              <p className="text-xs text-silver-mist font-mono uppercase tracking-widest">Management</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-mono uppercase tracking-widest transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {link.icon}
                <span className="flex-1">{link.label}</span>
                {link.adminOnly && (
                  <Badge variant="admin" size="sm">
                    Admin
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {user && (
            <div className="px-4 py-4 border-t border-silver-mist/30">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-white truncate">
                    {user.name}
                  </p>
                  <Badge variant={user.role as 'admin' | 'manager' | 'user'} size="sm">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
