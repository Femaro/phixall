import admin from 'firebase-admin';

let app: admin.app.App | undefined;

export function getFirebaseAdmin() {
  if (!app) {
    if (admin.apps.length === 0) {
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } catch (error) {
          throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY. Must be valid JSON.');
        }
      } else {
        // Only try to load from file in development (not in production/Vercel)
        // This prevents build warnings when the file doesn't exist
        if (process.env.NODE_ENV === 'development') {
          try {
            // Dynamic require to avoid bundling issues - only in development
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            serviceAccount = require('../../serviceAccountKey.json');
          } catch (error) {
            throw new Error('Firebase Admin SDK not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable or provide serviceAccountKey.json in project root.');
          }
        } else {
          throw new Error('Firebase Admin SDK not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable in Vercel.');
        }
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

