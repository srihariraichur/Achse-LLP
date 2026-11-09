/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Portal — Export Utilities
 * Produces:
 * 1. CSV with UTF-8 BOM (proper Excel recognition)
 * 2. Excel (.xlsx) with bold styled header row, auto-fit column widths, frozen top row
 * 3. PDF table with brand header, metadata, IST timestamps, and column layouts
 * 4. Single RFQ PDF summary report (branded technical one-pager)
 * 5. ZIP of all drawings/attachments using JSZip
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import type { RFQ, ContactMessage } from './types.ts';

// Helper: Format IST Date (DD-MM-YYYY HH:mm)
export function formatISTDateTime(timestamp: number | string | Date): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return 'N/A';
    
    // Add IST offset (+5:30) if interpreting UTC or direct formatting
    const istOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const parts = new Intl.DateTimeFormat('en-GB', istOptions).formatToParts(d);
    const day = parts.find((p) => p.type === 'day')?.value || '01';
    const month = parts.find((p) => p.type === 'month')?.value || '01';
    const year = parts.find((p) => p.type === 'year')?.value || '2026';
    const hour = parts.find((p) => p.type === 'hour')?.value || '00';
    const minute = parts.find((p) => p.type === 'minute')?.value || '00';
    return `${day}-${month}-${year} ${hour}:${minute} IST`;
  } catch {
    return 'N/A';
  }
}

