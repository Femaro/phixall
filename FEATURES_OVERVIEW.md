# Phixall Platform - Features Overview

## 🏗️ Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Phixall Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Client     │  │   Artisan    │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │   Firebase   │                          │
│                    │ Auth │ DB │ Storage                     │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 👤 User Roles & Access

### Client Role
**Route**: `/client/dashboard`

**Capabilities**:
- ✅ Submit service requests
- ✅ Upload job attachments
- ✅ Track job status in real-time
- ✅ Deposit funds to wallet
- ✅ Pay for services from wallet
- ✅ View billing history
- ✅ Manage profile

**Dashboard Tabs**:
1. **Overview** - Active jobs summary
2. **Request Service** - Create new job
3. **My Jobs** - Track all jobs
4. **Wallet** - Financial management

---

### Artisan Role
**Route**: `/artisan/dashboard`

**Capabilities**:
- ✅ Toggle availability (online/offline)
- ✅ View available jobs
- ✅ Accept job requests
- ✅ Update job status
- ✅ Share location while working
- ✅ Track earnings
- ✅ Cash out funds (2.5% fee)
- ✅ Manage bank account details

**Dashboard Tabs**:
1. **Overview** - Stats and earnings
2. **Available Jobs** - Browse open jobs
3. **My Jobs** - Accepted/active jobs
4. **Wallet** - Earnings and cash-out

---

### Admin Role
**Route**: `/admin/dashboard`

**Capabilities**:
- ✅ View all users (clients & artisans)
- ✅ Suspend/activate user accounts
- ✅ Assign artisans to jobs
- ✅ Set job budgets
- ✅ Monitor all transactions
- ✅ Track platform revenue
- ✅ View analytics and metrics
- ✅ Full platform oversight

**Dashboard Tabs**:
1. **Overview** - Platform statistics
2. **User Management** - Control users
3. **Job Management** - Assign & budget
4. **Billing & Finance** - Money flow
5. **Analytics** - Performance metrics

---

## 💼 Job Lifecycle

```
1. CLIENT CREATES JOB
   ↓
2. JOB APPEARS IN SYSTEM (status: requested)
   ↓
3. ARTISAN ACCEPTS JOB (or ADMIN ASSIGNS)
   ↓ (status: accepted)
4. ARTISAN STARTS WORK
   ↓ (status: in-progress)
5. ARTISAN COMPLETES JOB
   ↓ (status: completed)
6. CLIENT PAYS FROM WALLET
   ↓
7. FUNDS GO TO ARTISAN WALLET
   ↓
8. ARTISAN CASHES OUT (minus 2.5% fee)
```

## 💰 Financial Flow

### Client Wallet Flow
```
DEPOSIT (Paystack/Stripe)
   ↓
CLIENT WALLET BALANCE
   ↓
PAYMENT FOR JOB
   ↓
ARTISAN WALLET BALANCE
   ↓
CASH OUT (minus 2.5% fee)
   ↓
ARTISAN BANK ACCOUNT
```

### Transaction Types
- **deposit**: Client adds funds
- **payment**: Client pays for job
- **earning**: Artisan receives payment
- **cashout**: Artisan withdraws funds
- **refund**: Money returned to client

### Fee Structure
- **Client Deposit**: Free
- **Job Payment**: Free
- **Artisan Cash-out**: 2.5% of amount

---

## 📊 Admin Dashboard Features

### 1. User Management
**Purpose**: Control platform access

**Actions**:
- View all clients
- View all artisans
- Suspend accounts (violations)
- Activate accounts (appeals)
- Track user activity

**Use Cases**:
- Handle customer complaints
- Enforce terms of service
- Security management
- Account verification

---

### 2. Job Management
**Purpose**: Optimize job allocation

**Actions**:
- View all platform jobs
- Assign artisans manually
- Set job budgets
- Monitor job progress
- Track completion rates

**Use Cases**:
- Priority/urgent jobs
- Skill-based assignment
- Load balancing
- Resource planning

---

### 3. Billing & Finance
**Purpose**: Financial oversight

**Features**:
- Total revenue tracking
- Pending payments monitor
- Transaction history
- Cash flow analysis
- Payment verification

**Metrics**:
- Total Revenue
- Pending Payments
- Completed Jobs Value
- Transaction Volume

---

### 4. Analytics
**Purpose**: Business intelligence

**Metrics**:
- Job completion rate
- Average job value
- Active job percentage
- User growth
- Revenue trends

**Use Cases**:
- Business planning
- Performance monitoring
- Growth tracking
- Issue identification

---

## 🔒 Security Features

### Authentication
- Firebase Auth integration
- Email/Password login
- Role-based access control
- Secure session management

### Authorization
- Firestore security rules
- Role verification on every request
- Users can't modify own role
- Admin-only actions protected

