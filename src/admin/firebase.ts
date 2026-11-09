/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Firebase & Admin Portal Configuration
 * Supports production Firebase instance with seamless local storage sync
 * so the portal works reliably in live, preview, and demo environments.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  type Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL,
  type FirebaseStorage
} from 'firebase/storage';
import type { RFQ, ContactMessage, AdminUser, RFQStatus, ContactStatus, AttachmentItem } from './types.ts';

// Dynamic Firebase configuration reader
// Checks window, import.meta.env, or fallback
interface FirebaseEnvConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const env = (import.meta as any).env || {};
const firebaseConfig: FirebaseEnvConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || (window as any).__ACHSE_FIREBASE_CONFIG__?.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (window as any).__ACHSE_FIREBASE_CONFIG__?.authDomain || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || (window as any).__ACHSE_FIREBASE_CONFIG__?.projectId || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (window as any).__ACHSE_FIREBASE_CONFIG__?.storageBucket || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (window as any).__ACHSE_FIREBASE_CONFIG__?.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || (window as any).__ACHSE_FIREBASE_CONFIG__?.appId || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseStorage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { firebaseApp, firestoreDb as db, firebaseAuth as auth, firebaseStorage as storage };

// Local persistence cache keys for immediate interactivity & offline resilience
const LOCAL_STORAGE_RFQS_KEY = 'achse_admin_rfqs_v1';
const LOCAL_STORAGE_CONTACTS_KEY = 'achse_admin_contacts_v1';
const LOCAL_STORAGE_ADMINS_KEY = 'achse_admin_users_v1';
const LOCAL_COUNTER_KEY = 'achse_rfq_sequence_counter';

// Initial realistic starter data matching ACHSE LLP's cold forging, gauges, and fastener catalogue
const SEED_RFQS: RFQ[] = [
  {
    id: 'rfq-2026-0001',
    rfqNumber: 'ACH-RFQ-2026-0001',
    createdAt: Date.now() - 3600000 * 2, // 2 hours ago
    name: 'Rajesh Sharma',
    company: 'Bharat Auto Components Ltd.',
    email: 'r.sharma@bharatauto.co.in',
    phone: '+91 98230 45671',
    productCategory: 'Cold Forging Dies',
    productName: 'Tungsten Carbide Hex Die Insert',
    message: 'Requirement for 12 sets of carbide punch and die inserts for M12 high-tensile bolt header. Tolerances within ±0.005mm as per attached drawing.',
    attachmentUrls: [
      {
        name: 'M12_Carbide_Die_Drawing_Rev3.pdf',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
        size: 2450000,
        type: 'application/pdf',
      }
    ],
    status: 'New',
    isRead: false,
    adminNotes: 'High priority customer from Chakan MIDC. Drawing reviewed by tool design team.',
  },
  {
    id: 'rfq-2026-0002',
    rfqNumber: 'ACH-RFQ-2026-0002',
    createdAt: Date.now() - 3600000 * 18, // 18 hours ago
    name: 'Amitabh Deshmukh',
    company: 'Pinnacle Fasteners Pvt. Ltd.',
    email: 'amitabh@pinnaclefasteners.com',
    phone: '+91 99750 12849',
    productCategory: 'Gauges',
    productName: 'Tungsten Carbide Thread Plug Gauge M10x1.5 6H',
    message: 'Need quotation for calibrated thread plug gauges and plain plug gauges with NABL certification for our Pune plant quality lab.',
    attachmentUrls: [],
    status: 'In Progress',
    isRead: true,
    adminNotes: 'Sample calibration certificate sent on email. Waiting for purchase approval.',
  },
  {
    id: 'rfq-2026-0003',
    rfqNumber: 'ACH-RFQ-2026-0003',
    createdAt: Date.now() - 3600000 * 48, // 2 days ago
    name: 'K. Venkatesh',
    company: 'Southern Forge & Axle Works',
    email: 'venkatesh.k@southernforge.in',
    phone: '+91 94440 98210',
    productCategory: 'Fasteners',
    productName: 'Grade 10.9 Flange Bolts',
    message: 'Annual rate contract RFQ for 50,000 pcs monthly of M14x1.5x65 Grade 10.9 Dacromet coated automotive flange bolts.',
    attachmentUrls: [
      {
        name: 'SFA_Bolt_Spec_IS1367.pdf',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        size: 1840000,
        type: 'application/pdf',
      }
    ],
    status: 'Quoted',
    isRead: true,
    adminNotes: 'Quotation ACH-QT-2026-042 sent with Dacromet coating certificates.',
  },
  {
    id: 'rfq-2026-0004',
    rfqNumber: 'ACH-RFQ-2026-0004',
    createdAt: Date.now() - 3600000 * 96, // 4 days ago
    name: 'Vikram Patel',
    company: 'Precision Transmission Gears',
    email: 'vikram@ptgears.in',
    phone: '+91 98980 33412',
    productCategory: 'CNC Machined Parts',
    productName: 'Hard Turned Intermediate Shaft',
    message: 'Looking for precision CNC turned and ground intermediate shafts in EN353 case carburized steel. 500 pcs pilot batch.',
    attachmentUrls: [],
    status: 'Closed',
    isRead: true,
    adminNotes: 'PO received, production schedule confirmed with Pune manufacturing unit.',
  }
];

