import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDyFFB-R8-NJUM0t34gpBzg-DR0jsgkS50',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'sda-matrimony-prod.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sda-matrimony-prod',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sda-matrimony-prod.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '376717863182',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:376717863182:web:d31b9b77959db301d48f5f',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-Q4VGMV4WQ5',
};

// Initialize Firebase app singleton
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Cloud Firestore Database
export const db: Firestore = getFirestore(app);

// Firebase Authentication
export const auth: Auth = getAuth(app);

// Cloud Storage for Member Media & Verification Documents
export const storage: FirebaseStorage = getStorage(app);

// Google Analytics (Browser-only guard for Next.js SSR compatibility)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported in current browser environment
    });
}

export { analytics };
export default app;