### Data Privacy
- Users see only their data
- Artisans see relevant jobs
- Admins have full access
- Encrypted connections

### File Upload Security
- Size limits enforced
- File type validation
- Authenticated uploads only
- Secure storage in Firebase

---

## 🚀 Real-Time Features

### Job Status Updates
- Instant status changes
- Live notifications
- Real-time dashboard updates

### Wallet Balance
- Live balance updates
- Transaction confirmations
- Real-time deductions

### Location Tracking
- Artisan location sharing
- Client can track artisan
- Privacy controls

### Availability Status
- Artisan online/offline toggle
- Instant status propagation
- Job alert system

---

## 📱 User Interface

### Design Principles
- Clean, modern aesthetic
- Intuitive navigation
- Mobile-responsive
- Accessible colors
- Clear status indicators

### Component Library
- Tailwind CSS styling
- Consistent color scheme
- Brand-aligned design
- Professional UI elements

### Dashboard Headers
- Role-specific headers
- Quick stats display
- Easy logout access
- Branding consistency

---

## 🔄 Data Collections

### Firestore Collections

1. **profiles**
   - User information
   - Role assignment
   - Account status
   - Contact details

2. **jobs**
   - Service requests
   - Job assignments
   - Status tracking
   - Budget allocation

3. **wallets**
   - Balance tracking
   - Total deposits
   - Total spent/earned
   - Total cash-outs

4. **transactions**
   - Financial records
   - Transaction types
   - Amount tracking
   - Timestamp logs

5. **artisanLocations**
   - Real-time positions
   - Job-specific tracking
   - Privacy-controlled

---

## 🎯 Key Differentiators

### For Clients
- ✨ Pre-funded wallet (fast payments)
- 🔍 Real-time job tracking
- 📊 Transparent billing
- 🔒 Secure transactions

### For Artisans
- 💰 Quick earnings access
- 📱 Mobile-friendly dashboard
- 🎯 Job matching
- 💳 Easy cash-out

### For Admins
- 📊 Comprehensive analytics
- 👥 User management
- 💼 Job assignment
- 💰 Financial oversight

---

## 📈 Scalability

### Current Capacity
- Unlimited users (Firebase scales)
- Real-time sync for all
- Multiple admin support
- Concurrent job handling

### Future Enhancements
- Payment gateway integration
- SMS notifications
- Email alerts
- Mobile apps
- Advanced analytics
- Reporting tools

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Firebase (Serverless) |
| **Database** | Firestore (NoSQL) |
| **Auth** | Firebase Authentication |
| **Storage** | Firebase Storage |
| **Hosting** | Vercel |
| **Maps** | Google Maps API |

---

## 📋 Admin Quick Reference

### Daily Tasks
- ✅ Check platform overview
- ✅ Review new jobs
- ✅ Monitor transactions
- ✅ Address user issues

### Weekly Tasks
- ✅ Analyze completion rates
- ✅ Review revenue trends
- ✅ Check suspended accounts
- ✅ Optimize job assignments

### Monthly Tasks
- ✅ Generate reports
- ✅ User growth analysis
- ✅ Financial summaries
- ✅ System performance review

---

## 🎓 Getting Started Guide

### For New Clients
1. Register account
2. Navigate to `/client/dashboard`
3. Deposit funds to wallet
4. Submit service request
5. Track job progress
6. Pay from wallet

### For New Artisans
1. Register account
2. Navigate to `/artisan/dashboard`
3. Toggle availability online
4. Browse available jobs
5. Accept jobs
6. Complete work & earn

### For New Admins
1. User account created
2. Role set to "admin" in Firestore
3. Login and go to `/admin/dashboard`
4. Review platform overview
5. Explore management features
6. Monitor activities

---

## 📞 Support Resources

- **Setup Guide**: CREATE_ADMIN.md
- **Firebase Config**: FIREBASE_SETUP.md
- **Admin Guide**: ADMIN_DASHBOARD_GUIDE.md
- **Main Docs**: README.md
- **This Document**: FEATURES_OVERVIEW.md

---

## ✅ System Status Indicators

### Job Status Colors
- 🟡 **Requested**: Awaiting assignment
- 🔵 **Accepted**: Artisan assigned
- 🟣 **In Progress**: Work ongoing
- 🟢 **Completed**: Job finished
- 🔴 **Cancelled**: Job terminated

### User Status
- 🟢 **Active**: Normal access
- 🔴 **Suspended**: Access blocked

### Transaction Status
- ✅ **Completed**: Successful
- ⏳ **Pending**: Processing
- ❌ **Failed**: Unsuccessful

---

**Last Updated**: 2025
**Version**: 1.0
**Platform**: Phixall Facility Management

