/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin RFQs Page
 * Features:
 * - Table: RFQ No., Date & Time, Name, Company, Email, Phone, Product Category, Status, Read/Unread
 * - Search by name, company, email, phone, or RFQ number
 * - Filters: Date range, product category, status, read/unread
 * - Sortable columns & pagination (25 per page)
 * - Row checkboxes with select-all for targeted export
 * - Export dropdown: CSV, Excel (.xlsx), PDF ("Export all", "Export filtered", "Export selected")
 * - Detail view (drawer): full message, download/preview drawings, status dropdown, admin notes with save button,
 *   "Reply via Email" (mailto with RFQ no.), "WhatsApp" (wa.me link), "Mark as read/unread", "Delete" (modal),
 *   "Download this RFQ as PDF", and "Download all attachments" (ZIP).
 * - Opening a new RFQ automatically marks it as read.
 * - Responsive: cards on mobile view.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  CheckSquare, 
  Square, 
  X, 
  Trash2, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Save, 
  Check, 
  Clock, 
  Eye, 
  EyeOff,
  ChevronDown,
  Archive,
  AlertTriangle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import type { RFQ, RFQStatus, RFQFilterOptions } from './types.ts';
import { fetchAllRFQs, updateRFQ, deleteRFQ } from './firebase.ts';
import { 
  formatISTDateTime, 
  exportRFQsToCSV, 
  exportRFQsToExcel, 
  exportRFQsToPDF,
  downloadSingleRfqPDF,
  downloadAllAttachmentsAsZip
} from './AdminExportUtils.ts';

const PAGE_SIZE = 25;

