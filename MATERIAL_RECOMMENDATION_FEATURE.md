# Material Recommendation, Approval, Markup, Billing, and Revenue Automation Feature

## ✅ Implementation Complete

This document outlines the complete implementation of the material recommendation system for Phixall.

## 🎯 Feature Overview

The system enables Phixers to recommend materials during jobs, admins to approve/add markup, automatic invoice generation, client payment processing, and revenue automation.

## 📋 Components Implemented

### 1. **Type Definitions** (`src/types/materials.ts`)
- `MaterialRecommendation` - Material recommendation data structure
- `MaterialInvoice` - Invoice data structure
- `MaterialPayment` - Payment transaction structure
- `JobTimelineEvent` - Timeline event structure

### 2. **Phixer Side**

#### Material Recommendation Modal (`src/components/materials/MaterialRecommendationModal.tsx`)
- ✅ Material name input
- ✅ Quantity input
- ✅ Estimated unit cost input
- ✅ Photo upload (optional, max 5MB)
- ✅ Note field
- ✅ Automatic GPS location capture
- ✅ Automatic timestamp
- ✅ Real-time total cost calculation
- ✅ Integrated into Phixer dashboard "My Jobs" tab

**Location**: Phixer Dashboard → My Jobs → "Recommend Material" button (for in-progress jobs)

### 3. **Admin Dashboard**

#### Material Review Component (`src/components/materials/AdminMaterialReview.tsx`)
- ✅ Review interface for pending materials
- ✅ Approve/Reject actions
- ✅ Edit material details (name, quantity, cost)
- ✅ Set markup percentage
- ✅ Choose procurement method (Phixer will buy / Phixall will procure)
- ✅ Admin notes
- ✅ View approved/rejected materials
- ✅ Real-time updates via Firestore listeners

**Location**: Admin Dashboard → Jobs Tab → "Review Materials" button

### 4. **API Routes**

#### `/api/materials/recommend` (POST)
- Creates material recommendation
- Adds timeline event
- Stores GPS location and timestamp

#### `/api/materials/approve` (POST)
- Approves/rejects materials
- Applies admin markup
- Generates invoice when all materials are approved
- Sends email notification to client
- Updates job status

#### `/api/materials/pay` (POST)
- Processes material payment from client wallet
- Creates transaction records
- Updates invoice status
- Updates job status to "materials-paid"
- Sends payment confirmation email

#### `/api/jobs/complete` (POST)
- Processes final job completion payment
- Calculates revenue breakdown:
  - Service fee (10%)
  - Material cost
  - Markup revenue
  - Phixer payout
- Charges client
- Credits Phixer
- Records platform revenue
- Sends payout notification

### 5. **Email Notifications**

#### Email Template Added (`src/lib/emailTemplates.ts`)
- `material-invoice` - Sent to client when materials are approved

**Notification Flow**:
1. Material approved → Client receives email
2. Payment processed → Client receives confirmation
3. Job completed → Phixer receives payout notification

### 6. **Job Timeline Integration**

Timeline events automatically added:
- ✅ `material-recommended` - When Phixer recommends material
- ✅ `material-approved` - When admin approves material
- ✅ `invoice-sent` - When invoice is generated
- ✅ `material-paid` - When client pays for materials
- ✅ `material-procured` - (Ready for future implementation)
- ✅ `job-resumed` - When job completion is processed

### 7. **Firestore Security Rules**

Added rules for:
- ✅ `materialRecommendations` - Phixers can create, admins can approve
- ✅ `materialInvoices` - Admins create, clients read their own
- ✅ `jobTimeline` - Users can create events for their jobs

### 8. **Revenue Automation**

**On Job Completion**:
1. Client charged: Final amount
2. Service fee (10%): Deducted automatically
3. Material cost: Deducted from Phixer payout
4. Markup revenue: Added to platform revenue
5. Phixer payout: Remaining amount credited to Phixer wallet

**Revenue Breakdown**:
```
Final Amount: ₦10,000
├── Service Fee (10%): ₦1,000 → Platform
├── Material Cost: ₦2,000 → Deducted from payout
├── Markup Revenue: ₦200 → Platform
└── Phixer Payout: ₦6,800 → Phixer wallet
```

## 🔄 Workflow

### Material Recommendation Flow

1. **Phixer Recommends Material**
   - Phixer clicks "Recommend Material" on in-progress job
   - Fills form (name, quantity, cost, photo, note)
   - GPS location and timestamp captured automatically
   - Recommendation saved with status: `pending`

