// src/shared/api/adapters/out/storage/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide API key in logs
});

// Hardcoded user ID for now - will be replaced with auth later
export const CURRENT_USER_ID = 'default-user';

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific settings
const firestoreSettings = {
  experimentalForceLongPolling: true,
  useFetchStreams: false, // This might help with the 400 errors
  cacheSizeBytes: 40000000, // 40 MB
};

export const db = initializeFirestore(app, firestoreSettings);

console.log('Firebase initialized with custom settings');
