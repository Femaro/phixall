# Phixall - Facility Management Platform

A comprehensive facility management platform connecting clients with skilled artisans for on-demand services. Built with Next.js 15, Firebase, and TypeScript.

## 🚀 Features

### Multi-Role System
- **Client Dashboard**: Request services, track jobs, manage wallet
- **Artisan Dashboard**: Accept jobs, track earnings, cash out funds
- **Admin Dashboard**: Full platform management and analytics

### Client Features
- ✅ Service request with attachments
- ✅ Real-time job tracking
- ✅ Wallet system for deposits and payments
- ✅ Billing history
- ✅ Job status updates

### Artisan Features
- ✅ Availability toggle
- ✅ Job alerts and acceptance
- ✅ Real-time location sharing
- ✅ Earnings tracking
- ✅ Cash-out with automated fees (2.5%)
- ✅ Bank account management

### Admin Features
- ✅ User management (clients & artisans)
- ✅ Job assignment and resource allocation
- ✅ Budget setting for jobs
- ✅ Financial monitoring
- ✅ Platform analytics
- ✅ Transaction oversight
- ✅ User suspension/activation

## 📋 Prerequisites

- Node.js 18+ 
- Firebase account
- Firebase CLI (for deployment)

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd phixall
npm install
```

### 2. Environment Setup

Create `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Firebase Configuration

#### Enable Authentication
1. Go to Firebase Console → Authentication
2. Enable Email/Password sign-in method

#### Create Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database (start in test mode, apply rules later)

#### Deploy Security Rules
```bash
firebase init firestore  # Select your project
firebase deploy --only firestore:rules
firebase deploy --only storage
```

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### 4. Create Admin User

See [CREATE_ADMIN.md](./CREATE_ADMIN.md) for step-by-step guide.

Quick method:
1. Register a user through the app
2. In Firebase Console → Firestore → `profiles` collection
3. Find the user document
4. Change `role` field to `"admin"`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
phixall/
├── src/
│   ├── app/
│   │   ├── (client)/         # Client-specific routes
│   │   │   └── client/
│   │   │       └── dashboard/
│   │   ├── (artisan)/        # Artisan-specific routes
│   │   │   └── artisan/
│   │   │       └── dashboard/
│   │   ├── (admin)/          # Admin-specific routes
│   │   │   └── admin/
│   │   │       └── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   └── site/            # Shared components
│   └── lib/
│       ├── firebaseClient.ts
│       └── adminUtils.ts     # Admin helper functions
├── public/
│   └── logo.png
├── firestore.rules            # Database security rules
├── storage.rules              # Storage security rules
└── README.md
```

## 🔒 Security

### Firestore Collections

- **profiles**: User information (role, name, email, status)
- **jobs**: Service requests and assignments
- **wallets**: User wallet balances
- **transactions**: Financial transaction history
- **artisanLocations**: Real-time artisan locations

### Role-Based Access

Security rules enforce:
- Clients can only see their own jobs and wallet
- Artisans can see available and assigned jobs
- Admins have full platform access
- Users can't modify their own role

See `firestore.rules` for complete rules.

## 💼 User Roles

### Client
- **Access**: `/client/dashboard`
- **Permissions**: Create jobs, manage wallet, view own data
- **Features**: Service requests, job tracking, payments

### Artisan
- **Access**: `/artisan/dashboard`
- **Permissions**: Accept jobs, update status, manage earnings
- **Features**: Job alerts, location sharing, cash-out

### Admin
- **Access**: `/admin/dashboard`
- **Permissions**: Full platform management
- **Features**: User management, job assignment, analytics

## 📊 Admin Dashboard Guide

See [ADMIN_DASHBOARD_GUIDE.md](./ADMIN_DASHBOARD_GUIDE.md) for comprehensive documentation.

**Quick Access:**
- Overview: Platform statistics
- User Management: Suspend/activate users
- Job Management: Assign artisans, set budgets
- Billing: Monitor transactions
- Analytics: Performance metrics

## 💰 Wallet System

### Client Wallet
- Deposit funds via secure payment
- Pay for services from wallet balance
- View billing history
- Real-time balance updates

### Artisan Wallet
- Receive earnings from completed jobs
- Cash out with 2.5% processing fee
- Bank account management
- Transaction history

### Admin Oversight
- Monitor all transactions
- View platform revenue
- Track pending payments

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables (Production)

Add all variables from `.env.local` to your deployment platform.

### Post-Deployment

1. Update Firebase authorized domains
2. Deploy security rules: `firebase deploy --only firestore:rules,storage`
3. Create admin user in Firestore
4. Test all user roles

## 🧪 Testing

### Manual Testing Checklist

- [ ] Client registration and login
- [ ] Client job creation
- [ ] Artisan registration and login
- [ ] Artisan job acceptance
- [ ] Wallet deposits and payments
- [ ] Artisan cash-out
- [ ] Admin dashboard access
- [ ] Admin job assignment
- [ ] User suspension/activation

## 📝 Documentation

- [CREATE_ADMIN.md](./CREATE_ADMIN.md) - Admin user setup
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [ADMIN_DASHBOARD_GUIDE.md](./ADMIN_DASHBOARD_GUIDE.md) - Admin features

## 🛣️ Roadmap

### Upcoming Features
- [ ] Chart visualizations in analytics
- [ ] Email notifications
- [ ] SMS alerts
- [ ] In-app messaging
- [ ] Advanced search and filters
- [ ] Report generation (PDF/CSV)
- [ ] Service category management
- [ ] Rating and review system
- [ ] Invoice generation
- [ ] Payment gateway integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the documentation files
2. Review Firebase Console for errors
3. Check browser console for client errors
4. Verify security rules are deployed

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: Google Maps API
- **Deployment**: Vercel

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