const SEED_CONTACTS: ContactMessage[] = [
  {
    id: 'contact-2026-0001',
    createdAt: Date.now() - 3600000 * 3, // 3 hours ago
    name: 'Nikhil Patil',
    company: 'Force Motors Vendor Desk',
    email: 'npatil@forcemotorsdesk.com',
    phone: '+91 97631 88204',
    subject: 'Vendor Registration & Facility Audit Schedule',
    message: 'We are inviting ACHSE LLP for vendor registration under our precision cold forging tooling category. Please share company profile and GST/ISO credentials.',
    isRead: false,
    status: 'New',
    adminNotes: '',
  },
  {
    id: 'contact-2026-0002',
    createdAt: Date.now() - 3600000 * 26, // yesterday
    name: 'Dr. Sanjay Kulkarni',
    company: 'COEP Technological University',
    email: 'skulkarni@coep.ac.in',
    phone: '+91 94220 15632',
    subject: 'Cold Forging Technical Training & Workshop',
    message: 'Requesting availability of ACHSE technical team for a 2-day hands-on workshop on Cold Forging Tool Die Design and Finite Element Analysis for our M.Tech students.',
    isRead: true,
    status: 'Replied',
    adminNotes: 'Coordinated via phone. Srihari sir confirmed availability for March session.',
  },
  {
    id: 'contact-2026-0003',
    createdAt: Date.now() - 3600000 * 80, // 3.5 days ago
    name: 'Sunil Mehta',
    company: 'Apex Fastener Trading Co.',
    email: 'sales@apexfasteners.co.in',
    phone: '+91 93224 55109',
    subject: 'Distributorship Inquiry for Western Maharashtra',
    message: 'We are interested in distributing ACHSE brand inspection plug and ring gauges in Kolhapur and Satara engineering belts.',
    isRead: true,
    status: 'Closed',
    adminNotes: 'Distributor onboarding terms shared. Follow-up meeting scheduled.',
  }
];

// Helper: Read local stored records
export function getLocalRFQs(): RFQ[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RFQS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_RFQS_KEY, JSON.stringify(SEED_RFQS));
      return SEED_RFQS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_RFQS;
  }
}

export function saveLocalRFQs(items: RFQ[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_RFQS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('achse-storage-update'));
  } catch (err) {
    console.error('Failed saving RFQs locally:', err);
  }
}

export function getLocalContacts(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(SEED_CONTACTS));
      return SEED_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_CONTACTS;
  }
}

export function saveLocalContacts(items: ContactMessage[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('achse-storage-update'));
  } catch (err) {
    console.error('Failed saving contacts locally:', err);
  }
}

// Generate human-friendly RFQ number: ACH-RFQ-YYYY-XXXX
export function generateNextRfqNumber(): string {
  const year = new Date().getFullYear();
  let count = 1;
  try {
    const stored = localStorage.getItem(LOCAL_COUNTER_KEY);
    count = stored ? parseInt(stored, 10) + 1 : getLocalRFQs().length + 1;
  } catch {
    count = getLocalRFQs().length + 1;
  }
  localStorage.setItem(LOCAL_COUNTER_KEY, String(count));
  const padded = String(count).padStart(4, '0');
  return `ACH-RFQ-${year}-${padded}`;
}

// ==========================================
// Service API for RFQs
// ==========================================
export async function fetchAllRFQs(): Promise<RFQ[]> {
  if (firestoreDb) {
    try {
      const q = query(collection(firestoreDb, 'rfqs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const remoteRFQs: RFQ[] = snap.docs.map((d) => {
          const data = d.data();
          const createdAtMillis = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now());
          return {
            id: d.id,
            rfqNumber: data.rfqNumber || `ACH-RFQ-2026-${d.id.slice(-4)}`,
            createdAt: createdAtMillis,
            name: data.name || '',
            company: data.company || '',
            email: data.email || '',
            phone: data.phone || '',
            productCategory: data.productCategory || 'Other',
            productName: data.productName || '',
            message: data.message || '',
            attachmentUrls: Array.isArray(data.attachmentUrls) ? data.attachmentUrls : [],
            status: data.status || 'New',
            isRead: Boolean(data.isRead),
            adminNotes: data.adminNotes || '',
          };
        });
        saveLocalRFQs(remoteRFQs);
        return remoteRFQs;
      }
    } catch (err) {
      console.warn('Firestore fetch RFQs fallback to local store:', err);
    }
  }
  return getLocalRFQs();
}

