Phixall Web Portal (Next.js + Firebase)

## Getting Started

1) Environment

Create `.env.local` with Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2) Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

3) Firebase setup

- Enable Email/Password in Firebase Authentication.
- Create Firestore database (production or test mode).
- Optional collections used:
  - `jobs` (client requests)
  - `profiles` (user profile/availability)
  - `jobLocations` (live tracking payloads)

Security rules (starter):

```jsonc
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }

    match /profiles/{uid} {
      allow read: if isSignedIn() && request.auth.uid == uid;
      allow create: if isSignedIn() && request.auth.uid == uid;
      allow update: if isSignedIn() && request.auth.uid == uid;
    }

    match /jobs/{jobId} {
      allow create: if isSignedIn();
      allow read, update: if isSignedIn();
    }

    match /jobLocations/{jobId} {
      allow read, write: if isSignedIn();
    }
  }
}
```

4) Deploy on Vercel

- Add the env vars above in Project → Settings → Environment Variables.
- Deploy with default settings.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