export const AdminRFQs: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'createdAt' | 'rfqNumber' | 'name' | 'company' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer Detail view
  const [activeRFQ, setActiveRFQ] = useState<RFQ | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<RFQStatus>('New');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Delete modal confirmation
  const [deleteModalRFQ, setDeleteModalRFQ] = useState<RFQ | null>(null);

  // Export menu toggle
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const loadRFQs = async () => {
    try {
      const data = await fetchAllRFQs();
      setRfqs(data);
    } catch (err) {
      console.warn('Load RFQs err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFQs();
    window.addEventListener('achse-storage-update', loadRFQs);
    return () => window.removeEventListener('achse-storage-update', loadRFQs);
  }, []);

  // Filter & Search Logic
  const filteredRFQs = useMemo(() => {
    return rfqs.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          r.rfqNumber.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          (r.productName && r.productName.toLowerCase().includes(q)) ||
          r.productCategory.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && r.productCategory !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }

      // Read filter
      if (readFilter === 'unread' && r.isRead) return false;
      if (readFilter === 'read' && !r.isRead) return false;

      // Date range filter
      if (startDate) {
        const startMillis = new Date(startDate).setHours(0, 0, 0, 0);
        if (r.createdAt < startMillis) return false;
      }
      if (endDate) {
        const endMillis = new Date(endDate).setHours(23, 59, 59, 999);
        if (r.createdAt > endMillis) return false;
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
  }, [rfqs, searchQuery, categoryFilter, statusFilter, readFilter, startDate, endDate, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRFQs.length / PAGE_SIZE));
  const paginatedRFQs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRFQs.slice(start, start + PAGE_SIZE);
  }, [filteredRFQs, currentPage]);

  // Open Drawer and auto-mark as read
  const handleOpenDetail = async (rfq: RFQ) => {
    setActiveRFQ(rfq);
    setDrawerNotes(rfq.adminNotes || '');
    setDrawerStatus(rfq.status);
    setSavedSuccess(false);

    if (!rfq.isRead) {
      await updateRFQ(rfq.id, { isRead: true });
      setActiveRFQ({ ...rfq, isRead: true });
      setRfqs((prev) => prev.map((item) => (item.id === rfq.id ? { ...item, isRead: true } : item)));
    }
  };

  const handleSaveDetailUpdates = async () => {
    if (!activeRFQ) return;
    setSavingNotes(true);
    await updateRFQ(activeRFQ.id, {
      adminNotes: drawerNotes,
      status: drawerStatus,
    });
    setSavingNotes(false);
    setSavedSuccess(true);
    setActiveRFQ({ ...activeRFQ, adminNotes: drawerNotes, status: drawerStatus });
    setRfqs((prev) =>
      prev.map((item) =>
        item.id === activeRFQ.id ? { ...item, adminNotes: drawerNotes, status: drawerStatus } : item
      )
    );
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleReadStatus = async (rfq: RFQ, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = !rfq.isRead;
    await updateRFQ(rfq.id, { isRead: updated });
    setRfqs((prev) => prev.map((item) => (item.id === rfq.id ? { ...item, isRead: updated } : item)));
    if (activeRFQ && activeRFQ.id === rfq.id) {
      setActiveRFQ({ ...activeRFQ, isRead: updated });
    }
  };

  const confirmDeleteRFQ = async () => {
    if (!deleteModalRFQ) return;
    await deleteRFQ(deleteModalRFQ.id);
    setRfqs((prev) => prev.filter((r) => r.id !== deleteModalRFQ.id));
    if (activeRFQ?.id === deleteModalRFQ.id) {
      setActiveRFQ(null);
    }
    setDeleteModalRFQ(null);
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRFQs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRFQs.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export handlers
  const getSelectedRFQs = () => rfqs.filter((r) => selectedIds.includes(r.id));

  const triggerExport = (format: 'csv' | 'xlsx' | 'pdf', scope: 'all' | 'filtered' | 'selected') => {
    let targetData: RFQ[] = [];
    if (scope === 'all') targetData = rfqs;
    else if (scope === 'filtered') targetData = filteredRFQs;
    else targetData = getSelectedRFQs();

    if (targetData.length === 0) {
      alert('No rows selected for export.');
      return;
    }

    if (format === 'csv') exportRFQsToCSV(targetData);
    else if (format === 'xlsx') exportRFQsToExcel(targetData);
    else exportRFQsToPDF(targetData);

    setExportMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
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
              placeholder="Search by RFQ No, Name, Company, Email, Phone..."
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

          {/* Action Row: Export & Stats */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-spec text-slate-500 hidden sm:inline">
              Showing <strong>{filteredRFQs.length}</strong> of {rfqs.length} RFQs
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
                  {/* CSV Options */}
                  <div className="py-1">
                    <div className="px-3 py-1 font-mono-spec uppercase text-[10px] text-slate-400 font-bold">
                      CSV (Excel UTF-8 BOM)
                    </div>
                    <button
                      onClick={() => triggerExport('csv', 'all')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                    >
                      <span>Export All ({rfqs.length})</span>
                    </button>
                    <button
                      onClick={() => triggerExport('csv', 'filtered')}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                    >
                      <span>Export Filtered ({filteredRFQs.length})</span>
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

                  {/* Excel (.xlsx) Options */}
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
                    {selectedIds.length > 0 && (
                      <button
                        onClick={() => triggerExport('xlsx', 'selected')}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-amber-700 font-semibold"
                      >
                        Export Selected (.xlsx)
                      </button>
                    )}
                  </div>

                  {/* PDF Document Options */}
                  <div className="py-1">
                    <div className="px-3 py-1 font-mono-spec uppercase text-[10px] text-slate-400 font-bold">
                      PDF Table Document
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
                    {selectedIds.length > 0 && (
                      <button
                        onClick={() => triggerExport('pdf', 'selected')}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-amber-700 font-semibold"
                      >
                        Export Selected (PDF)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Toolbar: Category, Status, Read/Unread, Date Range */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-semibold mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Cold Forging Dies">Cold Forging Dies</option>
              <option value="Gauges">Gauges</option>
              <option value="Fasteners">Fasteners</option>
              <option value="CNC Machined Parts">CNC Machined Parts</option>
              <option value="Special Tools">Special Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
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
              <option value="In Progress">In Progress</option>
              <option value="Quoted">Quoted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Read / Unread */}
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

          {/* Start Date */}
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

          {/* End Date */}
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

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setReadFilter('all');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-3 rounded text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <div className="animate-spin w-6 h-6 border-2 border-[#0F2A4A] border-t-transparent rounded-full mx-auto" />
            <p>Loading quotation inquiries...</p>
          </div>
        ) : filteredRFQs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No RFQs Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No quotation requests match the current search filters. Try adjusting your query or resetting filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
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
                        {selectedIds.length === paginatedRFQs.length && paginatedRFQs.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th 
                      onClick={() => {
                        setSortField('rfqNumber');
                        setSortAsc(!sortAsc);
                      }}
                      className="p-3.5 font-mono-spec uppercase font-bold tracking-wider cursor-pointer hover:bg-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>RFQ No.</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
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
                      <span>Name & Company</span>
                    </th>
                    <th className="p-3.5 font-mono-spec uppercase font-bold tracking-wider">
                      <span>Contact Info</span>
                    </th>
                    <th className="p-3.5 font-mono-spec uppercase font-bold tracking-wider">
                      <span>Category</span>
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
                  {paginatedRFQs.map((rfq) => {
                    const isSelected = selectedIds.includes(rfq.id);
                    return (
                      <tr
                        key={rfq.id}
                        onClick={() => handleOpenDetail(rfq)}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                          !rfq.isRead ? 'bg-amber-50/20 font-medium' : ''
                        } ${isSelected ? 'bg-blue-50/70' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="p-3.5 text-center" onClick={(e) => handleToggleSelect(rfq.id, e)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0F2A4A] inline" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-600 inline" />
                          )}
                        </td>

                        {/* RFQ Number & Read indicator */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {!rfq.isRead && (
                              <span 
                                className="w-2 h-2 rounded-full bg-amber-500 shrink-0" 
                                title="Unread RFQ"
                              />
                            )}
                            <span className="font-mono-spec font-bold text-[#0F2A4A]">
                              {rfq.rfqNumber}
                            </span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="p-3.5 whitespace-nowrap text-slate-600 font-mono-spec text-[11px]">
                          {formatISTDateTime(rfq.createdAt)}
                        </td>

                        {/* Name & Company */}
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">{rfq.name}</div>
                          <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                            {rfq.company}
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="p-3.5">
                          <div className="text-slate-800 font-mono-spec text-[11px] truncate max-w-[170px]">
                            {rfq.email}
                          </div>
                          <div className="text-slate-500 font-mono-spec text-[11px]">
                            {rfq.phone}
                          </div>
                        </td>

                        {/* Product Category & Attachment count */}
                        <td className="p-3.5">
                          <div className="text-slate-800 font-medium">{rfq.productCategory}</div>
                          {rfq.attachmentUrls.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                              <Archive className="w-3 h-3" />
                              <span>{rfq.attachmentUrls.length} Drawing(s)</span>
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                              rfq.status === 'New'
                                ? 'bg-blue-100 text-blue-800'
                                : rfq.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-800'
                                : rfq.status === 'Quoted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rfq.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleToggleReadStatus(rfq, e)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title={rfq.isRead ? 'Mark as unread' : 'Mark as read'}
                            >
                              {rfq.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setDeleteModalRFQ(rfq)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete RFQ"
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

            {/* Mobile Stacked Card View */}
            <div className="lg:hidden divide-y divide-slate-100 p-3 space-y-3">
              {paginatedRFQs.map((rfq) => {
                const isSelected = selectedIds.includes(rfq.id);
                return (
                  <div
                    key={rfq.id}
                    onClick={() => handleOpenDetail(rfq)}
                    className={`p-4 rounded-xl border border-slate-200 bg-white space-y-3 cursor-pointer shadow-xs ${
                      !rfq.isRead ? 'border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-spec font-bold text-sm text-[#0F2A4A]">
                          {rfq.rfqNumber}
                        </span>
                        {!rfq.isRead && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                            NEW
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          rfq.status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : rfq.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : rfq.status === 'Quoted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">{rfq.name}</div>
                      <div className="text-xs text-slate-600 font-medium">{rfq.company}</div>
                      <div className="text-xs text-slate-500 font-mono-spec mt-0.5">
                        {rfq.phone} • {rfq.email}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <div className="font-semibold text-slate-800">{rfq.productCategory}</div>
                      <div className="truncate text-slate-500 mt-0.5">{rfq.message}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono-spec text-slate-400 pt-2 border-t border-slate-100">
                      <span>{formatISTDateTime(rfq.createdAt)}</span>
                      <span>{rfq.attachmentUrls.length} Attachment(s)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono-spec">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredRFQs.length} total RFQs)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 font-mono-spec">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                    Math.max(0, currentPage - 3),
                    currentPage + 2
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded text-xs font-semibold ${
                        currentPage === page
                          ? 'bg-[#0F2A4A] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Side Drawer Detail View */}
      {activeRFQ && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveRFQ(null)}
          />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col overflow-hidden z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-[#0F2A4A] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-spec text-amber-400 font-bold text-base">
                    {activeRFQ.rfqNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      activeRFQ.status === 'New'
                        ? 'bg-blue-100 text-blue-900'
                        : activeRFQ.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-900'
                        : activeRFQ.status === 'Quoted'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {activeRFQ.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 font-mono-spec">
                  Submitted: {formatISTDateTime(activeRFQ.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setActiveRFQ(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
              {/* Quick Communication Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`mailto:${activeRFQ.email}?subject=${encodeURIComponent(
                    `ACHSE LLP Quotation Inquiry — ${activeRFQ.rfqNumber}`
                  )}&body=${encodeURIComponent(
                    `Dear ${activeRFQ.name},\n\nThank you for reaching out to ACHSE LLP regarding your requirement for ${activeRFQ.productCategory}.\n\nOur technical team in Pune has reviewed your specifications...`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F2A4A] text-white hover:bg-[#1E3A5F] transition-colors font-semibold"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reply via Email</span>
                </a>

                <a
                  href={`https://wa.me/${activeRFQ.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${activeRFQ.name}, this is Srihari from ACHSE LLP regarding your RFQ ${activeRFQ.rfqNumber} for ${activeRFQ.productCategory}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Chat</span>
                </a>

                <button
                  onClick={() => downloadSingleRfqPDF(activeRFQ)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Download PDF Dossier</span>
                </button>

                {activeRFQ.attachmentUrls.length > 0 && (
                  <button
                    onClick={() => downloadAllAttachmentsAsZip(activeRFQ)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5 text-blue-700" />
                    <span>Download All Drawings (ZIP)</span>
                  </button>
                )}
              </div>

              {/* Customer Contact Details Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-mono-spec uppercase text-slate-500 font-bold tracking-wider">
                  Customer & OEM Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Contact Person</span>
                    <strong className="text-slate-900 text-sm">{activeRFQ.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Company / Enterprise</span>
                    <strong className="text-slate-900 text-sm">{activeRFQ.company}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Email Address</span>
                    <span className="font-mono-spec text-slate-700 select-all">{activeRFQ.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Phone / Mobile</span>
                    <span className="font-mono-spec text-slate-700 select-all">{activeRFQ.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Product Category</span>
                    <span className="font-semibold text-[#0F2A4A]">{activeRFQ.productCategory}</span>
                  </div>
                  {activeRFQ.productName && (
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Catalogue Item</span>
                      <span className="font-semibold text-slate-800">{activeRFQ.productName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement & Specs Full Message */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-spec uppercase text-slate-500 font-bold tracking-wider">
                  Technical Requirements & Instructions
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {activeRFQ.message}
                </div>
              </div>

              {/* Uploaded Drawings & Attachments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-spec uppercase text-slate-500 font-bold tracking-wider">
                    Attached Drawings ({activeRFQ.attachmentUrls.length})
                  </span>
                  {activeRFQ.attachmentUrls.length > 0 && (
                    <button
                      onClick={() => downloadAllAttachmentsAsZip(activeRFQ)}
                      className="text-[11px] font-semibold text-amber-700 hover:underline"
                    >
                      Download ZIP
                    </button>
                  )}
                </div>

                {activeRFQ.attachmentUrls.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                    No drawing files uploaded for this quotation request.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeRFQ.attachmentUrls.map((att, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileCode className="w-5 h-5 text-[#0F2A4A] shrink-0" />
                          <div className="truncate">
                            <div className="font-mono-spec font-semibold text-slate-800 truncate">
                              {att.name}
                            </div>
                            {att.size && (
                              <div className="text-[10px] text-slate-400">
                                {(att.size / 1024).toFixed(1)} KB
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview / Open</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Management & Internal Admin Notes */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-bold mb-1.5">
                    Quotation Workflow Status
                  </label>
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value as RFQStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:bg-white"
                  >
                    <option value="New">New (Pending Initial Review)</option>
                    <option value="In Progress">In Progress (Drawing Feasibility / Tooling Estimating)</option>
                    <option value="Quoted">Quoted (Formal Quote Dispatched)</option>
                    <option value="Closed">Closed (Completed / PO Received)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-spec uppercase text-slate-500 font-bold mb-1.5">
                    Internal Engineering Notes (Confidential)
                  </label>
                  <textarea
                    rows={4}
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Log tool design feedback, quote number, material availability, or follow-up timelines..."
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:outline-hidden focus:border-[#0F2A4A]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleReadStatus(activeRFQ)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    {activeRFQ.isRead ? 'Mark as Unread' : 'Mark as Read'}
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
                        <span>{savingNotes ? 'Saving...' : 'Save Notes & Status'}</span>
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
      {deleteModalRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm RFQ Deletion</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete record{' '}
                <strong className="font-mono-spec text-rose-700">{deleteModalRFQ.rfqNumber}</strong> ({deleteModalRFQ.company})? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalRFQ(null)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRFQ}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
