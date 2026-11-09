/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Portal Module Root
 * Ties together AdminAuthProvider, AdminLogin, AdminLayout, Dashboard, RFQs, and Contacts
 */

import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext.tsx';
import { AdminLogin } from './AdminLogin.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { AdminDashboard } from './AdminDashboard.tsx';
import { AdminRFQs } from './AdminRFQs.tsx';
import { AdminContacts } from './AdminContacts.tsx';

interface AdminPortalProps {
  initialSubRoute?: string; // 'login' | 'dashboard' | 'rfqs' | 'contacts'
  onReturnToSite: () => void;
}

const AdminPortalContent: React.FC<AdminPortalProps> = ({
  initialSubRoute = 'dashboard',
  onReturnToSite,
}) => {
  const { currentUser, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rfqs' | 'contacts'>('dashboard');

  useEffect(() => {
    if (initialSubRoute === 'rfqs') {
      setActiveTab('rfqs');
    } else if (initialSubRoute === 'contacts') {
      setActiveTab('contacts');
    } else {
      setActiveTab('dashboard');
    }
  }, [initialSubRoute]);

  // Sync route changes to hash for direct bookmarking
  const handleTabChange = (tab: 'dashboard' | 'rfqs' | 'contacts') => {
    setActiveTab(tab);
    window.location.hash = `admin/${tab}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F2A4A] flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full" />
        <span className="text-xs font-mono-spec tracking-widest uppercase text-slate-300">
          Loading ACHSE Admin Portal...
        </span>
      </div>
    );
  }

  // If unauthenticated or forced to login route, show Login page
  if (!currentUser || initialSubRoute === 'login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          window.location.hash = 'admin/dashboard';
          setActiveTab('dashboard');
        }}
        onReturnToSite={onReturnToSite}
      />
    );
  }

  return (
    <AdminLayout
      currentTab={activeTab}
      setCurrentTab={handleTabChange}
      onReturnToSite={onReturnToSite}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard onNavigateTab={handleTabChange} />
      )}
      {activeTab === 'rfqs' && <AdminRFQs />}
      {activeTab === 'contacts' && <AdminContacts />}
    </AdminLayout>
  );
};

export const AdminPortal: React.FC<AdminPortalProps> = (props) => {
  return (
    <AdminAuthProvider>
      <AdminPortalContent {...props} />
    </AdminAuthProvider>
  );
};
