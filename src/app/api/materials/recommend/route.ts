import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, phixerId, materialName, quantity, unitCost, photoUrl, note, location } = body;

    // Validate required fields
    if (!jobId || !phixerId || !materialName || !quantity || !unitCost) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = getFirebaseServer();

    // Get Phixer name
    const profileDoc = await getDoc(doc(db, 'profiles', phixerId));
    const profileData = profileDoc.data();
    const phixerName = profileData?.name || 'Unknown';

    // Create material recommendation
    const materialData = {
      jobId,
      phixerId,
      phixerName,
      materialName: materialName.trim(),
      quantity: parseInt(quantity),
      unitCost: parseFloat(unitCost),
      totalCost: parseInt(quantity) * parseFloat(unitCost),
      photoUrl: photoUrl || null,
      note: note?.trim() || null,
      location: location || null,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const materialRef = await addDoc(collection(db, 'materialRecommendations'), materialData);

    // Add timeline event
    await addDoc(collection(db, 'jobTimeline'), {
      jobId,
      type: 'material-recommended',
      description: `Material "${materialName}" recommended by ${phixerName}`,
      userId: phixerId,
      userName: phixerName,
      metadata: {
        materialName,
        quantity: parseInt(quantity),
        unitCost: parseFloat(unitCost),
        materialId: materialRef.id,
      },
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, materialId: materialRef.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating material recommendation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create material recommendation' },
      { status: 500 }
    );
  }
}

