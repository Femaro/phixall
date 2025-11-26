import admin from 'firebase-admin';

let app: admin.app.App | undefined;

export function getFirebaseAdmin() {
  if (!app) {
    if (admin.apps.length === 0) {
      let serviceAccount;
      try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
          // Try to load from file (for local development only)
          // In production/Vercel, this file won't exist, so we catch the error
          try {
            serviceAccount = require('../../serviceAccountKey.json');
          } catch (fileError) {
            // File doesn't exist - this is expected in production
            throw new Error('Firebase Admin SDK not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
          }
        }
      } catch (error: any) {
        throw new Error('Firebase Admin SDK not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable or provide serviceAccountKey.json');
      }

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
      });
    } else {
      app = admin.apps[0]!;
    }
  }

  return {
    storage: app.storage(),
    firestore: app.firestore(),
  };
}

