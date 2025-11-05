# Admin Dashboard Guide

## Overview

The Phixall Admin Dashboard is a comprehensive project management system that allows administrators to oversee all platform activities, manage users, assign jobs, handle billing, and monitor analytics.

## Access

- **URL**: `/admin/dashboard`
- **Requirements**: User must have `role: "admin"` in Firestore `profiles` collection
- **Redirect**: Non-admin users attempting to access will be redirected to home page

## Dashboard Features

### 1. Overview Tab 📊

The landing page provides a high-level view of platform activities:

**Key Metrics Cards:**
- **Total Clients**: Number of registered client users
- **Total Artisans**: Number of registered artisan users
- **Active Jobs**: Jobs currently in progress or pending
- **Total Revenue**: Sum of all completed transactions

**Recent Activity Sections:**
- **Recent Jobs**: Last 5 jobs with status indicators
- **Recent Transactions**: Last 5 financial transactions

**Use Cases:**
- Quick platform health check
- Monitor recent activities
- Identify trends at a glance

---

### 2. User Management Tab 👥

Manage all clients and artisans on the platform:

**Client Management:**
- View all registered clients
- See client status (Active/Suspended)
- Suspend or activate client accounts
- Quick access to client information

**Artisan Management:**
- View all registered artisans
- See artisan status (Active/Suspended)
- Suspend or activate artisan accounts
- Monitor artisan performance

**Actions Available:**
- **Suspend**: Temporarily disable a user's account
- **Activate**: Re-enable a suspended account
- **Add User**: Create new client or artisan accounts (button ready for implementation)

**Best Practices:**
- Review user activity before suspension
- Document suspension reasons
- Communicate status changes to users

---

### 3. Job Management Tab 💼

Complete job lifecycle management and resource allocation:

**Job Overview:**
- View all platform jobs
- Filter by status (Requested, Accepted, In-Progress, Completed, Cancelled)
- See client and artisan details
- Monitor budget allocation

**Assign Artisan:**
- Click "Assign Artisan" on unassigned jobs
- Select from active artisan list
- Job status automatically updates to "Accepted"
- Artisan receives job details

**Set Budget:**
- Click "Set Budget" on jobs without budget
- Enter budget amount in Naira (₦)
- Budget appears on job card
- Used for resource allocation tracking

**Job Card Information:**
- Job title and description
- Current status badge
- Client name
- Assigned artisan (if any)
- Budget amount (if set)
- Service category

**Use Cases:**
- Manually assign artisans to urgent jobs
- Balance workload across artisans
- Set project budgets for cost tracking
- Monitor job completion rates

---

### 4. Billing & Finance Tab 💰

Financial management and transaction monitoring:

**Financial Overview Cards:**
- **Total Revenue**: All-time platform earnings
- **Pending Payments**: Jobs completed but not yet paid
- **Completed Jobs**: Number of successfully finished jobs

**Transaction List:**
- View all platform transactions in chronological order
- Transaction types: Deposit, Payment, Earning, Cash-out
- Color-coded indicators:
  - Green: Deposits, Earnings (money in)
  - Red: Payments, Cash-outs (money out)
- Status tracking: Completed, Pending, Failed

**Transaction Details:**
- Transaction type
- Amount in Naira (₦)
- Date and time
- Status indicator
- User associated with transaction

**Use Cases:**
- Monitor cash flow
- Identify payment issues
- Track platform revenue
- Verify transaction completion
- Generate financial reports

---

### 5. Analytics Tab 📈

Platform performance metrics and insights:

**Key Performance Indicators:**
- **Total Jobs**: All-time job count
- **Completion Rate**: Percentage of jobs completed successfully
- **Average Job Value**: Mean transaction amount per job
- **Active Rate**: Percentage of jobs currently active

**Metrics Breakdown:**
- Success rate calculations
- Job completion trends
- Platform activity levels
- Revenue per job analysis

**Future Enhancements:**
- Revenue trend charts (placeholder ready)
- User growth graphs
- Service category breakdown
- Geographic distribution

**Use Cases:**
- Track platform growth
- Identify successful services
- Monitor user engagement
- Plan business strategy

---

## Admin Functions

### Assigning Jobs

1. Navigate to **Job Management** tab
2. Find a job with status "Requested"
3. Click **Assign Artisan** button
4. Select an artisan from the dropdown
5. Click **Assign Job**
6. Job status automatically changes to "Accepted"

**Why assign manually?**
- Priority or urgent jobs
- Specific skill requirements
- Load balancing across artisans
- VIP client requests

### Setting Job Budgets

