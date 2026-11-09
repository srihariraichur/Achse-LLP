/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Portal — Data Types & Schema Interfaces
 */

export type RFQStatus = 'New' | 'In Progress' | 'Quoted' | 'Closed';
export type ContactStatus = 'New' | 'Replied' | 'Closed';

export interface AttachmentItem {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string; // e.g. ACH-RFQ-2026-0001
  createdAt: number; // millisecond epoch timestamp
  name: string;
  company: string;
  email: string;
  phone: string;
  productCategory: string;
  productName?: string;
  message: string;
  attachmentUrls: AttachmentItem[];
  status: RFQStatus;
  isRead: boolean;
  adminNotes?: string;
}

export interface ContactMessage {
  id: string;
  createdAt: number; // millisecond epoch timestamp
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: ContactStatus;
  adminNotes?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  displayName?: string;
}

export interface RFQFilterOptions {
  searchQuery: string;
  category: string;
  status: string;
  readFilter: 'all' | 'unread' | 'read';
  startDate?: string;
  endDate?: string;
}

export interface ContactFilterOptions {
  searchQuery: string;
  status: string;
  readFilter: 'all' | 'unread' | 'read';
  startDate?: string;
  endDate?: string;
}