export async function createRFQ(payload: Omit<RFQ, 'id' | 'createdAt' | 'rfqNumber' | 'status' | 'isRead'> & { rfqNumber?: string }): Promise<RFQ> {
  const rfqNumber = payload.rfqNumber || generateNextRfqNumber();
  const newRfq: RFQ = {
    id: `rfq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    rfqNumber,
    createdAt: Date.now(),
    name: payload.name.trim(),
    company: payload.company.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    productCategory: payload.productCategory,
    productName: payload.productName || '',
    message: payload.message.trim(),
    attachmentUrls: payload.attachmentUrls || [],
    status: 'New',
    isRead: false,
    adminNotes: '',
  };

  // 1. Save to local storage cache immediately
  const existing = getLocalRFQs();
  saveLocalRFQs([newRfq, ...existing]);

  // 2. Sync to Firestore if available
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'rfqs', newRfq.id), {
        ...newRfq,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore create RFQ write note:', err);
    }
  }

  return newRfq;
}

export async function updateRFQ(id: string, updates: Partial<RFQ>): Promise<void> {
  // Update local
  const current = getLocalRFQs();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveLocalRFQs(updated);

  // Sync to Firestore
  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'rfqs', id);
      await updateDoc(docRef, updates as any);
    } catch (err) {
      console.warn('Firestore update RFQ note:', err);
    }
  }
}

export async function deleteRFQ(id: string): Promise<void> {
  const current = getLocalRFQs();
  const remaining = current.filter((item) => item.id !== id);
  saveLocalRFQs(remaining);

  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'rfqs', id));
    } catch (err) {
      console.warn('Firestore delete RFQ note:', err);
    }
  }
}

// ==========================================
// Service API for Contact Messages
// ==========================================
export async function fetchAllContacts(): Promise<ContactMessage[]> {
  if (firestoreDb) {
    try {
      const q = query(collection(firestoreDb, 'contacts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const remoteContacts: ContactMessage[] = snap.docs.map((d) => {
          const data = d.data();
          const createdAtMillis = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now());
          return {
            id: d.id,
            createdAt: createdAtMillis,
            name: data.name || '',
            company: data.company || '',
            email: data.email || '',
            phone: data.phone || '',
            subject: data.subject || 'General Inquiry',
            message: data.message || '',
            isRead: Boolean(data.isRead),
            status: data.status || 'New',
            adminNotes: data.adminNotes || '',
          };
        });
        saveLocalContacts(remoteContacts);
        return remoteContacts;
      }
    } catch (err) {
      console.warn('Firestore fetch contacts fallback to local store:', err);
    }
  }
  return getLocalContacts();
}

export async function createContactMessage(payload: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'isRead'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
    name: payload.name.trim(),
    company: payload.company.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    subject: payload.subject ? payload.subject.trim() : 'Website Inquiry',
    message: payload.message.trim(),
    isRead: false,
    status: 'New',
    adminNotes: '',
  };

  const existing = getLocalContacts();
  saveLocalContacts([newMsg, ...existing]);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'contacts', newMsg.id), {
        ...newMsg,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore create contact note:', err);
    }
  }

  return newMsg;
}

export async function updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<void> {
  const current = getLocalContacts();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveLocalContacts(updated);

  if (firestoreDb) {
    try {
      await updateDoc(doc(firestoreDb, 'contacts', id), updates as any);
    } catch (err) {
      console.warn('Firestore update contact note:', err);
    }
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const current = getLocalContacts();
  const remaining = current.filter((item) => item.id !== id);
  saveLocalContacts(remaining);

  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'contacts', id));
    } catch (err) {
      console.warn('Firestore delete contact note:', err);
    }
  }
}

// Upload file to Firebase Storage if available, or generate secure client data URL
export async function uploadDrawingFile(file: File, rfqNumber: string): Promise<AttachmentItem> {
  if (firebaseStorage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileRef = storageRef(firebaseStorage, `drawings/${rfqNumber}/${Date.now()}_${sanitizedName}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      return {
        name: file.name,
        url: downloadUrl,
        size: file.size,
        type: file.type,
      };
    } catch (err) {
      console.warn('Firebase storage upload fallback to simulated asset url:', err);
    }
  }

  // Client-side fallback object URL for immediate download/preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        name: file.name,
        url: (reader.result as string) || URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  });
}