1. Navigate to **Job Management** tab
2. Find a job without a budget
3. Click **Set Budget** button
4. Enter budget amount in Naira
5. Click **Set Budget**
6. Budget appears on job card

**Budget Purposes:**
- Cost tracking
- Resource allocation
- Financial planning
- Client billing reference

### Managing User Status

1. Navigate to **User Management** tab
2. Find the user (Client or Artisan section)
3. Click **Suspend** or **Activate** button
4. Status updates immediately
5. User access is affected immediately

**When to suspend:**
- Violation of terms of service
- Customer complaints
- Fraudulent activity
- Account security issues

**When to activate:**
- Issue resolved
- User appeal approved
- Account verification complete

---

## Dashboard Header

The purple gradient header includes:

- **Admin Crown Icon** (👑): Quick visual identifier
- **Dashboard Title**: "Admin Dashboard"
- **Subtitle**: "Phixall Management Console"
- **Admin Email**: Currently logged-in administrator
- **Sign Out Button**: Secure logout

---

## Security Features

- **Role-based access**: Only users with `role: "admin"` can access
- **Automatic redirect**: Non-admin users redirected to home
- **Real-time updates**: Dashboard data syncs with Firebase
- **Audit trail**: Admin actions tracked with timestamps
- **Secure authentication**: Firebase Auth integration

---

## Data Synchronization

The dashboard uses Firebase real-time listeners for:
- User profiles (clients and artisans)
- Job updates
- Transaction records
- Wallet balances

**Benefits:**
- Instant updates without refresh
- Multiple admins can work simultaneously
- No data conflicts
- Always current information

---

## Tips & Best Practices

### User Management
- ✅ Review user history before suspension
- ✅ Document reasons for status changes
- ✅ Monitor suspended users for pattern detection
- ❌ Don't suspend without investigation

### Job Management
- ✅ Assign jobs to available artisans
- ✅ Set realistic budgets based on job scope
- ✅ Monitor job completion rates
- ❌ Don't reassign without artisan confirmation

### Financial Management
- ✅ Regularly review transaction logs
- ✅ Investigate failed transactions
- ✅ Track revenue trends weekly
- ❌ Don't ignore pending payments

### Analytics
- ✅ Check completion rates regularly
- ✅ Identify popular service categories
- ✅ Use data for business decisions
- ❌ Don't rely on single metrics

---

## Keyboard Shortcuts (Future Enhancement)

Planned shortcuts for efficiency:
- `Alt + O`: Overview tab
- `Alt + U`: User Management tab
- `Alt + J`: Job Management tab
- `Alt + B`: Billing tab
- `Alt + A`: Analytics tab

---

## Common Workflows

### New Job Workflow
1. Job appears in "Job Management" with "Requested" status
2. Admin reviews job details
3. Admin assigns appropriate artisan
4. Admin sets job budget
5. Artisan begins work
6. Monitor in "Overview" tab

### User Issue Workflow
1. Identify problematic user
2. Navigate to "User Management"
3. Review user's job history (future feature)
4. Suspend if necessary
5. Document reason in system notes (future feature)
6. Communicate with user

### Financial Review Workflow
1. Navigate to "Billing & Finance"
2. Review total revenue vs. pending
3. Check recent transactions
4. Identify any failed payments
5. Generate report (future feature)
6. Take corrective action

---

## Troubleshooting

### Can't access dashboard
- **Check**: User role is set to "admin" in Firestore
- **Check**: User is logged in with correct account
- **Check**: Browser console for error messages

### Data not loading
- **Check**: Firebase connection is active
- **Check**: Security rules are deployed
- **Check**: Network connection is stable

### Actions not working
- **Check**: Admin permissions in Firestore rules
- **Check**: Browser console for errors
- **Check**: Firebase project configuration

---

## Future Enhancements

Planned features for upcoming releases:

### Enhanced Analytics
- Revenue trend charts (Chart.js integration)
- User growth graphs
- Service category breakdown
- Geographic heat maps

### Advanced Filters
- Job filtering by date, status, category
- User search functionality
- Transaction filtering by type, date
- Export to CSV/PDF

### Notifications
- Real-time alerts for new jobs
- Low wallet balance warnings
- Failed transaction alerts
- User activity notifications

### Reporting
- Automated daily/weekly reports
- Custom date range reports
- Performance metrics export
- Financial summaries

### Communication
- In-app messaging to users
- Email templates
- SMS notifications
- Announcement system

---

## Support

For technical support or feature requests:
- Check Firebase Console for errors
- Review security rules deployment
- Verify admin user setup
- Contact development team

## Related Documentation

- [CREATE_ADMIN.md](./CREATE_ADMIN.md) - How to create admin users
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- Security rules documentation
- API reference (future)

