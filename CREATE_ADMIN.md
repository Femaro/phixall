# Creating an Admin User

To access the Admin Dashboard, you need to create an admin user in Firebase Firestore.

## Steps:

### Option 1: Using Firebase Console (Recommended)

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project
3. Navigate to **Firestore Database**
4. Find or create a user in the `profiles` collection
5. Make sure the document has these fields:
   ```json
   {
     "role": "admin",
     "name": "Admin User",
     "email": "admin@phixall.com",
     "status": "active",
     "createdAt": [Timestamp]
   }
   ```
6. The document ID should match the user's Firebase Auth UID

### Option 2: Manual Registration + Update

1. Register a new user through your app's signup flow
2. After registration, go to Firestore Database
3. Find the user's profile document (in the `profiles` collection)
4. Edit the document and change the `role` field from `"client"` or `"artisan"` to `"admin"`

## Accessing the Admin Dashboard

Once you have an admin user:

1. Login with the admin credentials at `/login`
2. Navigate to `/admin/dashboard`
3. You'll see the full admin interface with:
   - **Overview**: Dashboard statistics and recent activity
   - **User Management**: Manage clients and artisans (suspend/activate)
   - **Job Management**: Assign artisans to jobs, set budgets
   - **Billing & Finance**: Monitor all transactions and revenue
   - **Analytics**: Platform performance metrics

## Admin Features

### User Management
- View all clients and artisans
- Suspend or activate user accounts
- Search and filter users

### Job Management
- View all jobs across the platform
- Assign artisans to unassigned jobs
- Set budgets for jobs
- Track job status and progress

### Billing & Finance
- Monitor total revenue and pending payments
- View all platform transactions
- Track completed jobs
- Financial analytics

### Resource Allocation
- Set job budgets
- Allocate funds to specific jobs
- Monitor resource utilization

### Analytics
- Platform-wide statistics
- Completion rates
- Average job values
- Active job monitoring

## Security Notes

- Only users with `role: "admin"` can access the admin dashboard
- Regular users (clients/artisans) will be redirected if they try to access admin routes
- Make sure to keep admin credentials secure
- Consider implementing 2FA for admin accounts in production

