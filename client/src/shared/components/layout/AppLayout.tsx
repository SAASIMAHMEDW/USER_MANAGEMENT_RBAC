import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-velvet-black">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