2. **Admin Reviews**
   - Admin clicks "Review Materials" on job
   - Views pending materials
   - Can edit details, set markup, choose procurement method
   - Approves or rejects each material

3. **Invoice Generation**
   - When all materials are reviewed (approved/rejected)
   - System automatically generates invoice
   - Calculates: subtotal, markup, service fee (10%), grand total
   - Job status updated to `material-invoice-pending`
   - Client receives email notification

4. **Client Payment**
   - Client views invoice in dashboard
   - Pays from wallet balance
   - Payment processed via `/api/materials/pay`
   - Job status updated to `materials-paid`
   - Client receives payment confirmation

5. **Job Completion**
   - Admin processes job completion
   - Final amount entered
   - System calculates:
     - Service fee (10%)
     - Material cost deduction
     - Markup revenue
     - Phixer payout
   - Client charged, Phixer credited
   - Platform revenue recorded

## 📊 Data Collections

### `materialRecommendations`
```typescript
{
  id: string;
  jobId: string;
  phixerId: string;
  phixerName: string;
  materialName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  photoUrl?: string;
  note?: string;
  location?: { lat, lng, address };
  status: 'pending' | 'approved' | 'rejected';
  adminMarkup?: number;
  finalCost?: number;
  procurementMethod?: 'phixer' | 'phixall';
  adminNotes?: string;
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;
}
```

### `materialInvoices`
```typescript
{
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  materials: MaterialRecommendation[];
  subtotal: number;
  markupAmount: number;
  totalAmount: number;
  serviceFee: number;
  grandTotal: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  paymentReference?: string;
  paidAt?: Timestamp;
  createdAt: Timestamp;
}
```

### `jobTimeline`
```typescript
{
  id: string;
  jobId: string;
  type: 'material-recommended' | 'material-approved' | 'invoice-sent' | 
        'material-paid' | 'material-procured' | 'job-resumed';
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}
```

## 🎨 UI Components

### Phixer Dashboard
- "Recommend Material" button on in-progress jobs
- Modal with form fields and photo upload
- Location capture indicator

### Admin Dashboard
- "Review Materials" button on job cards
- Material review modal with:
  - Pending materials list
  - Edit/Approve/Reject actions
  - Markup and procurement method settings
  - Approved/Rejected materials summary

## 🔐 Security

- ✅ Phixers can only create recommendations for their assigned jobs
- ✅ Admins can approve/reject all materials
- ✅ Clients can only view invoices for their jobs
- ✅ All operations require authentication
- ✅ Firestore security rules enforce access control

## 📝 Next Steps (Optional Enhancements)

1. **SMS Notifications**: Integrate SMS service for material approval notifications
2. **In-App Notifications**: Add real-time push notifications
3. **Material Procurement Tracking**: Track when materials are procured
4. **Material Inventory**: Track material stock levels
5. **Bulk Material Approval**: Approve multiple materials at once
6. **Material Templates**: Pre-defined material lists for common jobs
7. **Client Material Approval**: Allow clients to approve materials before admin review

## 🧪 Testing Checklist

- [ ] Phixer can recommend materials
- [ ] GPS location is captured
- [ ] Photo upload works (max 5MB)
- [ ] Admin can view pending materials
- [ ] Admin can edit material details
- [ ] Admin can set markup
- [ ] Admin can approve/reject materials
- [ ] Invoice is generated when all materials reviewed
- [ ] Client receives email notification
- [ ] Client can pay for materials
- [ ] Payment updates job status
- [ ] Job completion calculates revenue correctly
- [ ] Phixer receives correct payout
- [ ] Platform revenue is recorded
- [ ] Timeline events are created
- [ ] Security rules prevent unauthorized access

## 📚 Files Created/Modified

### New Files
- `src/types/materials.ts`
- `src/components/materials/MaterialRecommendationModal.tsx`
- `src/components/materials/AdminMaterialReview.tsx`
- `src/app/api/materials/recommend/route.ts`
- `src/app/api/materials/approve/route.ts`
- `src/app/api/materials/pay/route.ts`
- `src/app/api/jobs/complete/route.ts`

### Modified Files
- `src/app/(phixer)/phixer/dashboard/page.tsx` - Added material recommendation button
- `src/app/(admin)/admin/dashboard/page.tsx` - Added material review interface
- `src/lib/emailTemplates.ts` - Added material invoice template
- `src/components/support/SupportChat.tsx` - Updated to accept 'Phixer' role
- `firestore.rules` - Added security rules for new collections

---

**Status**: ✅ Feature Complete and Ready for Testing