export function getExportDateStamp(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==========================================
// CSV EXPORT (UTF-8 BOM)
// ==========================================
export function exportRFQsToCSV(rfqs: RFQ[], filename?: string) {
  const fileTitle = filename || `Achse_RFQs_${getExportDateStamp()}.csv`;
  const headers = [
    'RFQ Number',
    'Date & Time (IST)',
    'Name',
    'Company',
    'Email',
    'Phone',
    'Category',
    'Product Name',
    'Status',
    'Read Status',
    'Message',
    'Attachment Links',
    'Admin Notes',
  ];

  const rows = rfqs.map((r) => [
    `"${r.rfqNumber.replace(/"/g, '""')}"`,
    `"${formatISTDateTime(r.createdAt)}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.company.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    `"${r.phone.replace(/"/g, '""')}"`,
    `"${r.productCategory.replace(/"/g, '""')}"`,
    `"${(r.productName || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${r.isRead ? 'Read' : 'Unread'}"`,
    `"${r.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${r.attachmentUrls.map((a) => a.url).join(' ; ')}"`,
    `"${(r.adminNotes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileTitle);
}

export function exportContactsToCSV(contacts: ContactMessage[], filename?: string) {
  const fileTitle = filename || `Achse_Contacts_${getExportDateStamp()}.csv`;
  const headers = [
    'Contact ID',
    'Date & Time (IST)',
    'Name',
    'Company',
    'Email',
    'Phone',
    'Subject',
    'Status',
    'Read Status',
    'Message',
    'Admin Notes',
  ];

  const rows = contacts.map((c) => [
    `"${c.id}"`,
    `"${formatISTDateTime(c.createdAt)}"`,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.company.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${c.phone.replace(/"/g, '""')}"`,
    `"${c.subject.replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${c.isRead ? 'Read' : 'Unread'}"`,
    `"${c.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(c.adminNotes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileTitle);
}

// ==========================================
// EXCEL EXPORT (.XLSX)
// ==========================================
export function exportRFQsToExcel(rfqs: RFQ[], filename?: string) {
  const fileTitle = filename || `Achse_RFQs_${getExportDateStamp()}.xlsx`;

  const data = rfqs.map((r) => ({
    'RFQ Number': r.rfqNumber,
    'Date & Time (IST)': formatISTDateTime(r.createdAt),
    'Name': r.name,
    'Company': r.company,
    'Email': r.email,
    'Phone': r.phone,
    'Category': r.productCategory,
    'Product Name': r.productName || '—',
    'Status': r.status,
    'Read/Unread': r.isRead ? 'Read' : 'Unread',
    'Attachment Links': r.attachmentUrls.map((a) => a.url).join('\n') || 'None',
    'Requirements': r.message,
    'Admin Notes': r.adminNotes || '—',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = [
    { wch: 22 }, // RFQ Number
    { wch: 22 }, // Date & Time
    { wch: 20 }, // Name
    { wch: 28 }, // Company
    { wch: 26 }, // Email
    { wch: 18 }, // Phone
    { wch: 22 }, // Category
    { wch: 26 }, // Product Name
    { wch: 14 }, // Status
    { wch: 12 }, // Read/Unread
    { wch: 35 }, // Attachment Links
    { wch: 45 }, // Requirements
    { wch: 35 }, // Admin Notes
  ];
  worksheet['!cols'] = colWidths;

  // Freeze top row
  worksheet['!views'] = [{ state: 'frozen', ySplit: 1 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'RFQs');
  XLSX.writeFile(workbook, fileTitle);
}

export function exportContactsToExcel(contacts: ContactMessage[], filename?: string) {
  const fileTitle = filename || `Achse_Contacts_${getExportDateStamp()}.xlsx`;

  const data = contacts.map((c) => ({
    'Date & Time (IST)': formatISTDateTime(c.createdAt),
    'Name': c.name,
    'Company': c.company,
    'Email': c.email,
    'Phone': c.phone,
    'Subject': c.subject,
    'Status': c.status,
    'Read/Unread': c.isRead ? 'Read' : 'Unread',
    'Message': c.message,
    'Admin Notes': c.adminNotes || '—',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = [
    { wch: 22 },
    { wch: 20 },
    { wch: 28 },
    { wch: 26 },
    { wch: 18 },
    { wch: 30 },
    { wch: 14 },
    { wch: 12 },
    { wch: 45 },
    { wch: 35 },
  ];
  worksheet['!cols'] = colWidths;
  worksheet['!views'] = [{ state: 'frozen', ySplit: 1 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Messages');
  XLSX.writeFile(workbook, fileTitle);
}

// ==========================================
// PDF EXPORT (jsPDF + autoTable)
// ==========================================
export function exportRFQsToPDF(rfqs: RFQ[], filename?: string) {
  const fileTitle = filename || `Achse_RFQs_${getExportDateStamp()}.pdf`;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  // ACHSE Brand Header
  doc.setFillColor(15, 42, 74); // #0F2A4A
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ACHSE LLP — Quotation Inquiries (RFQs)', 30, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(217, 119, 6); // amber
  doc.text(`Exported: ${formatISTDateTime(Date.now())} | Total Records: ${rfqs.length}`, 30, 46);

  const tableData = rfqs.map((r) => [
    r.rfqNumber,
    formatISTDateTime(r.createdAt),
    `${r.name}\n${r.company}`,
    `${r.email}\n${r.phone}`,
    r.productCategory,
    r.status,
    r.attachmentUrls.length > 0 ? `${r.attachmentUrls.length} file(s)` : 'None',
    r.message.slice(0, 100) + (r.message.length > 100 ? '...' : ''),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['RFQ No.', 'Date & Time', 'Contact / Company', 'Email / Phone', 'Category', 'Status', 'Drawings', 'Requirements Summary']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 42, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 70 },
      2: { cellWidth: 100 },
      3: { cellWidth: 110 },
      4: { cellWidth: 90 },
      5: { cellWidth: 50 },
      6: { cellWidth: 50 },
      7: { cellWidth: 'auto' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(fileTitle);
}

export function exportContactsToPDF(contacts: ContactMessage[], filename?: string) {
  const fileTitle = filename || `Achse_Contacts_${getExportDateStamp()}.pdf`;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFillColor(15, 42, 74);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ACHSE LLP — Contact Desk Inquiries', 30, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(217, 119, 6);
  doc.text(`Exported: ${formatISTDateTime(Date.now())} | Total Records: ${contacts.length}`, 30, 46);

  const tableData = contacts.map((c) => [
    formatISTDateTime(c.createdAt),
    `${c.name}\n${c.company}`,
    `${c.email}\n${c.phone}`,
    c.subject,
    c.status,
    c.message.slice(0, 140) + (c.message.length > 140 ? '...' : ''),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Date & Time', 'Contact / Company', 'Email / Phone', 'Subject', 'Status', 'Message Summary']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 42, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 120 },
      2: { cellWidth: 120 },
      3: { cellWidth: 130 },
      4: { cellWidth: 60 },
      5: { cellWidth: 'auto' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(fileTitle);
}

// ==========================================
// SINGLE RFQ ONE-PAGE SUMMARY REPORT (PDF)
// ==========================================
export function downloadSingleRfqPDF(rfq: RFQ) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header banner
  doc.setFillColor(15, 42, 74);
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ACHSE LLP', 40, 36);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 158, 11);
  doc.text('PRECISION IN MOTION | ENGINEERING SPECIFICATION & RFQ DOSSIER', 40, 52);

  doc.setTextColor(203, 213, 225);
  doc.text('Pune Desk: +91 91565 10992 | srihari@achse.in | www.achse.in', 40, 65);

  // RFQ Title & Status Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`RFQ DOSSIER: ${rfq.rfqNumber}`, 40, 105);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Submitted On: ${formatISTDateTime(rfq.createdAt)}`, 40, 120);

  // Status badge box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - 140, 92, 100, 30, 4, 4, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 74);
  doc.text(`Status: ${rfq.status}`, pageWidth - 130, 111);

  // Customer Information Table
  autoTable(doc, {
    startY: 135,
    head: [['CUSTOMER INFORMATION', '']],
    body: [
      ['Contact Name', rfq.name],
      ['Company / OEM', rfq.company],
      ['Work Email', rfq.email],
      ['Phone Number', rfq.phone],
      ['Product Category', rfq.productCategory],
      ['Pre-Selected Component', rfq.productName || 'None (Custom Drawing Inquiry)'],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 42, 74],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 160, fontStyle: 'bold', textColor: [71, 85, 105] },
      1: { cellWidth: 'auto', textColor: [15, 23, 42] },
    },
  });

  const nextY = (doc as any).lastAutoTable.finalY + 15;

  // Technical Requirements Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 74);
  doc.text('TECHNICAL REQUIREMENTS & SPECIFICATIONS:', 40, nextY);

  doc.setFillColor(248, 250, 252);
  doc.rect(40, nextY + 8, pageWidth - 80, 100, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(40, nextY + 8, pageWidth - 80, 100, 'D');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const splitMessage = doc.splitTextToSize(rfq.message, pageWidth - 100);
  doc.text(splitMessage, 50, nextY + 26);

  // Attachments section
  const attachY = nextY + 125;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 74);
  doc.text(`ATTACHED DRAWINGS (${rfq.attachmentUrls.length}):`, 40, attachY);

  if (rfq.attachmentUrls.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('No engineering drawings or files attached to this request.', 40, attachY + 16);
  } else {
    autoTable(doc, {
      startY: attachY + 8,
      head: [['File Name', 'Format', 'Download Link / URI']],
      body: rfq.attachmentUrls.map((a) => [
        a.name,
        a.type || a.name.split('.').pop()?.toUpperCase() || 'FILE',
        a.url.slice(0, 70) + (a.url.length > 70 ? '...' : ''),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [15, 42, 74],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
    });
  }

  // Admin Internal Notes
  const notesY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : attachY + 45;
  if (rfq.adminNotes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 42, 74);
    doc.text('INTERNAL ADMIN NOTES:', 40, notesY);

    doc.setFillColor(254, 243, 199); // amber-100
    doc.rect(40, notesY + 8, pageWidth - 80, 45, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.rect(40, notesY + 8, pageWidth - 80, 45, 'D');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15);
    const splitNotes = doc.splitTextToSize(rfq.adminNotes, pageWidth - 100);
    doc.text(splitNotes, 50, notesY + 24);
  }

  // Footer banner
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ACHSE LLP — Technical Engineering Desk, Pune, Maharashtra, India | STRICTLY CONFIDENTIAL', 40, doc.internal.pageSize.getHeight() - 25);

  doc.save(`${rfq.rfqNumber}_Dossier.pdf`);
}

// ==========================================
// DOWNLOAD ALL ATTACHMENTS AS ZIP
// ==========================================
export async function downloadAllAttachmentsAsZip(rfq: RFQ) {
  if (!rfq.attachmentUrls || rfq.attachmentUrls.length === 0) {
    alert('No attachments to download for this RFQ.');
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder(rfq.rfqNumber) || zip;

  for (let i = 0; i < rfq.attachmentUrls.length; i++) {
    const item = rfq.attachmentUrls[i];
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      folder.file(item.name || `drawing_${i + 1}`, blob);
    } catch {
      // In case of CORS or local mock URL, save placeholder info file
      folder.file(`${item.name || `drawing_${i + 1}`}.txt`, `Original Attachment Reference:\nName: ${item.name}\nURL: ${item.url}\n`);
    }
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipContent, `${rfq.rfqNumber}_Drawings.zip`);
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
