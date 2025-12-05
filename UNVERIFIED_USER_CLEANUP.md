# Unverified User Cleanup System

This system automatically deletes user accounts that register but don't verify their email within a specified period (default: 48 hours).

## How It Works

1. When a user registers, their profile is created with `emailVerified: false` and a `createdAt` timestamp
2. A scheduled cron job runs every 6 hours to check for unverified users
3. Users who registered more than 48 hours ago (configurable) and haven't verified their email are deleted
4. Both the Firebase Auth user and Firestore profile are removed

## Configuration

### 1. Set Cleanup Secret Token (Optional but Recommended)

For security, set a secret token in your environment variables:

**Vercel:**
- Go to Settings → Environment Variables
- Add: `CLEANUP_SECRET_TOKEN` = `your-random-secret-token-here`
- Select all environments (Production, Preview, Development)

**Local (.env.local):**
```bash
CLEANUP_SECRET_TOKEN=your-random-secret-token-here
```

### 2. Cron Job Configuration

The cron job is already configured in `vercel.json` to run every 6 hours:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-unverified-users",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule Format:** `"0 */6 * * *"` means "every 6 hours at minute 0"
- To run every 12 hours: `"0 */12 * * *"`
- To run daily at midnight: `"0 0 * * *"`
- To run every 4 hours: `"0 */4 * * *"`

### 3. Update Cron Path with Token (If Using Token)

If you set `CLEANUP_SECRET_TOKEN`, update `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-unverified-users?token=YOUR_SECRET_TOKEN",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

⚠️ **Note:** This exposes the token in the config file. For better security, consider using Vercel's environment variables in the endpoint logic instead.

## API Endpoint

### Endpoint
`GET /api/admin/cleanup-unverified-users` or `POST /api/admin/cleanup-unverified-users`

### Parameters

**Query Parameters (GET) or Body (POST):**
- `hours` (optional): Number of hours to wait before deleting (default: 48)
- `dryRun` (optional): If `true`, only reports what would be deleted without actually deleting
- `token` (optional): Authentication token (required if `CLEANUP_SECRET_TOKEN` is set in production)

### Examples

**Dry run (test what would be deleted):**
```bash
curl "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?dryRun=true&hours=48"
```

**Manual cleanup (delete users older than 24 hours):**
```bash
curl -X POST "https://your-domain.vercel.app/api/admin/cleanup-unverified-users" \
  -H "Content-Type: application/json" \
  -d '{"hours": 24, "token": "your-secret-token"}'
```

**With Authorization header:**
```bash
curl "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?hours=48" \
  -H "Authorization: Bearer your-secret-token"
```

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Cleanup completed. Deleted 5 unverified users.",
  "deletedCount": 5,
  "failedCount": 0,
  "thresholdHours": 48
}
```

**Dry Run:**
```json
{
  "success": true,
  "message": "[DRY RUN] Would delete 5 unverified users",
  "deletedCount": 5,
  "users": [
    {"uid": "user1", "email": "user1@example.com"},
    {"uid": "user2", "email": "user2@example.com"}
  ],
  "dryRun": true
}
```

**No users to delete:**
```json
{
  "success": true,
  "message": "No unverified users found to clean up",
  "deletedCount": 0,
  "dryRun": false
}
```

## Customization

### Change Default Time Period

To change the default from 48 hours to a different value, update the endpoint:

```typescript
const hoursThreshold = parseInt(
  body.hours || searchParams.get('hours') || '72', // Changed to 72 hours
  10
);
```

### Change Cron Schedule

Edit `vercel.json` to change how often the cleanup runs:

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup-unverified-users",
      "schedule": "0 */12 * * *"  // Every 12 hours instead of 6
    }
  ]
}
```

## Monitoring

### Check Cleanup Status

1. Go to Vercel Dashboard → Your Project → Functions
2. Look for cron job executions
3. Check logs for cleanup results

### Manual Testing

Test the cleanup endpoint manually:

```bash
# Dry run to see what would be deleted
curl "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?dryRun=true"

# Actually run cleanup
curl "https://your-domain.vercel.app/api/admin/cleanup-unverified-users?token=your-token"
```

## Security Considerations

1. **Token Protection**: Always set `CLEANUP_SECRET_TOKEN` in production to prevent unauthorized access
2. **Cron Security**: Vercel cron jobs run from trusted sources, but adding a token provides extra security
3. **Rate Limiting**: The endpoint processes deletions in batches to avoid overwhelming the system

## Troubleshooting

### Cleanup Not Running

1. Check Vercel cron job status in the dashboard
2. Verify `vercel.json` is properly configured
3. Check function logs for errors

### Users Not Being Deleted

1. Verify users have `emailVerified: false` in their profile
2. Check that `createdAt` timestamp is older than the threshold
3. Run a dry run to see what would be deleted: `?dryRun=true`

### Permission Errors

1. Ensure Firebase Admin SDK is properly configured
2. Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is set in Vercel
3. Check that the service account has permissions to delete users

## Related Files

- `src/app/api/admin/cleanup-unverified-users/route.ts` - Cleanup endpoint
- `vercel.json` - Cron job configuration
- `src/lib/firebaseAdmin.ts` - Firebase Admin SDK initialization
- `src/components/auth/RegisterForm.tsx` - User registration logic

