import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { materialId, action, adminId, markup, procurementMethod, adminNotes, materialName, quantity, unitCost } = body;

    if (!materialId || !action || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { firestore } = getFirebaseAdmin();
    const materialRef = firestore.collection('materialRecommendations').doc(materialId);
    const materialDoc = await materialRef.get();

    if (!materialDoc.exists) {
      return NextResponse.json(
        { error: 'Material recommendation not found' },
        { status: 404 }
      );
    }

    const materialData = materialDoc.data();
    if (!materialData) {
      return NextResponse.json(
        { error: 'Material data not found' },
        { status: 404 }
      );
    }

    const jobId = materialData.jobId;

    // Get admin name
    const adminDoc = await firestore.collection('profiles').doc(adminId).get();
    const adminName = adminDoc.data()?.name || 'Admin';

    if (action === 'approve') {
      // Update material with admin modifications
      const finalName = materialName || materialData.materialName;
      const finalQuantity = quantity || materialData.quantity;
      const finalUnitCost = unitCost || materialData.unitCost;
      const finalCost = finalQuantity * finalUnitCost;
      const markupAmount = markup ? (finalCost * markup) / 100 : 0;
      const finalCostWithMarkup = finalCost + markupAmount;

      await materialRef.update({
        status: 'approved',
        materialName: finalName,
        quantity: finalQuantity,
        unitCost: finalUnitCost,
        totalCost: finalCost,
        adminMarkup: markup || 0,
        finalCost: finalCostWithMarkup,
        procurementMethod: procurementMethod || 'phixer',
        adminNotes: adminNotes || null,
        approvedBy: adminId,
        approvedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Add timeline event
      await firestore.collection('jobTimeline').add({
        jobId,
        type: 'material-approved',
        description: `Material "${finalName}" approved by ${adminName}`,
        userId: adminId,
        userName: adminName,
        metadata: {
          materialId,
          materialName: finalName,
          quantity: finalQuantity,
          unitCost: finalUnitCost,
          markup: markup || 0,
          procurementMethod: procurementMethod || 'phixer',
        },
        createdAt: FieldValue.serverTimestamp(),
      });

      // Check if all materials are approved, then generate invoice
      const materialsSnapshot = await firestore
        .collection('materialRecommendations')
        .where('jobId', '==', jobId)
        .get();
      const allMaterials = materialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const allApproved = allMaterials.every(m => m.status === 'approved' || m.status === 'rejected');
      const approvedMaterials = allMaterials.filter(m => m.status === 'approved');

      if (allApproved && approvedMaterials.length > 0) {
        // Generate invoice
        const subtotal = approvedMaterials.reduce((sum: number, m: any) => sum + (m.finalCost || m.totalCost || 0), 0);
        const markupAmountTotal = approvedMaterials.reduce((sum: number, m: any) => sum + ((m.finalCost || m.totalCost || 0) - (m.totalCost || 0)), 0);
        const serviceFee = subtotal * 0.1; // 10% service fee
        const grandTotal = subtotal + serviceFee;

        // Get job data for client info
        const jobDoc = await firestore.collection('jobs').doc(jobId).get();
        const jobData = jobDoc.data();

        const invoiceData = {
          jobId,
          clientId: jobData?.clientId || materialData.clientId,
          clientName: jobData?.clientName || 'Unknown',
          materials: approvedMaterials.map((m: any) => ({
            id: m.id,
            materialName: m.materialName,
            quantity: m.quantity,
            unitCost: m.unitCost,
            totalCost: m.totalCost,
            finalCost: m.finalCost || m.totalCost,
            markup: m.adminMarkup || 0,
          })),
          subtotal,
          markupAmount: markupAmountTotal,
          totalAmount: subtotal,
          serviceFee,
          grandTotal,
          status: 'pending',
          createdAt: FieldValue.serverTimestamp(),
        };

        const invoiceRef = await firestore.collection('materialInvoices').add(invoiceData);

        // Update job status
        await firestore.collection('jobs').doc(jobId).update({
          materialInvoiceId: invoiceRef.id,
          materialStatus: 'invoice-pending',
          updatedAt: FieldValue.serverTimestamp(),
        });

        // Add timeline event
        await firestore.collection('jobTimeline').add({
          jobId,
          type: 'invoice-sent',
          description: `Material invoice generated for ${approvedMaterials.length} material(s)`,
          userId: adminId,
          userName: adminName,
          metadata: {
            invoiceId: invoiceRef.id,
            totalAmount: grandTotal,
          },
          createdAt: FieldValue.serverTimestamp(),
        });

        // Send notification to client
        const clientId = jobData?.clientId;
        let clientEmail = jobData?.clientEmail;
        if (!clientEmail && clientId) {
          const clientProfileDoc = await firestore.collection('profiles').doc(clientId).get();
          clientEmail = clientProfileDoc.data()?.email;
        }

        if (clientEmail) {
          try {
            await sendTemplateEmail('material-invoice', clientEmail, {
              clientName: jobData?.clientName || 'Client',
              jobTitle: jobData?.title || 'Job',
              invoiceAmount: grandTotal.toLocaleString(),
              materialCount: approvedMaterials.length.toString(),
            });
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
          }
        }
      }

      return NextResponse.json(
        { success: true, message: 'Material approved successfully' },
        { status: 200 }
      );
    } else if (action === 'reject') {
      await materialRef.update({
        status: 'rejected',
        adminNotes: adminNotes || null,
        approvedBy: adminId,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Add timeline event
      await firestore.collection('jobTimeline').add({
        jobId,
        type: 'material-rejected',
        description: `Material "${materialData.materialName}" rejected by ${adminName}`,
        userId: adminId,
        userName: adminName,
        metadata: {
          materialId,
          materialName: materialData.materialName,
          action: 'rejected',
        },
        createdAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        { success: true, message: 'Material rejected' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error processing material approval:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process material approval' },
      { status: 500 }
    );
  }
}
