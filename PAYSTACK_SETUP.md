# Paystack Payment Integration Setup

This guide will help you set up Paystack payment integration for the Phixall platform.

## Prerequisites

1. A Paystack account ([Sign up here](https://dashboard.paystack.com/signup))
2. Node.js and npm installed
3. Firebase project configured

## Step 1: Get Your Paystack API Keys

1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy your **Test Public Key** and **Test Secret Key**
4. For production, use your **Live Keys** (requires business verification)

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Paystack Payment Gateway
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

**Important:** Never commit your `.env.local` file to version control!

## Step 3: Set Up Webhook URL

Webhooks allow Paystack to notify your application about payment events.

1. In your Paystack Dashboard, go to **Settings** → **API Keys & Webhooks**
2. Click on **Webhooks** tab
3. Add your webhook URL: `https://yourdomain.com/api/payments/webhook`
4. For local development, use [ngrok](https://ngrok.com/) to create a public URL:
   ```bash
   ngrok http 3000
   # Use the HTTPS URL: https://xxxx.ngrok.io/api/payments/webhook
   ```

## Step 4: Test the Integration

### Test Card Details

Use these test cards provided by Paystack:

| Card Number | CVV | PIN | Expiry | OTP |
|-------------|-----|-----|--------|-----|
| 4084084084084081 | 408 | 0000 | Any future date | 123456 |
| 5060666666666666666 | 123 | 1234 | Any future date | 123456 |

### Test Bank Transfer

1. Select "Bank Transfer" as payment method
2. Paystack will generate a virtual account
3. In test mode, the payment auto-completes after 10 seconds

## Features Implemented

### 1. **Payment Processing**
- Credit/Debit card payments
- Bank transfers
- USSD payments
- Mobile money
- QR code payments

### 2. **API Endpoints**

#### Initialize Payment
```
POST /api/payments/initialize
```
Request body:
```json
{
  "email": "user@example.com",
  "amount": 5000,
  "jobId": "job123",
  "userId": "user123",
  "type": "job_payment"
}
```

#### Verify Payment
```
GET /api/payments/verify?reference=PXL-1234567890-123456
```

#### Webhook Endpoint
```
POST /api/payments/webhook
```
Automatically processes payment events from Paystack.

### 3. **UI Components**

#### PaymentButton Component
```tsx
import PaymentButton from '@/components/payments/PaymentButton';

<PaymentButton
  email={user.email}
  amount={5000}
  userId={user.uid}
  jobId={job.id}
  type="job_payment"
  onSuccess={(reference) => console.log('Payment successful:', reference)}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

#### BankAccountForm Component
```tsx
import BankAccountForm from '@/components/payments/BankAccountForm';

<BankAccountForm
  userId={user.uid}
  onSuccess={() => console.log('Bank account saved')}
  onError={(error) => console.error('Error:', error)}
/>
```

### 4. **Wallet Integration**
- Fund wallet via Paystack
- View transaction history
- Track balance
- Quick amount buttons

Access wallet at: `/client/wallet`

## Payment Types

The integration supports multiple payment types:

1. **job_payment** - Payment for specific jobs
2. **wallet_funding** - Add money to user wallet
3. **subscription** - Recurring subscription payments

## Security Best Practices

1. **Environment Variables**: Never expose secret keys in client-side code
2. **Webhook Verification**: All webhooks are verified using HMAC signatures
3. **Amount Validation**: Always validate amounts on the server
4. **HTTPS Only**: Use HTTPS in production for all payment requests
5. **PCI Compliance**: Paystack handles card data, so you don't need PCI compliance

## Testing Webhooks Locally

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

3. In another terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the HTTPS URL (e.g., `https://xxxx.ngrok.io`)

5. Update your Paystack webhook URL to: `https://xxxx.ngrok.io/api/payments/webhook`

6. Test a payment - you should see the webhook event in your console

## Going Live

### Before going live:

1. **Complete Paystack Business Verification**
   - Submit business documents
   - Wait for approval (usually 24-48 hours)

2. **Switch to Live Keys**
   ```bash
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxx
   ```

3. **Update Webhook URL** to your production domain

4. **Test Thoroughly** with small amounts before full launch

5. **Set Up Settlements**
   - Configure payout schedule in Dashboard
   - Add bank account for settlements

## Payouts to Phixers

The integration includes functions for paying out Phixers:

```typescript
import { createTransferRecipient, initiateTransfer } from '@/lib/paystackServer';

// Create recipient
const recipient = await createTransferRecipient({
  type: 'nuban',
  name: 'John Doe',
  account_number: '0123456789',
  bank_code: '058', // GTBank
});

// Initiate transfer
const transfer = await initiateTransfer({
  amount: 500000, // ₦5,000 in kobo
  recipient: recipient.data.recipient_code,
  reason: 'Payment for Job #123',
});
```

## Common Issues & Solutions

### Issue: "Invalid API Key"
**Solution**: Ensure you're using the correct key (test vs live) and that it's properly set in `.env.local`

### Issue: Webhook not receiving events
**Solution**: 
- Check webhook URL is publicly accessible
- Verify webhook URL in Paystack dashboard
- Check server logs for errors

### Issue: Payment succeeds but not reflecting in database
**Solution**:
- Check Firestore security rules
- Verify webhook signature validation
- Check server logs for errors

## Support

- Paystack Documentation: https://paystack.com/docs
- Paystack Support: support@paystack.com
- Test API in Postman: https://documenter.getpostman.com/view/2770716/paystack-api/7187aQ8

## Next Steps

1. Set #1000 as minimum amount in client wallet before service request is sent. This amount (#1000) will be held and will be part of overall bill at job completion.
2. Integrate payment buttons in job creation flow
3. Add subscription payments for premium features
4. Implement automatic payouts to Phixers
5. Add payment analytics dashboard
6. Set up payment reminders and notifications

