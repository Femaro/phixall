import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey) {
  console.warn('Missing Firebase env vars. Set NEXT_PUBLIC_FIREBASE_*');
}

let app: FirebaseApp | undefined;

export function getFirebase(): { auth: Auth; db: Firestore; storage: FirebaseStorage } {
  if (typeof window === 'undefined') {
    throw new Error('Firebase must be initialized on the client only');
  }
  if (!app) {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0]!;
    }
  }
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}


