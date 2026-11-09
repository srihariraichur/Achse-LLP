/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Layout
 * Responsive sidebar navigation and top bar:
 * - Left sidebar (collapses to mobile drawer)
 * - Navigation links: Dashboard, RFQs (with unread badge), Contact Messages (with unread badge)
 * - Top bar with administrator email, live clock (IST), and quick site return
 * - Logout button with session termination
 */

import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo.tsx';
import { useAdminAuth } from './AdminAuthContext.tsx';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Clock,
  BellRing
} from 'lucide-react';
import { getLocalRFQs, getLocalContacts } from './firebase.ts';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'rfqs' | 'contacts';
  setCurrentTab: (tab: 'dashboard' | 'rfqs' | 'contacts') => void;
  onReturnToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onReturnToSite,
  children,
}) => {
  const { currentUser, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ rfqs: 0, contacts: 0 });
  const [istTime, setIstTime] = useState('');

  // Update live IST time in topbar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setIstTime(`${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update badges
  const refreshBadges = () => {
    const rfqs = getLocalRFQs();
    const contacts = getLocalContacts();
    setUnreadCounts({
      rfqs: rfqs.filter((r) => !r.isRead).length,
      contacts: contacts.filter((c) => !c.isRead).length,
    });
  };

  useEffect(() => {
    refreshBadges();
    window.addEventListener('achse-storage-update', refreshBadges);
    return () => window.removeEventListener('achse-storage-update', refreshBadges);
  }, []);

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'rfqs' as const,
      label: 'RFQs & Drawings',
      icon: FileText,
      badge: unreadCounts.rfqs,
    },
    {
      id: 'contacts' as const,
      label: 'Contact Messages',
      icon: Mail,
      badge: unreadCounts.contacts,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800 antialiased">
      {/* Mobile Top App Bar */}
      <div className="md:hidden bg-[#0F2A4A] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700/60 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-200 hover:text-white rounded"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm tracking-wider">ACHSE ADMIN</span>
        </div>

        <div className="flex items-center gap-2">
          {(unreadCounts.rfqs > 0 || unreadCounts.contacts > 0) && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          )}
          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-300 hover:text-white text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0A1D33] text-white border-r border-slate-800 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono-spec uppercase text-amber-400 font-semibold tracking-wider">
                Admin Console
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <Logo variant="dark" showTagline={false} />
            </div>

            <nav className="mt-4 space-y-1.5 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white shadow-xs border-l-4 border-amber-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono-spec">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={onReturnToSite}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>View Public Site</span>
              </button>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A1D33] text-white border-r border-slate-800/80 shrink-0">
        {/* Brand identity header */}
        <div className="p-5 border-b border-white/10 bg-[#071526]">
          <Logo variant="dark" showTagline={false} />
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono-spec text-slate-400">
            <span className="text-amber-400 font-semibold uppercase tracking-wider">Admin Portal</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">v2.0</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          <div className="px-3 pb-2 text-[10px] font-mono-spec uppercase tracking-wider text-slate-400 font-semibold">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A5F] text-white shadow-xs border-l-4 border-amber-400 pl-2.5'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono-spec">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System & Session Footer */}
        <div className="p-4 border-t border-white/10 bg-[#071526]/70 space-y-3">
          <div className="flex items-center gap-2.5 px-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                {currentUser?.email || 'admin@achse.in'}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Authorized Admin</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <button
              onClick={onReturnToSite}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Public Website</span>
              </span>
              <span className="text-[10px] text-slate-500">Live</span>
            </button>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-[#0F2A4A] tracking-tight">
              {currentTab === 'dashboard' && 'Operations Dashboard'}
              {currentTab === 'rfqs' && 'RFQ & Engineering Drawing Submissions'}
              {currentTab === 'contacts' && 'Contact Desk Messages'}
            </h1>
          </div>

          {/* Topbar Right Actions */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 font-mono-spec text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{istTime}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-600 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured RBAC Session</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                {currentUser?.email}
              </span>
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
