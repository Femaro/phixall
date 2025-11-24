# Paystack Environment Variables Example

Add these to your `.env.local` file:

```bash
# Paystack Payment Gateway
# Get these from https://dashboard.paystack.com/#/settings/developer

# For Testing
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key_here

# For Production (after business verification)
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
# PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here
```

## How to Get Your Keys

1. Sign up at [Paystack](https://dashboard.paystack.com/signup)
2. Navigate to Settings → API Keys & Webhooks
3. Copy your Test Public Key and Test Secret Key
4. Add them to `.env.local`

**Never commit your `.env.local` file to Git!**

