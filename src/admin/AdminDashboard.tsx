/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Dashboard Home
 * Displays:
 * 1. Metric Summary Cards: Total RFQs, New RFQs, Total Contacts, Unread Messages, Submissions last 7d / 30d
 * 2. 30-Day Submissions Activity Chart (SVG Bar & Trend in brand colours)
 * 3. Latest 5 RFQs with status badges and "View all" link
 * 4. Latest 5 Contact Messages with "View all" link
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { RFQ, ContactMessage } from './types.ts';
import { fetchAllRFQs, fetchAllContacts } from './firebase.ts';
import { formatISTDateTime } from './AdminExportUtils.ts';

interface AdminDashboardProps {
  onNavigateTab: (tab: 'rfqs' | 'contacts') => void;
  onOpenRFQDetail?: (rfq: RFQ) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
}) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [rfqList, contactList] = await Promise.all([
        fetchAllRFQs(),
        fetchAllContacts(),
      ]);
      setRfqs(rfqList);
      setContacts(contactList);
    } catch (err) {
      console.warn('Dashboard load note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('achse-storage-update', loadData);
    return () => window.removeEventListener('achse-storage-update', loadData);
  }, []);

  // Compute metrics
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 3600 * 1000;

  const totalRFQs = rfqs.length;
  const newRFQs = rfqs.filter((r) => r.status === 'New').length;
  const totalContacts = contacts.length;
  const unreadContacts = contacts.filter((c) => !c.isRead).length;

  const submissions7d = 
    rfqs.filter((r) => r.createdAt >= sevenDaysAgo).length +
    contacts.filter((c) => c.createdAt >= sevenDaysAgo).length;

  const submissions30d = 
    rfqs.filter((r) => r.createdAt >= thirtyDaysAgo).length +
    contacts.filter((c) => c.createdAt >= thirtyDaysAgo).length;

  // Compute 30-day submissions daily breakdown for SVG chart
  const dailyData: { label: string; count: number; dateStr: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const dayStart = new Date(now - i * 24 * 3600 * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);

    const count = 
      rfqs.filter((r) => r.createdAt >= dayStart.getTime() && r.createdAt < dayEnd.getTime()).length +
      contacts.filter((c) => c.createdAt >= dayStart.getTime() && c.createdAt < dayEnd.getTime()).length;

    const label = `${dayStart.getDate()}/${dayStart.getMonth() + 1}`;
    dailyData.push({ label, count, dateStr: dayStart.toLocaleDateString() });
  }

  const maxDailyCount = Math.max(1, ...dailyData.map((d) => d.count));

  // Latest 5 items
  const latestRFQs = [...rfqs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const latestContacts = [...contacts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-lg" />
          <div className="h-80 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total RFQs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
              Total RFQs
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F2A4A] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0F2A4A] tracking-tight">{totalRFQs}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              {newRFQs} new
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total quotations requested to date</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F2A4A]" />
        </div>

        {/* New Unhandled RFQs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
              Pending Action
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tracking-tight">{newRFQs}</span>
            <span className="text-xs text-slate-500">unreviewed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires drawing feasibility review</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* Total Contact Messages */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
              Contact Desk
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0F2A4A] tracking-tight">{totalContacts}</span>
            <span className="text-xs font-medium text-amber-600">
              {unreadContacts} unread
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">General inquiries & supplier audits</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700" />
        </div>

        {/* Inflow Rate (7d / 30d) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
              Velocity
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">{submissions7d}</span>
            <span className="text-xs text-slate-500">last 7d / {submissions30d} (30d)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Customer inquiry cadence</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
        </div>
      </div>

      {/* 30-Day Submissions Activity Chart in Brand Colours */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] font-mono-spec uppercase tracking-wider text-amber-700 font-semibold">
              Inquiry Cadence
            </span>
            <h2 className="text-base font-bold text-[#0F2A4A]">
              Daily Submissions (Past 30 Days)
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#0F2A4A]" />
              <span>RFQ & Drawing Submissions</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span>Contact Inquiries</span>
            </span>
          </div>
        </div>

        {/* Responsive Bar Chart View */}
        <div className="h-44 flex items-end gap-1 sm:gap-2 pt-6 border-b border-slate-100 pb-2">
          {dailyData.map((day, idx) => {
            const heightPercent = Math.max(8, (day.count / maxDailyCount) * 100);
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                  {day.dateStr}: <strong>{day.count} inquiry</strong>
                </div>

                {/* Visual Bar */}
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xs transition-all duration-300 ${
                    day.count > 0 
                      ? 'bg-gradient-to-t from-[#0F2A4A] to-[#1E3A5F] group-hover:from-amber-600 group-hover:to-amber-500' 
                      : 'bg-slate-100'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono-spec text-slate-400 mt-2">
          <span>30 Days Ago</span>
          <span>15 Days Ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Two-Column Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest RFQs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
                Recent RFQs
              </span>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Latest 5 Quotations</h3>
            </div>
            <button
              onClick={() => onNavigateTab('rfqs')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
            >
              <span>View all ({totalRFQs})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestRFQs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No RFQs submitted yet. Test by submitting one through the public site!
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {latestRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  onClick={() => onNavigateTab('rfqs')}
                  className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-spec font-bold text-[#0F2A4A]">
                        {rfq.rfqNumber}
                      </span>
                      {!rfq.isRead && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          NEW
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        rfq.status === 'New' ? 'bg-blue-50 text-blue-700' :
                        rfq.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                        rfq.status === 'Quoted' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 truncate">
                      {rfq.name} • <span className="text-slate-600 font-normal">{rfq.company}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {rfq.productCategory} • {rfq.attachmentUrls.length} drawing(s)
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono-spec text-slate-400">
                      {formatISTDateTime(rfq.createdAt).split(' ')[0]}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Contact Desk Messages */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <span className="text-[11px] font-mono-spec uppercase text-slate-500 font-semibold tracking-wider">
                Contact Desk
              </span>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Latest 5 Inquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('contacts')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
            >
              <span>View all ({totalContacts})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestContacts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No contact desk messages received yet.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {latestContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => onNavigateTab('contacts')}
                  className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 truncate">
                        {contact.name}
                      </span>
                      {!contact.isRead && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          UNREAD
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        contact.status === 'New' ? 'bg-blue-50 text-blue-700' :
                        contact.status === 'Replied' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {contact.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 truncate font-medium">
                      {contact.subject}
                    </div>

                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {contact.company} • {contact.email}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono-spec text-slate-400">
                      {formatISTDateTime(contact.createdAt).split(' ')[0]}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
