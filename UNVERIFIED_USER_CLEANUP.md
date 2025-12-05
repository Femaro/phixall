# Unverified User Cleanup System

This system automatically deletes user accounts that register but don't verify their email within a specified period.

## Overview

When users register on Phixall, they receive an email verification link. If they don't verify their email within the specified period (default: 7 days), their account and associated data are automatically deleted to keep the database clean.

## How It Works

1. **Registration**: When a user registers, their profile is created with:
   - `emailVerified: false`
   - `createdAt: serverTimestamp()` (Firestore timestamp)

2. **Cleanup Job**: A scheduled job runs daily (configured via Vercel Cron) that:
   - Finds all profiles with `emailVerified: false`
   - Checks if `createdAt` is older than the cleanup period
   - Deletes the user from:
     - Firebase Authentication
     - Firestore `profiles` collection
     - Related data (wallets, onboarding data)

## Configuration

### Environment Variables

Add to your `.env.local` (development) and Vercel (production):

```bash
# Optional: Override default cleanup period (in days)
UNVERIFIED_USER_CLEANUP_DAYS=7

# Optional: Secret token to protect the cleanup endpoint
CRON_SECRET=your-secret-token-here
```

### Vercel Cron Configuration

The cleanup job is configured in `vercel.json` to run daily at 2 AM UTC:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-unverified-users",
      "schedule": "0 2 * * *"
    }
  ]
}
```

To change the schedule, update the `schedule` field using [cron syntax](https://crontab.guru/).

## Manual Execution

You can manually trigger the cleanup job:

### Via API (with authentication)

```bash
curl -X POST https://your-domain.vercel.app/api/admin/cleanup-unverified-users \
  -H "Authorization: Bearer your-cron-secret"
```

### Via API (with custom days)

```bash
curl -X POST "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?days=14" \
  -H "Authorization: Bearer your-cron-secret"
```

### Via GET (for testing)

```bash
curl "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?days=7"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Cleanup completed. Deleted 5 unverified user(s)",
  "deletedCount": 5,
  "totalFound": 5,
  "cutoffDate": "2025-01-15T02:00:00.000Z",
  "days": 7,
  "deletedUsers": ["userId1", "userId2", ...],
  "errors": null
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

## What Gets Deleted

When an unverified user is cleaned up, the following data is deleted:

1. **Firebase Authentication**: User account
2. **Firestore `profiles` collection**: User profile document
3. **Firestore `wallets` collection**: User wallet (if exists)
4. **Firestore `phixer_onboarding` collection**: Onboarding data (if exists)

## Security

The cleanup endpoint can be protected with a `CRON_SECRET` environment variable. When set, requests must include:

```
Authorization: Bearer <CRON_SECRET>
```

Vercel Cron automatically includes this header when configured.

## Monitoring

Check Vercel logs to monitor cleanup job execution:

1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by the cleanup endpoint path
3. Review execution logs and any errors

## Customization

### Change Cleanup Period

**Option 1: Environment Variable**
```bash
UNVERIFIED_USER_CLEANUP_DAYS=14
```

**Option 2: Query Parameter**
```
/api/admin/cleanup-unverified-users?days=14
```

### Change Schedule

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-unverified-users",
      "schedule": "0 3 * * *"  // 3 AM UTC instead of 2 AM
    }
  ]
}
```

## Troubleshooting

### Cleanup not running

1. **Check Vercel Cron is enabled**: Vercel Cron is available on Pro plans and above
2. **Check logs**: Review Vercel deployment logs for errors
3. **Manual test**: Try calling the endpoint manually to verify it works

### Users not being deleted

1. **Check `emailVerified` field**: Ensure it's set to `false` for unverified users
2. **Check `createdAt` field**: Ensure it's a valid Firestore Timestamp or ISO string
3. **Check cutoff date**: Verify the cutoff date calculation is correct

### Permission errors

1. **Check Firebase Admin SDK**: Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is configured
2. **Check permissions**: Service account must have permission to delete users

## Testing

To test the cleanup manually:

1. Create a test user account
2. Don't verify the email
3. Wait or manually set `createdAt` to an old date
4. Call the cleanup endpoint manually
5. Verify the user is deleted

## Notes

- The cleanup job handles both Firestore Timestamp and ISO string formats for `createdAt` (for backward compatibility)
- The job filters unverified users in memory after querying (to handle different timestamp formats)
- Errors during deletion of individual users are logged but don't stop the cleanup process
- The response includes a list of deleted user IDs (limited to first 10 for response size)

