# Phixall Subscription Tiers System

## Overview
Premium subscription service for facility maintenance with three tiers: Bronze, Gold, and Platinum.

---

## 📊 Subscription Tiers

### 🥉 Bronze Tier - ₦25,000/month
**Included Services (3):**
- Basic Plumbing Repairs
- Electrical Troubleshooting
- General Maintenance

**Benefits:**
- 2 service calls per month
- Standard response time (24-48 hours)
- Basic priority support
- 5% discount on additional services

---

### 🥇 Gold Tier - ₦50,000/month
**Included Services (6):**
- All Bronze services PLUS:
- HVAC Maintenance
- Carpentry & Repairs
- Painting Touch-ups

**Benefits:**
- 5 service calls per month
- Priority response time (12-24 hours)
- Priority artisan assignment
- 10% discount on additional services
- Quarterly facility inspection

---

### 💎 Platinum Tier - ₦100,000/month
**Included Services (10):**
- All Gold services PLUS:
- Roofing Inspections & Repairs
- Landscaping & Gardening
- Deep Cleaning Services
- Emergency Repairs (24/7)

**Benefits:**
- Unlimited service calls
- Emergency response (2-4 hours)
- Dedicated account manager
- Premium artisan assignment
- 20% discount on additional services
- Monthly facility inspection
- Preventive maintenance planning

---

## 🎯 Service Categories by Tier

### Basic Services (All Tiers):
1. Basic Plumbing Repairs
2. Electrical Troubleshooting
3. General Maintenance

### Premium Services (Gold & Platinum):
4. HVAC Maintenance
5. Carpentry & Repairs
6. Painting Touch-ups

### Platinum-Only Services:
7. Roofing Inspections & Repairs
8. Landscaping & Gardening
9. Deep Cleaning Services
10. Emergency Repairs (24/7)

---

## 💳 Billing Structure

### Payment Cycle:
- Monthly recurring billing
- Auto-renewal on subscription date
- Payment methods: Card, Bank Transfer, Wallet

### Grace Period:
- 5 days grace period for failed payments
- Service suspension after grace period
- Automatic reactivation upon payment

### Cancellation:
- Cancel anytime
- Access until end of billing period
- No refunds for partial months

---

## 🔄 Subscription Workflow

### For Clients:
1. **Choose Tier** → Select Bronze, Gold, or Platinum
2. **Payment Setup** → Add payment method
3. **Subscribe** → Start subscription immediately
4. **Request Services** → Use included services anytime
5. **Manage** → Upgrade, downgrade, or cancel

### For Admins:
1. **Monitor Subscriptions** → View all active subscriptions
2. **Manage Tiers** → Update pricing and services
3. **Handle Billing** → Process payments and renewals
4. **Track Usage** → Monitor service call limits
5. **Generate Reports** → Revenue and usage analytics

---

## 📋 Database Schema

### `subscriptions` collection:
```typescript
{
  id: string;
  clientId: string;
  clientName: string;
  tier: 'bronze' | 'gold' | 'platinum';
  status: 'active' | 'suspended' | 'cancelled';
  startDate: Timestamp;
  endDate: Timestamp;
  nextBillingDate: Timestamp;
  monthlyPrice: number;
  paymentMethod: string;
  servicesUsed: number;
  servicesLimit: number;
  autoRenew: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `subscription_plans` collection:
```typescript
{
  id: string;
  tier: 'bronze' | 'gold' | 'platinum';
  name: string;
  price: number;
  servicesIncluded: string[];
  servicesLimit: number;
  responseTime: string;
  benefits: string[];
  discount: number;
  isActive: boolean;
}
```

### `subscription_usage` collection:
```typescript
{
  id: string;
  subscriptionId: string;
  clientId: string;
  month: string; // YYYY-MM
  servicesUsed: number;
  servicesRequested: Array<{
    jobId: string;
    service: string;
    date: Timestamp;
  }>;
}
```

---

## 🚀 Implementation Plan

### Phase 1: Core Setup
- [x] Define subscription tiers
- [ ] Create subscription data models
- [ ] Set up Firestore collections
- [ ] Update security rules

### Phase 2: Admin Features
- [ ] Subscription management dashboard
- [ ] Create/edit subscription plans
- [ ] View all subscriptions
- [ ] Subscription analytics
- [ ] Manual subscription management

### Phase 3: Client Features
- [ ] Subscription selection page
- [ ] Payment integration
- [ ] Subscription dashboard
- [ ] Usage tracking
- [ ] Upgrade/downgrade flow

### Phase 4: Billing
- [ ] Monthly billing automation
- [ ] Payment processing
- [ ] Failed payment handling
- [ ] Invoice generation
- [ ] Payment reminders

### Phase 5: Service Integration
- [ ] Tier-based service access
- [ ] Service call limits
- [ ] Priority assignment
- [ ] Discount application

---

## 🎨 UI Components Needed

### Client Pages:
1. **Subscription Plans Page** - Compare and select tiers
2. **Checkout Page** - Payment and confirmation
3. **My Subscription Page** - Current plan and usage
4. **Upgrade/Downgrade Page** - Change plans
5. **Billing History Page** - Past payments and invoices

### Admin Pages:
1. **Subscriptions Dashboard** - Overview and metrics
2. **Manage Plans** - Edit tier details
3. **Subscription List** - All client subscriptions
4. **Billing Queue** - Upcoming and failed payments
5. **Usage Reports** - Service call analytics

---

## 📊 Key Metrics to Track

### Subscription Metrics:
- Total active subscriptions by tier
- Monthly recurring revenue (MRR)
- Churn rate
- Upgrade/downgrade rate
- Average subscription lifetime

### Usage Metrics:
- Service calls per subscription
- Most requested services
- Average response time by tier
- Customer satisfaction by tier

### Financial Metrics:
- Revenue by tier
- Failed payment rate
- Refund rate
- Discount impact

---

## 🔐 Security & Rules

### Firestore Rules:
- Clients can read their own subscription
- Clients can create subscriptions
- Clients cannot modify active subscriptions (use admin)
- Admins can read/write all subscriptions
- Usage tracking limited to authenticated users

---

## 🎁 Promotional Ideas

### Launch Offers:
- First month 50% off
- Free upgrade to Gold for first 100 customers
- Refer a friend: 1 month free

### Loyalty Rewards:
- 6 months: 1 month free
- 12 months: Upgrade to next tier for 2 months
- 24 months: 10% lifetime discount

---

## 📱 Notifications

### Client Notifications:
- Subscription activated
- Upcoming renewal (5 days before)
- Payment successful
- Payment failed
- Service limit reached
- Subscription suspended
- Subscription reactivated

### Admin Notifications:
- New subscription
- Failed payment
- Subscription cancellation
- High usage alerts
- Upgrade/downgrade

---

**Ready to implement!** 🚀

