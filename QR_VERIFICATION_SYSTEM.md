# QR Code Verification System

## Overview
A secure QR code-based verification system that allows clients to verify that the correct Phixer has arrived for their job.

## System Architecture

### Components

1. **QR Code Generation (Phixer Mobile App)**
   - Generates time-limited QR code when Phixer arrives at job location
   - QR code contains: Job ID, Phixer ID, Timestamp, Verification Token
   - QR code expires after 1 hour
   - Auto-refreshes every 30 minutes

2. **QR Code Scanning (Client Web Dashboard)**
   - Client scans QR code from Phixer's mobile app
   - Validates QR code matches the assigned Phixer
   - Updates job status to "in-progress" after verification
   - Records verification timestamp

3. **Security Features**
   - HMAC-SHA256 token verification
   - Time-based expiration (1 hour)
   - Job ID and Phixer ID matching
   - Server-side validation

## Implementation Details

### QR Code Data Structure
```json
{
  "jobId": "job_123",
  "phixerId": "phixer_456",
  "timestamp": 1234567890,
  "token": "hmac_sha256_hash"
}
```

### Verification Flow

1. **Phixer Arrives at Location**
   - Opens job detail in mobile app
   - Clicks "Show Verification QR Code"
   - QR code is generated and displayed

2. **Client Verification**
   - Opens job in web dashboard
   - Clicks "Verify Phixer" button
   - Scans QR code from Phixer's phone
   - System validates and updates job status

3. **Verification Success**
   - Job status changes to "in-progress"
   - `clientVerified: true` is set
   - `clientVerifiedAt` timestamp is recorded
   - Both parties receive notification

## Security Considerations

1. **Token Generation**: Uses HMAC-SHA256 with secret key
2. **Expiration**: QR codes expire after 1 hour
3. **Validation**: Server-side validation ensures data integrity
4. **Location Verification**: Can be combined with location broadcast
5. **Rate Limiting**: Prevent abuse with request limits

## Additional Verification Methods (Future)

1. **Photo Verification**: Client takes photo of Phixer
2. **PIN Code**: 6-digit PIN displayed on Phixer app
3. **Biometric**: Fingerprint/face verification
4. **NFC**: Tap-to-verify using NFC tags

## Benefits

- ✅ Prevents unauthorized Phixers from accessing job sites
- ✅ Provides audit trail of verification
- ✅ Easy to use (scan and verify)
- ✅ Works offline (QR code contains all needed data)
- ✅ Time-limited security (expires automatically)


