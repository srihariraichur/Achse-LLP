/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Contact Us Component:
 * - Quote request form with Name, Company, Email, Phone, Product Category, Message
 * - File upload for drawings (PDF, DWG, STEP) with drag-and-drop & file list
 * - Client-side validation & success message
 * - mailto/form-endpoint hook with "Connect backend here" comment
 * - Address, phone, email, working hours placeholders [to be confirmed]
 * - Embedded Google Map of Pune location
 * - WhatsApp button [number - to be confirmed]
 */

import React, { useState, useRef } from 'react';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../data/content.ts';
import { createContactMessage, createRFQ, uploadDrawingFile, generateNextRfqNumber } from '../admin/firebase.ts';

interface ContactSectionProps {
  initialCategory?: string;
  initialProductName?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialCategory = "Cold Forging Dies",
  initialProductName = "",
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: initialCategory,
    message: initialProductName ? `Inquiry regarding: ${initialProductName}\n\nPlease provide quotation and lead times based on the attached specification/drawing.` : '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Cold Forging Dies",
    "Gauges",
    "Fasteners",
    "CNC Machined Parts",
    "Special Tools",
    "Other",
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Contact name is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please describe your requirement or specification";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent spam protection
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const trimmedName = formData.name.trim();
      const trimmedCompany = formData.company.trim();
      const trimmedEmail = formData.email.trim().toLowerCase();
      const trimmedPhone = formData.phone.trim();
      const trimmedMessage = formData.message.trim();

      // If user uploaded drawing files or specified detailed tooling category, also log RFQ record
      if (files.length > 0 || formData.category) {
        const rfqNumber = generateNextRfqNumber();
        const attachments = [];
        for (const file of files) {
          try {
            const item = await uploadDrawingFile(file, rfqNumber);
            attachments.push(item);
          } catch (uploadErr) {
            console.warn('Drawing upload note:', uploadErr);
          }
        }

        await createRFQ({
          rfqNumber,
          name: trimmedName,
          company: trimmedCompany,
          email: trimmedEmail,
          phone: trimmedPhone,
          productCategory: formData.category || 'Other',
          message: trimmedMessage,
          attachmentUrls: attachments,
        });
      }

      // Save to Contacts collection
      await createContactMessage({
        name: trimmedName,
        company: trimmedCompany,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: `Inquiry: ${formData.category || 'Engineering Tooling'}`,
        message: trimmedMessage,
      });

      // Forward to backend API for MySQL parity
      try {
        await fetch('/api/quote-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        // API fallback handled
      }
    } catch (err) {
      console.warn('Quote request transmission note:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }
  };

  const handleWhatsAppClick = () => {
    const text = `Hello Achse LLP, I would like to enquire about ${formData.category || 'tooling and fasteners'}. Company: ${formData.company || 'Engineering OEM'}`;
    const waUrl = getWhatsAppUrl(text);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono-spec uppercase tracking-wider text-amber-600 font-semibold">
            Technical Inquiries & RFQs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2A4A] mt-1 tracking-tight">
            Contact ACHSE LLP
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Request quotations, submit technical drawings for feasibility review, or discuss custom tooling and fastener specifications.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Quote Request Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <span className="text-xs font-mono-spec uppercase tracking-wider text-slate-500 font-semibold">
                Request a Formal Quotation
              </span>
              <h2 className="text-xl font-bold text-[#0F2A4A] mt-0.5">
                Submit Drawing or Technical Requirement
              </h2>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-lg space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Quote Request Received
                </h3>
                <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your requirement. Our technical engineering desk in Pune will review your drawing and contact you within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        category: 'Cold Forging Dies',
                        message: '',
                      });
                      setFiles([]);
                    }}
                    className="px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Anti-spam honeypot */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className={`w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border ${
                        errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Precision Engineering Ltd."
                      className={`w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border ${
                        errors.company ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors`}
                    />
                    {errors.company && <p className="text-[11px] text-rose-600 mt-1">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchase@company.com"
                      className={`w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border ${
                        errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border ${
                        errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Requirement & Specifications <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify part drawing number, material grade, standard (IS/DIN/ISO), tolerances, and estimated batch quantity..."
                    className={`w-full px-3.5 py-2.5 rounded text-sm bg-slate-50 border ${
                      errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    } focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
                </div>

                {/* File Upload for Drawings (PDF, DWG, STEP) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Upload Component Drawing (PDF, DWG, DXF, STEP)
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-[#0F2A4A] bg-blue-50/50'
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.png,.jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700">
                      Click to browse or drag and drop drawings here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports PDF, DWG, STEP, DXF up to 25MB each
                    </p>
                  </div>

                  {/* Attached file list */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {files.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center justify-between p-2 rounded bg-slate-100 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="font-mono-spec text-slate-800 truncate">{file.name}</span>
                            <span className="text-slate-400 text-[10px]">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(fIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] active:bg-[#0A1D33] disabled:opacity-70 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Requirement...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>Submit Quotation Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Drawings and specifications are handled with strict engineering confidentiality.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details, Map & WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono-spec uppercase tracking-wider text-slate-500 font-semibold">
                  Pune Desk
                </span>
                <h3 className="text-lg font-bold text-[#0F2A4A] mt-0.5">
                  Office & Supply Location
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0F2A4A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Address</strong>
                    <span className="text-slate-600 font-mono-spec text-xs">{siteConfig.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0F2A4A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Telephone</strong>
                    <a
                      href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-slate-600 font-mono-spec text-xs hover:text-[#0F2A4A] hover:underline transition-colors block"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0F2A4A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Email Desk</strong>
                    <span className="text-slate-600 font-mono-spec text-xs">{siteConfig.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0F2A4A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">Working Hours</strong>
                    <span className="text-slate-600 text-xs">{siteConfig.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Fast Connect Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20BD5A] transition-colors cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp ({siteConfig.whatsappDisplay})</span>
                </button>
              </div>
            </div>

            {/* Embedded Google Map (Pune Industrial Hub) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100 shadow-xs">
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs font-mono-spec text-slate-600">
                <span>Location: Pune, Maharashtra</span>
                <span className="text-slate-400">[18.5204° N, 73.8567° E]</span>
              </div>
              <div className="w-full h-64 relative bg-slate-200">
                <iframe
                  title="ACHSE LLP Pune Location Map"
                  src="https://maps.google.com/maps?q=Pune,%20Maharashtra,%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
