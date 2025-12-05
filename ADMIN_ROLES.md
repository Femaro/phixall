# Admin Role-Based Access Control

Phixall admin dashboard now supports three distinct admin roles with different permission levels.

## Admin Roles

### 1. Full Admin (`full_admin`)
- **Access**: Complete access to all features
- **Permissions**:
  - ✅ Create and manage admin users
  - ✅ Manage user roles
  - ✅ All user management operations
  - ✅ All job management operations
  - ✅ All billing and finance operations
  - ✅ All resource and material management
  - ✅ System settings and configuration
  - ✅ Analytics and reports
  - ✅ Support and knowledge base management

### 2. Manager (`manager`)
- **Access**: Operational management without financial control
- **Permissions**:
  - ✅ View and edit users (cannot delete)
  - ✅ Assign and manage jobs
  - ✅ Approve jobs and materials
  - ✅ Manage resources and materials
  - ✅ View analytics and reports
  - ✅ Manage support and knowledge base
  - ✅ Manage email templates
  - ❌ Cannot create admin users
  - ❌ Cannot manage roles
  - ❌ Limited billing access (view only)
  - ❌ Cannot approve bills
  - ❌ Cannot manage wallets
  - ❌ Cannot change system settings

### 3. Billing & Finance (`billing_finance`)
- **Access**: Financial operations and transactions
- **Permissions**:
  - ✅ View users (read-only)
  - ✅ View jobs (read-only)
  - ✅ Full billing and finance access
  - ✅ Approve bills
  - ✅ View and manage transactions
  - ✅ Manage wallets
  - ✅ View financial analytics and reports
  - ❌ Cannot assign jobs
  - ❌ Cannot manage resources
  - ❌ Cannot manage support
  - ❌ Cannot create admin users
  - ❌ Cannot manage roles

## Creating Admin Users

Only **Full Admin** users can create and manage other admin users.

### Steps to Create Admin User:

1. Log in as a Full Admin user
2. Navigate to **Admin Users** tab in the admin dashboard
3. Click **"Create Admin User"** button
4. Fill in the form:
   - **Name**: Full name of the admin user
   - **Email**: Email address (will be used for login)
   - **Password**: Initial password (minimum 6 characters)
   - **Role**: Select from Manager, Billing & Finance, or Full Admin
5. Click **"Create Admin User"**

The new admin user will be created with:
- Firebase Authentication account
- Firestore profile with the selected role
- Email verification automatically set to `true` (admin users don't need email verification)

## Managing Admin Users

### Changing User Roles

1. Go to **Admin Users** tab
2. Find the user in the table
3. Select a new role from the dropdown
4. Confirm the change

**Note**: You cannot change your own role.

### Deleting Admin Users

1. Go to **Admin Users** tab
2. Find the user in the table
3. Click **"Delete"** button
4. Confirm the deletion

**Note**: 
- You cannot delete your own account
- Only Full Admin users can delete admin users
- Deletion removes the user from both Firebase Auth and Firestore

## Role Permissions Matrix

| Feature | Full Admin | Manager | Billing & Finance |
|---------|-----------|---------|-------------------|
| Create Admin Users | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| View Users | ✅ | ✅ | ✅ (Read-only) |
| Edit Users | ✅ | ✅ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| View Jobs | ✅ | ✅ | ✅ (Read-only) |
| Assign Jobs | ✅ | ✅ | ❌ |
| Approve Jobs | ✅ | ✅ | ❌ |
| View Billing | ✅ | ❌ | ✅ |
| Approve Bills | ✅ | ❌ | ✅ |
| View Transactions | ✅ | ❌ | ✅ |
| Manage Wallets | ✅ | ❌ | ✅ |
| Manage Resources | ✅ | ✅ | ❌ |
| Approve Materials | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ |
| Manage Settings | ✅ | ❌ | ❌ |
| Manage Support | ✅ | ✅ | ❌ |
| Manage Emails | ✅ | ✅ | ❌ |

## Migration from Legacy Admin Role

Existing users with `role: 'admin'` are automatically treated as **Full Admin** for backward compatibility. The system recognizes both:
- `role: 'admin'` (legacy)
- `role: 'full_admin'` (new)

Both have the same permissions.

## Firestore Security Rules

The Firestore security rules have been updated to recognize all admin roles:

```javascript
function isAdmin() {
  return isAuthenticated() && 
         getUserProfileData() != null &&
         (getUserProfileData().role == 'admin' ||
          getUserProfileData().role == 'full_admin' ||
          getUserProfileData().role == 'manager' ||
          getUserProfileData().role == 'billing_finance');
}
```

## Best Practices

1. **Principle of Least Privilege**: Assign the minimum role necessary for each admin user's responsibilities
2. **Regular Audits**: Periodically review admin users and their roles
3. **Role Changes**: Document role changes and reasons
4. **Access Control**: Only Full Admins should have the ability to create/manage admin users
5. **Security**: Use strong passwords for admin accounts and consider enabling 2FA

## Troubleshooting

### "Access denied" error
- Check that your user has an admin role assigned
- Verify the role in Firestore `profiles` collection
- Ensure you're logged in with the correct account

### Cannot see "Admin Users" tab
- Only Full Admin users can see this tab
- Check your role in the profile

### Cannot create admin users
- Verify you have `full_admin` or `admin` role
- Check permissions in the admin dashboard

### Role dropdown is disabled
- You cannot change your own role
- Only Full Admin users can change roles

## API Integration

The role system is integrated with:
- Admin dashboard UI (permission-based tab visibility)
- Firestore security rules
- API route authorization (where applicable)
- Support chat system (admin role detection)

## Future Enhancements

Potential future improvements:
- Custom permission sets
- Role-based activity logging
- Time-based role assignments
- Multi-factor authentication for admin accounts
- Role-based email notifications

