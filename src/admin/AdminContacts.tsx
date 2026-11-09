/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Contacts Page
 * Features:
 * - Table: Date & Time (IST), Name, Company, Email, Phone, Subject, Status, Read/Unread
 * - Search by name, company, email, phone, subject
 * - Filters: Date range, status, read/unread
 * - Sortable columns & pagination (25 per page)
 * - Row checkboxes with select-all
 * - Export dropdown: CSV (UTF-8 BOM), Excel (.xlsx), PDF
 * - Detail drawer: full message, status dropdown, admin notes with save, "Reply via Email" mailto, delete modal
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  X, 
  Trash2, 
  Mail, 
  Check, 
  Save, 
  Eye, 
  EyeOff,
  ChevronDown,
  CheckSquare,
  Square,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import type { ContactMessage, ContactStatus } from './types.ts';
import { fetchAllContacts, updateContactMessage, deleteContactMessage } from './firebase.ts';
import { 
  formatISTDateTime, 
  exportContactsToCSV, 
  exportContactsToExcel, 
  exportContactsToPDF 
} from './AdminExportUtils.ts';

const PAGE_SIZE = 25;

export const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'createdAt' | 'name' | 'company' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer detail view
  const [activeContact, setActiveContact] = useState<ContactMessage[] | any>(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<ContactStatus>('New');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Delete modal confirmation
  const [deleteModalContact, setDeleteModalContact] = useState<ContactMessage | null>(null);

  // Export dropdown
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const loadContacts = async () => {
    try {
      const data = await fetchAllContacts();
      setContacts(data);
    } catch (err) {
      console.warn('Load contacts err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    window.addEventListener('achse-storage-update', loadContacts);
    return () => window.removeEventListener('achse-storage-update', loadContacts);
  }, []);

  // Filtered & sorted messages
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      if (readFilter === 'unread' && c.isRead) return false;
      if (readFilter === 'read' && !c.isRead) return false;

      if (startDate) {
        const startMillis = new Date(startDate).setHours(0, 0, 0, 0);
        if (c.createdAt < startMillis) return false;
      }
      if (endDate) {
        const endMillis = new Date(endDate).setHours(23, 59, 59, 999);
        if (c.createdAt > endMillis) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [contacts, searchQuery, statusFilter, readFilter, startDate, endDate, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredContacts.slice(start, start + PAGE_SIZE);
  }, [filteredContacts, currentPage]);

  const handleOpenDetail = async (c: ContactMessage) => {
    setActiveContact(c);
    setDrawerNotes(c.adminNotes || '');
    setDrawerStatus(c.status);
    setSavedSuccess(false);

    if (!c.isRead) {
      await updateContactMessage(c.id, { isRead: true });
      setActiveContact({ ...c, isRead: true });
      setContacts((prev) => prev.map((item) => (item.id === c.id ? { ...item, isRead: true } : item)));
    }
  };

  const handleSaveDetailUpdates = async () => {
    if (!activeContact) return;
    setSavingNotes(true);
    await updateContactMessage(activeContact.id, {
      adminNotes: drawerNotes,
      status: drawerStatus,
    });
    setSavingNotes(false);
    setSavedSuccess(true);
    setActiveContact({ ...activeContact, adminNotes: drawerNotes, status: drawerStatus });
    setContacts((prev) =>
      prev.map((item) =>
        item.id === activeContact.id ? { ...item, adminNotes: drawerNotes, status: drawerStatus } : item
      )
    );
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleReadStatus = async (c: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = !c.isRead;
    await updateContactMessage(c.id, { isRead: updated });
    setContacts((prev) => prev.map((item) => (item.id === c.id ? { ...item, isRead: updated } : item)));
    if (activeContact && activeContact.id === c.id) {
      setActiveContact({ ...activeContact, isRead: updated });
    }
  };

  const confirmDeleteContact = async () => {
    if (!deleteModalContact) return;
    await deleteContactMessage(deleteModalContact.id);
    setContacts((prev) => prev.filter((item) => item.id !== deleteModalContact.id));
    if (activeContact?.id === deleteModalContact.id) {
      setActiveContact(null);
    }
    setDeleteModalContact(null);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedContacts.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSelectedContacts = () => contacts.filter((c) => selectedIds.includes(c.id));

  const triggerExport = (format: 'csv' | 'xlsx' | 'pdf', scope: 'all' | 'filtered' | 'selected') => {
    let targetData: ContactMessage[] = [];
    if (scope === 'all') targetData = contacts;
    else if (scope === 'filtered') targetData = filteredContacts;
    else targetData = getSelectedContacts();

    if (targetData.length === 0) {
      alert('No messages to export.');
      return;
    }

    if (format === 'csv') exportContactsToCSV(targetData);
    else if (format === 'xlsx') exportContactsToExcel(targetData);
    else exportContactsToPDF(targetData);

    setExportMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, company, email, subject..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#0F2A4A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-spec text-slate-500 hidden sm:inline">
              Showing <strong>{filteredContacts.length}</strong> of {contacts.length} Messages
            </span>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Export</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-2 divide-y divide-slate-100 text-xs">
                  <div className="py-1">
                    <div className="px-3 py-1 font-mono-spec uppercase text-[10px] text-slate-400 font-bold">
                      CSV (Excel UTF-8 BOM)
                    </div>
                    <button
                      onClick={() => triggerExport('csv', 'all')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export All ({contacts.length})
                    </button>
                    <button
                      onClick={() => triggerExport('csv', 'filtered')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export Filtered ({filteredContacts.length})
                    </button>
                    {selectedIds.length > 0 && (
                      <button
                        onClick={() => triggerExport('csv', 'selected')}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-amber-700 font-semibold"
                      >
                        Export Selected ({selectedIds.length})
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 font-mono-spec uppercase text-[10px] text-slate-400 font-bold">
                      Excel Spreadsheet (.xlsx)
                    </div>
                    <button
                      onClick={() => triggerExport('xlsx', 'all')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export All (.xlsx)
                    </button>
                    <button
                      onClick={() => triggerExport('xlsx', 'filtered')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export Filtered (.xlsx)
                    </button>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 font-mono-spec uppercase text-[10px] text-slate-400 font-bold">
                      PDF Document
                    </div>
                    <button
                      onClick={() => triggerExport('pdf', 'all')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export All (PDF)
                    </button>
                    <button
                      onClick={() => triggerExport('pdf', 'filtered')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      Export Filtered (PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-semibold mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-semibold mb-1">
              Read State
            </label>
            <select
              value={readFilter}
              onChange={(e) => {
                setReadFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-semibold mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-semibold mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setReadFilter('all');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-3 rounded text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <div className="animate-spin w-6 h-6 border-2 border-[#0F2A4A] border-t-transparent rounded-full mx-auto" />
            <p>Loading contact messages...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Messages Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No contact desk inquiries match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-[#0F2A4A] text-white">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      <button
                        onClick={handleSelectAll}
                        className="text-slate-300 hover:text-white"
                        aria-label="Select all rows"
                      >
                        {selectedIds.length === paginatedContacts.length && paginatedContacts.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th 
                      onClick={() => {
                        setSortField('createdAt');
                        setSortAsc(!sortAsc);
                      }}
                      className="p-3.5 font-mono-spec uppercase font-bold tracking-wider cursor-pointer hover:bg-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Date & Time (IST)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => {
                        setSortField('name');
                        setSortAsc(!sortAsc);
                      }}
                      className="p-3.5 font-mono-spec uppercase font-bold tracking-wider cursor-pointer hover:bg-white/5"
                    >
                      <span>Sender & Company</span>
                    </th>
                    <th className="p-3.5 font-mono-spec uppercase font-bold tracking-wider">
                      <span>Contact Details</span>
                    </th>
                    <th className="p-3.5 font-mono-spec uppercase font-bold tracking-wider">
                      <span>Subject</span>
                    </th>
                    <th 
                      onClick={() => {
                        setSortField('status');
                        setSortAsc(!sortAsc);
                      }}
                      className="p-3.5 font-mono-spec uppercase font-bold tracking-wider cursor-pointer hover:bg-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-3.5 font-mono-spec uppercase font-bold tracking-wider text-right">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedContacts.map((c) => {
                    const isSelected = selectedIds.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => handleOpenDetail(c)}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                          !c.isRead ? 'bg-amber-50/20 font-medium' : ''
                        } ${isSelected ? 'bg-blue-50/70' : ''}`}
                      >
                        <td className="p-3.5 text-center" onClick={(e) => handleToggleSelect(c.id, e)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0F2A4A] inline" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-600 inline" />
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap text-slate-600 font-mono-spec text-[11px]">
                          <div className="flex items-center gap-2">
                            {!c.isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            )}
                            <span>{formatISTDateTime(c.createdAt)}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">{c.name}</div>
                          <div className="text-slate-500 text-[11px] truncate max-w-[180px]">{c.company}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-slate-800 font-mono-spec text-[11px] truncate max-w-[170px]">{c.email}</div>
                          <div className="text-slate-500 font-mono-spec text-[11px]">{c.phone}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-slate-800 font-medium truncate max-w-[220px]">{c.subject}</div>
                          <div className="text-slate-500 text-[11px] truncate max-w-[220px]">{c.message}</div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                              c.status === 'New'
                                ? 'bg-blue-100 text-blue-800'
                                : c.status === 'Replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleToggleReadStatus(c, e)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title={c.isRead ? 'Mark unread' : 'Mark read'}
                            >
                              {c.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setDeleteModalContact(c)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="lg:hidden divide-y divide-slate-100 p-3 space-y-3">
              {paginatedContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpenDetail(c)}
                  className={`p-4 rounded-xl border border-slate-200 bg-white space-y-3 cursor-pointer shadow-xs ${
                    !c.isRead ? 'border-l-4 border-l-amber-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-spec text-slate-500">
                      {formatISTDateTime(c.createdAt)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : c.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-xs text-slate-600">{c.company}</div>
                    <div className="text-xs text-slate-500 font-mono-spec mt-0.5">
                      {c.phone} • {c.email}
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div className="font-semibold text-slate-900">{c.subject}</div>
                    <div className="truncate text-slate-500 mt-0.5">{c.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono-spec">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredContacts.length} Messages)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Side Drawer Detail View */}
      {activeContact && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveContact(null)}
          />

          <div className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col overflow-hidden z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-5 bg-[#0F2A4A] text-white flex items-center justify-between shrink-0">
              <div>
                <span className="font-mono-spec text-amber-400 font-bold text-xs uppercase tracking-wider">
                  Contact Desk Message
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeContact.subject}</h3>
                <p className="text-[11px] text-slate-300 font-mono-spec">
                  Received: {formatISTDateTime(activeContact.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setActiveContact(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
              {/* Quick Actions */}
              <div className="flex items-center gap-2.5">
                <a
                  href={`mailto:${activeContact.email}?subject=${encodeURIComponent(
                    `Re: ${activeContact.subject} — ACHSE LLP Pune Desk`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F2A4A] text-white hover:bg-[#1E3A5F] font-semibold"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reply via Email</span>
                </a>
              </div>

              {/* Sender Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Sender Name</span>
                    <strong className="text-slate-900 text-sm">{activeContact.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Company</span>
                    <strong className="text-slate-900 text-sm">{activeContact.company}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Email</span>
                    <span className="font-mono-spec text-slate-700 select-all">{activeContact.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Phone</span>
                    <span className="font-mono-spec text-slate-700 select-all">{activeContact.phone}</span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-spec uppercase text-slate-500 font-bold tracking-wider">
                  Full Inquiry Text
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {activeContact.message}
                </div>
              </div>

              {/* Status and Notes */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-bold mb-1.5">
                    Desk Inquiry Status
                  </label>
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value as ContactStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-bold mb-1.5">
                    Internal Follow-Up Notes
                  </label>
                  <textarea
                    rows={4}
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Record call logs, actions taken, or team assignees..."
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-hidden focus:border-[#0F2A4A]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleReadStatus(activeContact)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {activeContact.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDetailUpdates}
                    disabled={savingNotes}
                    className="px-5 py-2 rounded-lg bg-[#0F2A4A] hover:bg-[#1E3A5F] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>{savingNotes ? 'Saving...' : 'Save Updates'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete message from <strong>{deleteModalContact.name}</strong> ({deleteModalContact.company})?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalContact(null)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteContact}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
