# Checkr Background Check Integration

## Overview

This integration adds automated background checks for US artisans during the onboarding process using the [Checkr API](https://docs.checkr.com/). When a US artisan completes all training modules, a background check is automatically initiated and the results are included in the admin review report.

## Features

- ✅ Automatic background check initiation for US artisans
- ✅ Non-blocking - application submission continues even if background check fails
- ✅ Real-time status updates in admin dashboard
- ✅ Full report viewing in admin review interface
- ✅ Only applies to US users (location-aware)

## Setup

### 1. Get Checkr API Credentials

1. Sign up for a Checkr account at https://checkr.com/
2. Navigate to Settings → API Keys
3. Copy your **Secret API Key** (starts with `sk_`)

### 2. Configure Environment Variable

Add to your `.env.local` file:

```bash
CHECKR_SECRET_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

For Vercel deployment, add this in:
- Vercel Dashboard → Project Settings → Environment Variables

### 3. Get Credentialed

Before using Checkr in production, you need to:
1. Complete Checkr's credentialing process
2. Request a staging account for testing
3. Get approved for production use

See: https://docs.checkr.com/docs/get-credentialed

## How It Works

### 1. Onboarding Completion

When a US artisan completes all training modules:

1. System detects user is in US (via `isUSUserClient()`)
2. Automatically calls `/api/checkr/initiate` endpoint
3. Creates Checkr candidate with artisan information
4. Initiates background check report
5. Stores Checkr IDs in onboarding record

### 2. Background Check Process

The background check includes:
- **SSN Trace** - Verifies identity and address history
- **National Criminal Search** - Checks national criminal databases
- **Sex Offender Registry Search** - Checks sex offender registries
- **Global Watchlist Search** - Checks international watchlists

Package used: `tasker_standard` (designed for gig workers/taskers)

### 3. Admin Review

When admin reviews the application:

1. Background check status is displayed prominently
2. Status badges show: `pending`, `clear`, `consider`, `suspended`
3. Admin can click "Refresh Report Status" to get latest results
4. Full report data is fetched and displayed
5. Report is included in the approval decision

## API Endpoints

### POST `/api/checkr/initiate`

Initiates a background check for a US artisan.

**Request Body:**
```json
{
  "userId": "user123",
  "artisanData": {
    "isUS": true,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1 (555) 123-4567",
    "zipCode": "12345",
    "state": "CA",
    "idType": "drivers-license",
    "idNumber": "D1234567",
    "bvn": "1234"  // SSN last 4 digits
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidateId": "e44aa283528c197fde4b6f6c",
    "reportId": "4722c07ddcaa10c433c235d7",
    "invitationId": "4722c07ddcaa10c433c235d8"
  }
}
```

### GET `/api/checkr/report?reportId={reportId}`

Fetches the latest background check report status and data.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4722c07ddcaa10c433c235d7",
    "status": "clear",
    "created_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T11:45:00Z",
    "package": "tasker_standard",
    "candidate_id": "e44aa283528c197fde4b6f6c",
    // ... full report data
  }
}
```

## Data Structure

### Onboarding Record (Firestore)

```typescript
{
  // ... other onboarding fields
  checkrBackgroundCheck: {
    candidateId: string;        // Checkr candidate ID
    reportId: string;            // Checkr report ID
    invitationId?: string;       // Optional invitation ID
    initiatedAt: Date;           // When check was initiated
    status: 'pending' | 'clear' | 'consider' | 'suspended' | 'canceled' | 'error';
    completedAt?: Date;          // When check completed
    reportData?: any;           // Full Checkr report data
  }
}
```

## Status Meanings

| Status | Meaning | Action |
|--------|---------|--------|
| `pending` | Background check in progress | Wait for completion |
| `clear` | No issues found | Safe to approve |
| `consider` | Some items to review | Review report details before approval |
| `suspended` | Significant issues found | Review carefully, may need to reject |
| `canceled` | Check was canceled | May need to re-initiate |
| `error` | Error occurred | Check logs, may need to re-initiate |

## Admin Dashboard Integration

The background check information appears in the admin dashboard:

1. **Status Badge** - Color-coded status indicator
2. **Report Details** - Candidate ID, Report ID, timestamps
3. **Refresh Button** - Fetches latest report status
4. **Full Report** - Complete Checkr report data when available

Location: Admin Dashboard → Registration Tab → Application Details

## Error Handling

- **Non-blocking**: If background check fails, application still submits
- **Logging**: All errors are logged to console
- **Retry**: Admin can manually refresh report status
- **Fallback**: Application can be approved even if background check fails (admin decision)

## Security Considerations

1. **API Key**: Never expose `CHECKR_SECRET_API_KEY` in client-side code
2. **SSN**: Only last 4 digits are sent to Checkr (stored in `bvn` field for US users)
3. **PII**: All PII is handled securely through Checkr's encrypted API
4. **Access Control**: Only admins can view background check results

## Testing

### Staging Environment

1. Use Checkr staging account credentials
2. Test with sample data
3. Verify report status updates
4. Test error scenarios

### Production Checklist

- [ ] Checkr account credentialed and approved
- [ ] Production API key configured
- [ ] Environment variable set in Vercel
- [ ] Test with real US artisan
- [ ] Verify report appears in admin dashboard
- [ ] Test report refresh functionality

## Troubleshooting

### Background Check Not Initiating

1. Check if user is detected as US user
2. Verify `CHECKR_SECRET_API_KEY` is set
3. Check browser console for errors
4. Verify API route is accessible

### Report Status Stuck on "Pending"

1. Check Checkr dashboard for report status
2. Some reports can take 24-48 hours
3. Use "Refresh Report Status" button
4. Check Checkr webhooks (if configured)

### API Errors

1. Verify API key is correct
2. Check Checkr account status
3. Verify account is credentialed
4. Check API rate limits

## Webhooks (Optional)

For real-time updates, configure Checkr webhooks:

1. Go to Checkr Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/checkr/webhook`
3. Select events: `report.completed`, `report.updated`

Then create `/api/checkr/webhook/route.ts` to handle webhook events.

## Cost Considerations

- Checkr charges per background check
- `tasker_standard` package pricing varies
- Consider cost per artisan onboarding
- Factor into pricing model

## References

- [Checkr API Documentation](https://docs.checkr.com/)
- [Checkr Getting Started Guide](https://docs.checkr.com/docs/get-credentialed)
- [Checkr Package Types](https://docs.checkr.com/reference/packages)
- [Checkr Report Statuses](https://docs.checkr.com/reference/reports)

## Files Modified

- `src/lib/checkr.ts` - Checkr API client
- `src/app/api/checkr/initiate/route.ts` - Initiation endpoint
- `src/app/api/checkr/report/route.ts` - Report fetching endpoint
- `src/types/onboarding.ts` - Added `checkrBackgroundCheck` field
- `src/components/onboarding/TrainingModules.tsx` - Triggers background check
- `src/app/(admin)/admin/dashboard/page.tsx` - Displays background check results

