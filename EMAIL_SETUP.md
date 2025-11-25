# Email Setup Guide - Resend Integration

This guide will help you set up email functionality for the Phixall platform using Resend.

## Step 1: Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, go to the [API Keys](https://resend.com/api-keys) page
2. Click "Create API Key"
3. Give it a name (e.g., "Phixall Production" or "Phixall Development")
4. Copy the API key (it starts with `re_`)
   - ⚠️ **Important**: Copy it immediately - you won't be able to see it again!

## Step 3: Add to Environment Variables

### For Local Development

1. Open your `.env.local` file in the project root
2. Add the following:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@phixall.com
FROM_NAME=Phixall
```

3. Replace `re_your_api_key_here` with your actual API key from Step 2
4. Save the file
5. **Restart your development server** for changes to take effect:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `RESEND_API_KEY` = `re_your_api_key_here`
   - `FROM_EMAIL` = `noreply@phixall.com` (or your verified domain)
   - `FROM_NAME` = `Phixall`
4. Redeploy your application

## Step 4: Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `phixall.com`)
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)
6. Update `FROM_EMAIL` in your environment variables to use your verified domain:
   ```bash
   FROM_EMAIL=noreply@phixall.com
   ```

## Step 5: Test Email Sending

1. Go to Admin Dashboard → Email Management
2. Click "Send Test Email"
3. Enter your email address
4. Click "Send"
5. Check your inbox for the test email

## Troubleshooting

### Error: "Email service not configured"
- **Solution**: Make sure `RESEND_API_KEY` is set in `.env.local` and you've restarted the dev server

### Error: "Failed to send email"
- **Solution**: 
  - Check that your API key is correct
  - Verify your Resend account is active
  - Check the browser console for detailed error messages

### Emails going to spam
- **Solution**: 
  - Verify your domain in Resend
  - Use a verified domain email address in `FROM_EMAIL`
  - Set up SPF and DKIM records (Resend provides these)

### Rate Limits
- **Free Tier**: 3,000 emails/month
- **Paid Plans**: Start at $20/month for 50,000 emails

## Email Templates Available

The system includes these pre-built templates:

1. **Application Received** - Sent when someone applies for a job
2. **Application Shortlisted** - Sent when admin shortlists an application
3. **Application Rejected** - Sent when admin rejects an application
4. **Job Assigned** - Sent when a job is assigned to a Phixer
5. **Job Completed** - Sent when a job is completed
6. **Payment Received** - Sent when payment is confirmed
7. **Payout Processed** - Sent when Phixer earnings are paid out

## Custom Emails

You can also send custom emails from the Admin Dashboard:
1. Go to **Email Management** tab
2. Select a template (optional) or write a custom email
3. Enter recipient(s), subject, and message
4. Use `{{variableName}}` for dynamic content
5. Click "Send Email"

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Check Resend dashboard for delivery status
4. Review [Resend Documentation](https://resend.com/docs)

---

**Need Help?** Check `ENVIRONMENT_SETUP.md` for complete environment configuration.

